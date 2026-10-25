import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  QrCode,
  Droplets,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  Eye,
  SlidersHorizontal,
  Coins,
  Check,
  User,
} from 'lucide-react';
import { BottleOption, StudentProfile, CampusTelemetryData, ValveSignalStatus } from '../types.ts';
import { BOTTLE_OPTIONS } from '../data/mockData.ts';
import { BottleVisual } from './BottleVisual.tsx';
import { EditProfileModal } from './EditProfileModal.tsx';
import { soundFx } from '../utils/audio.ts';

interface StationKioskProps {
  student: StudentProfile;
  telemetry: CampusTelemetryData;
  onPourComplete: (bottle: BottleOption) => void;
  onToggleAuth: () => void;
  onUpdateStudent: (updated: Partial<StudentProfile>) => void;
  isAuthenticated: boolean;
}

export const StationKiosk: React.FC<StationKioskProps> = ({
  student,
  telemetry,
  onPourComplete,
  onToggleAuth,
  onUpdateStudent,
  isAuthenticated,
}) => {
  const [selectedBottle, setSelectedBottle] = useState<BottleOption>(BOTTLE_OPTIONS[0]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [pourProgress, setPourProgress] = useState<number>(0);
  const [currentMl, setCurrentMl] = useState<number>(0);
  const [flowRate, setFlowRate] = useState<number>(1.2);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());
  
  const pourIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Compute Hardware Valve State
  let valveStatus: ValveSignalStatus = 'LOCKED_DISALLOWED';
  if (isScanning) {
    valveStatus = 'SCANNING';
  } else if (isPouring) {
    valveStatus = 'DISPENSING';
  } else if (selectedBottle.isAllowed) {
    valveStatus = 'READY_GREEN';
  } else if (selectedBottle.statusLevel === 'danger') {
    valveStatus = 'LOCKED_DISALLOWED';
  } else {
    valveStatus = 'LOCKED_UNCERTAIN';
  }

  // The Fill Button is ONLY active when Geçerli Matara Doğrulandığında (ve profil doğrulanmışken)
  const isBottleAiApproved = selectedBottle.isAllowed && !isScanning;
  const canStartPour = isAuthenticated && isBottleAiApproved && !isPouring;

  // Sound mute toggle
  const handleToggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    soundFx.setMuted(nextState);
  };

  // Optical YOLOv8 Vision Scan Simulation Trigger
  const handleSelectBottle = (bottle: BottleOption) => {
    if (isPouring) return;

    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);

    setIsScanning(true);
    setSelectedBottle(bottle);
    setPourProgress(0);
    setCurrentMl(0);

    soundFx.playTone('scan');

    // Simulate 600ms AI inference & hardware sensor verification
    scanTimeoutRef.current = setTimeout(() => {
      setIsScanning(false);
      if (bottle.isAllowed) {
        soundFx.playTone('scan');
      } else if (bottle.id === 'single_use_pet') {
        soundFx.playTone('error');
      } else {
        soundFx.playTone('warn');
      }
    }, 600);
  };

  // Handle start pouring: 4-second smooth animated fill bar with 1.2 L/min flow rate
  const handleStartPour = () => {
    if (!canStartPour) return;

    setIsPouring(true);
    setPourProgress(0);
    setCurrentMl(0);

    const durationSec = 4; // 4 saniyelik pürüzsüz animasyonlu dolum
    soundFx.startWaterStream(durationSec);

    const startTime = Date.now();
    const targetMl = selectedBottle.volumeMl;

    pourIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(100, (elapsed / durationSec) * 100);
      const mlFilled = Math.min(targetMl, Math.round((progress / 100) * targetMl));

      // Hall effect sensor simulated flow ~1.20 L/dk
      const dynamicFlow = parseFloat((1.20 + Math.sin(elapsed * 5) * 0.04).toFixed(2));

      setPourProgress(progress);
      setCurrentMl(mlFilled);
      setFlowRate(dynamicFlow);

      if (progress >= 100) {
        if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
        finishPouring();
      }
    }, 40);
  };

  const finishPouring = () => {
    setIsPouring(false);
    setPourProgress(100);
    setCurrentMl(selectedBottle.volumeMl);
    soundFx.stopWaterStream();
    soundFx.playSuccessChime();

    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0284c7', '#10b981', '#38bdf8', '#34d399', '#fde047'],
      });
    } catch {
      // Confetti fallback
    }

    onPourComplete(selectedBottle);
    setShowCompletionModal(true);
  };

  const handleStopPour = () => {
    if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
    setIsPouring(false);
    soundFx.stopWaterStream();
    soundFx.playTone('warn');
  };

  const handleReset = () => {
    if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    setIsPouring(false);
    setIsScanning(false);
    setPourProgress(0);
    setCurrentMl(0);
    setShowCompletionModal(false);
  };

  useEffect(() => {
    return () => {
      if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
      if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      soundFx.stopWaterStream();
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      
      {/* 3. QR Giriş & Profil Kartı (Akışın Başında Sade Kart) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Student Identity Lockup */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            {student.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ZL'}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                {student.fullName}
              </span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                {student.studentId}
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {student.dormBlock}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span>
                Kayıtlı Matara: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{student.registeredBottleVolume} ml</strong> ({student.registeredBottleType})
              </span>
              <span>·</span>
              <span>
                Günlük Hedef: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{student.dailyWaterGoalLiters.toFixed(1)} L</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: LıkırPuan Balance, [Profili Düzenle] & [QR Tara] Actions */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-700">
          
          <div className="text-left md:text-right">
            <div className="text-[10px] text-slate-400 font-medium">Mevcut Bakiye</div>
            <div className="font-mono font-extrabold text-base sm:text-lg text-emerald-600 dark:text-emerald-400">
              {student.points} <span className="text-xs font-sans font-semibold">LıkırPuan</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* [Profili Düzenle] Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>Profili Düzenle</span>
            </button>

            {/* [QR Tara] Button */}
            <button
              onClick={onToggleAuth}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                isAuthenticated
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  : 'bg-slate-900 dark:bg-sky-600 text-white hover:bg-slate-800 dark:hover:bg-sky-500'
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>QR Doğrulandı</span>
                </>
              ) : (
                <>
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Tara</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Minimalist Canlı Etki Sayaçları (Canlı Güncellenen Sayaç Çubuğu) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Kurtarılan PET</div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-sky-600 dark:text-sky-400 mt-0.5">
              {telemetry.preventedPetBottles.toLocaleString('tr-TR')}
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            +1 Şişe
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Cep Tasarrufu</div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {telemetry.studentSavingsTl.toLocaleString('tr-TR')} <span className="text-xs font-sans font-normal text-slate-400">TL</span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            +15 TL
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Kazanılan Puan</div>
            <div className="text-lg sm:text-xl font-extrabold font-mono text-amber-500 dark:text-amber-400 mt-0.5">
              {student.points} <span className="text-xs font-sans font-normal text-slate-400">LıkırPuan</span>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
            +10 Puan
          </span>
        </div>
      </div>

      {/* Main Grid: Left Alcove Viewport & Right 2-Step Interactive Station Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Col (5 cols): Real-time Dispenser Bay & Bottle Graphic */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <BottleVisual
            bottle={selectedBottle}
            isPouring={isPouring}
            isScanning={isScanning}
            valveStatus={valveStatus}
            progressPercent={pourProgress}
            currentMl={currentMl}
          />

          {/* Solenoid Valve & Hall Effect Flow Status */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Solenoid Su Vanası & Güvenlik Kilidi
              </span>
              <span className={`font-mono text-[11px] font-bold ${
                selectedBottle.isAllowed && !isScanning
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {isScanning ? 'TARANIYOR' : selectedBottle.isAllowed ? 'VANA: AÇILABİLİR' : 'DONANIM KİLİTLİ'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Debi Simülasyonu</div>
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  1.2 L/dk (Hall Effect)
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Otomatik Kesme</div>
                <div className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {selectedBottle.volumeMl} ml Limitli
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col (7 cols): Vision Detection & Smart Pour Action */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* Section 1: Yapay Zeka Kamera Taraması & Yanlış Dolum Kilidi */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Yapay Zeka Kamera Taraması & Kap Seçimi (Core AI)
                </h3>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                {isScanning ? 'YOLOv8 TARANIYOR...' : 'YOLOv8 HAZIR'}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Yapay zeka onaylı bir matara tespit etmeden su vanası kesinlikle açılmaz:
            </p>

            {/* 4 Test Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BOTTLE_OPTIONS.map((bottle, idx) => {
                const isSelected = selectedBottle.id === bottle.id;
                return (
                  <button
                    key={bottle.id}
                    onClick={() => handleSelectBottle(bottle)}
                    disabled={isPouring}
                    className={`p-3 text-left rounded-xl transition-all border text-xs font-medium relative ${
                      isSelected
                        ? bottle.statusLevel === 'success'
                          ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                          : bottle.statusLevel === 'danger'
                          ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20'
                          : 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-[13px] flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400">Test {idx + 1}:</span>
                        <span className="truncate">{bottle.name}</span>
                      </div>
                      {isSelected && (
                        <span className="shrink-0 ml-1">
                          {isScanning ? (
                            <Eye className="w-4 h-4 text-sky-500 animate-pulse" />
                          ) : bottle.statusLevel === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : bottle.statusLevel === 'danger' ? (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          )}
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between mt-1">
                      <span>{bottle.materialTag}</span>
                      <span className="font-mono font-semibold">{bottle.volumeMl} ml</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* AI Decision Result Banner */}
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                isScanning
                  ? 'border-sky-300 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200'
                  : selectedBottle.statusLevel === 'success'
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : selectedBottle.statusLevel === 'danger'
                  ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
                  : 'border-amber-300 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
              }`}
            >
              {isScanning ? (
                <Eye className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5 animate-pulse" />
              ) : selectedBottle.statusLevel === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : selectedBottle.statusLevel === 'danger' ? (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              )}

              <div className="space-y-1">
                <div className="font-bold text-sm flex items-center gap-2">
                  <span>{isScanning ? 'Optik Tarama & Çıkarım Yapılıyor...' : selectedBottle.statusTitle}</span>
                  {!isScanning && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      selectedBottle.isAllowed
                        ? 'bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-100'
                        : 'bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-100'
                    }`}>
                      {selectedBottle.isAllowed ? 'VANA: AÇILABİLİR' : 'VANA: KİLİTLİ'}
                    </span>
                  )}
                </div>
                <div className="text-[12px] opacity-95 leading-relaxed">
                  {isScanning
                    ? 'Yüksek çözünürlüklü sensör ve YOLOv8 modeli kap geometrisini işliyor...'
                    : selectedBottle.statusMessage}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Akıllı Dolum Tetikleme & Telemetri */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Akıllı Dolum Başlatma
                </h3>
              </div>

              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {isPouring ? (
                  <span className="text-sky-600 dark:text-sky-400 font-semibold animate-pulse">
                    DOLUM SÜRÜYOR ({flowRate} L/dk)
                  </span>
                ) : (
                  <span>
                    HEDEF: {selectedBottle.volumeMl} ml
                  </span>
                )}
              </div>
            </div>

            {/* 4-second smooth pouring animation & telemetry during pour */}
            {(isPouring || pourProgress > 0) && (
              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-bold">
                    <Droplets className="w-3.5 h-3.5 animate-bounce" />
                    {currentMl} ml dolduruldu
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Taşma Önleyici Sensör: <strong className="text-emerald-600 dark:text-emerald-400">Aktif ({currentMl > 0 ? currentMl - 2 : 0} ml / {selectedBottle.volumeMl} ml)</strong>
                  </span>
                </div>

                {/* 4-second animated fill bar */}
                <div className="w-full h-3.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 transition-all duration-75 rounded-full"
                    style={{ width: `${pourProgress}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Debi: {flowRate} L/dk · Basınç: 2.8 Bar</span>
                  <span>Sıcaklık: {telemetry.waterTempCelsius}°C Soğuk Arıtılmış</span>
                </div>
              </div>
            )}

            {/* Primary Action Button: Lıkır Lıkır Doldur */}
            <div className="flex items-center gap-3">
              {!isPouring ? (
                <button
                  onClick={handleStartPour}
                  disabled={!canStartPour}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2.5 shadow-md ${
                    canStartPour
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white cursor-pointer hover:shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  }`}
                >
                  {canStartPour ? (
                    <>
                      <Droplets className="w-5 h-5 text-sky-200" />
                      <span>Lıkır Lıkır Doldur!</span>
                      <span className="text-xs font-normal opacity-90">({selectedBottle.volumeMl} ml)</span>
                    </>
                  ) : isScanning ? (
                    <>
                      <Eye className="w-5 h-5 animate-pulse" />
                      <span>YOLOv8 Optik Tarama Yapılıyor...</span>
                    </>
                  ) : !selectedBottle.isAllowed ? (
                    <>
                      <Lock className="w-5 h-5 text-rose-500" />
                      <span>Vana Kilitli: Geçerli Matara Bekleniyor</span>
                    </>
                  ) : !isAuthenticated ? (
                    <>
                      <QrCode className="w-5 h-5" />
                      <span>QR Tara ile Kimlik Doğrulayın</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Matara Doğrulaması Bekleniyor</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleStopPour}
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-base bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Dolumu Durdur (Acil Stop)</span>
                </button>
              )}
            </div>

            {/* Inline Hint */}
            {!canStartPour && !isPouring && (
              <div className="text-[12px] text-slate-500 dark:text-slate-400 text-center">
                {!selectedBottle.isAllowed ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    Dolum butonu yalnızca onaylı döngüsel matara algılandığında aktifleşir.
                  </span>
                ) : !isAuthenticated ? (
                  <span className="text-sky-600 dark:text-sky-400 font-medium">
                    ℹ Lütfen üstteki profil kartından [QR Tara] butonuna basarak kimliğinizi doğrulayınız.
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={student}
        onSave={(updated) => {
          onUpdateStudent(updated);
          // If student updated registered bottle volume to 750ml, auto-switch to 750ml tritan if steel was selected
          if (updated.registeredBottleVolume === 750 && selectedBottle.id === 'steel_flask') {
            handleSelectBottle(BOTTLE_OPTIONS[1]);
          } else if (updated.registeredBottleVolume === 500 && selectedBottle.id === 'tritan_sports') {
            handleSelectBottle(BOTTLE_OPTIONS[0]);
          }
        }}
      />

      {/* Completion Modal / Celebration Toast */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Afiyet Olsun! Lıkır Lıkır Doldu!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                "Lıkır lıkır iç, döngüyü tamamla!" Mataranız hazır.
              </p>
            </div>

            {/* Direct Impact Telemetry Cards */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-800/60 text-center">
                <div className="text-sky-700 dark:text-sky-300 font-semibold text-[11px]">Kurtarılan PET</div>
                <div className="text-lg font-bold text-sky-950 dark:text-sky-100 font-mono mt-0.5">+1</div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-center">
                <div className="text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">Cep Tasarrufu</div>
                <div className="text-lg font-bold text-emerald-950 dark:text-emerald-100 font-mono mt-0.5">+15 TL</div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/60 text-center">
                <div className="text-amber-700 dark:text-amber-300 font-semibold text-[11px]">Kazanılan Puan</div>
                <div className="text-lg font-bold text-amber-950 dark:text-amber-100 font-mono mt-0.5">+10</div>
              </div>
            </div>

            <button
              onClick={() => setShowCompletionModal(false)}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white transition-colors"
            >
              Tamam, İstasyonu Hazırla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
