import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  Upload,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Droplets,
  Coins,
  Recycle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  QrCode,
  CreditCard,
  Gauge,
  Thermometer,
  Zap,
  Activity,
  Layers,
  Award,
  Check,
  Flame,
  Leaf,
} from 'lucide-react';
import { soundFx } from '../utils/audio.ts';

// Preset sample graphics for instant test
const PRESETS = [
  {
    id: 'steel_flask',
    name: 'LıkırLoop Çelik Matara (500 ml)',
    volumeMl: 500,
    isAllowed: true,
    confidence: 98.8,
    statusLevel: 'success' as const,
    title: 'Dolum Yetkisi Verildi (%98.8 Güven) - Döngüsel Kap Doğrulandı',
    message: 'SUS304 çift cidarlı onaylı matara tespit edildi. Otomatik 500 ml kalibrasyonu yapıldı.',
    svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><rect x="115" y="45" width="70" height="25" rx="4" fill="%2394a3b8"/><rect x="100" y="70" width="100" height="190" rx="16" fill="%230284c7"/><text x="150" y="165" fill="white" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">LıkırLoop</text><text x="150" y="190" fill="%23e0f2fe" font-family="sans-serif" font-size="12" text-anchor="middle">500 ml Çelik</text></svg>',
  },
  {
    id: 'tritan_bottle',
    name: 'Tritan Sporcu Matarası (750 ml)',
    volumeMl: 750,
    isAllowed: true,
    confidence: 96.4,
    statusLevel: 'success' as const,
    title: 'Dolum Yetkisi Verildi (%96.4 Güven) - Döngüsel Kap Doğrulandı',
    message: 'BPA-Free geniş hacimli sporcu matarası doğrulandı. 750 ml debi kotası tahsis edildi.',
    svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><rect x="115" y="40" width="70" height="25" rx="5" fill="%230f766e"/><rect x="95" y="65" width="110" height="200" rx="20" fill="%2310b981" fill-opacity="0.8"/><text x="150" y="165" fill="white" font-family="sans-serif" font-weight="bold" font-size="16" text-anchor="middle">TRİTAN SPOR</text><text x="150" y="190" fill="%23ccfbf1" font-family="sans-serif" font-size="12" text-anchor="middle">750 ml Matara</text></svg>',
  },
  {
    id: 'single_use_pet',
    name: 'Tek Kullanımlık PET Şişe',
    volumeMl: 500,
    isAllowed: false,
    confidence: 99.2,
    statusLevel: 'danger' as const,
    title: 'Dolum Engellendi',
    message: 'LıkırLoop tek kullanımlık plastik kabul etmez. Lütfen döngüsel mataranızı yerleştiriniz.',
    svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><rect x="130" y="45" width="40" height="20" rx="3" fill="%233b82f6"/><path d="M 115 100 L 115 250 C 115 258 122 265 130 265 L 170 265 C 178 265 185 258 185 250 L 185 100 Z" fill="%2360a5fa" fill-opacity="0.5"/><rect x="115" y="150" width="70" height="40" fill="%23ef4444" fill-opacity="0.3"/><text x="150" y="175" fill="%23fca5a5" font-family="sans-serif" font-weight="bold" font-size="10" text-anchor="middle">PET ŞİŞE</text><circle cx="150" cy="170" r="30" stroke="%23ef4444" stroke-width="3" fill="none"/><line x1="130" y1="150" x2="170" y2="190" stroke="%23ef4444" stroke-width="3"/></svg>',
  },
  {
    id: 'open_cup',
    name: 'Açık Bardak / Uygunsuz Kap',
    volumeMl: 250,
    isAllowed: false,
    confidence: 95.8,
    statusLevel: 'warning' as const,
    title: 'Taşma Riski Uyarısı',
    message: 'Taşma Riski: Lütfen kapaklı standart bir matara yerleştiriniz.',
    svgData: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><path d="M 100 90 L 120 250 L 180 250 L 200 90 Z" fill="%23f59e0b" fill-opacity="0.4" stroke="%23f59e0b" stroke-width="2"/><ellipse cx="150" cy="90" rx="50" ry="8" fill="%23fde68a" stroke="%23f59e0b"/><text x="150" y="180" fill="%23fde68a" font-family="sans-serif" font-weight="bold" font-size="12" text-anchor="middle">AÇIK BARDAK</text></svg>',
  },
];

export const LikirLoopTerminal: React.FC = () => {
  // Theme state: Soft Sand & Slate (#F8FAFC) vs Midnight Soft Slate (#0F172A)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('likirloop_terminal_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // default dark terminal
  });

  const [isMuted, setIsMuted] = useState<boolean>(soundFx.getMuted());

  // Input channel: 'camera' | 'upload' | 'preset'
  const [inputChannel, setInputChannel] = useState<'camera' | 'upload' | 'preset'>('preset');

  // Selected image for preview & analysis
  const [currentImage, setCurrentImage] = useState<string>(PRESETS[0].svgData);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('steel_flask');

  // WebRTC camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Vision Analysis State (Step 1)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [visionStatus, setVisionStatus] = useState<{
    isAllowed: boolean;
    confidence: number;
    statusLevel: 'success' | 'danger' | 'warning';
    title: string;
    message: string;
    volumeMl: number;
  }>({
    isAllowed: true,
    confidence: 98.8,
    statusLevel: 'success',
    title: 'Dolum Yetkisi Verildi (%98.8 Güven) - Döngüsel Kap Doğrulandı',
    message: 'SUS304 çift cidarlı onaylı matara tespit edildi. Otomatik 500 ml kalibrasyonu yapıldı.',
    volumeMl: 500,
  });

  // Step 2: Student RFID / Virtual QR Auth
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [student, setStudent] = useState({
    studentId: '#KYK-2026',
    fullName: 'Zeynep Liva Palamut',
    dormitory: 'KYK Konya Alaeddin Yurt Yerleşkesi - B Blok',
    points: 140,
    dailyQuotaRemainingLiters: 2.0,
  });

  // Step 3: Pouring Automation
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [pourProgress, setPourProgress] = useState<number>(0);
  const [currentMl, setCurrentMl] = useState<number>(0);
  const [flowRate, setFlowRate] = useState<number>(1.8);
  const [waterTemp] = useState<number>(8.5);
  const [showCompletionToast, setShowCompletionToast] = useState<boolean>(false);
  const pourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Live Telemetry Counters (Count-up on successful pour)
  const [stats, setStats] = useState({
    preventedPetBottles: 142856,
    targetBottles: 432000,
    studentSavingsTl: 2142840,
    preventedPlasticGrams: 4642820, // +32.5g per fill
    preventedCarbonGrams: 11828476, // +82.8g per fill
    systemHealthPercent: 88,
  });

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('likirloop_terminal_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('likirloop_terminal_theme', 'light');
    }
  }, [isDarkMode]);

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch {
      setCameraError('Kamera erişimi açılamadı. Lütfen izin veriniz veya dosya yükleme / hızlı demoyu kullanınız.');
      setIsCameraActive(false);
      setInputChannel('upload');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 480;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCurrentImage(dataUrl);
      setSelectedPresetId('');
      stopCamera();
      soundFx.playTone('scan');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCurrentImage(event.target.result as string);
          setSelectedPresetId('');
          soundFx.playTone('scan');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Select preset demo button
  const handleSelectPreset = (p: typeof PRESETS[0]) => {
    setSelectedPresetId(p.id);
    setCurrentImage(p.svgData);
    stopCamera();

    // Directly set preset result
    setVisionStatus({
      isAllowed: p.isAllowed,
      confidence: p.confidence,
      statusLevel: p.statusLevel,
      title: p.title,
      message: p.message,
      volumeMl: p.volumeMl,
    });

    if (p.isAllowed) {
      soundFx.playTone('scan');
    } else if (p.statusLevel === 'danger') {
      soundFx.playTone('error');
    } else {
      soundFx.playTone('warn');
    }
  };

  // "Kabı Tara ve Doğrula" Action Button
  const handleVerifyContainer = async () => {
    if (isAnalyzing || isPouring) return;
    setIsAnalyzing(true);
    soundFx.playTone('scan');

    // Simulate 600ms AI Vision scanning
    setTimeout(() => {
      setIsAnalyzing(false);

      if (selectedPresetId === 'single_use_pet') {
        setVisionStatus({
          isAllowed: false,
          confidence: 99.2,
          statusLevel: 'danger',
          title: 'Dolum Engellendi',
          message: 'Dolum Engellendi: LıkırLoop tek kullanımlık plastik kabul etmez. Lütfen döngüsel mataranızı yerleştiriniz.',
          volumeMl: 0,
        });
        soundFx.playTone('error');
      } else if (selectedPresetId === 'open_cup') {
        setVisionStatus({
          isAllowed: false,
          confidence: 95.8,
          statusLevel: 'warning',
          title: 'Taşma Riski Uyarısı',
          message: 'Taşma Riski: Lütfen kapaklı standart bir matara yerleştiriniz.',
          volumeMl: 0,
        });
        soundFx.playTone('warn');
      } else {
        // Approved reusable container
        const vol = selectedPresetId === 'tritan_bottle' ? 750 : 500;
        setVisionStatus({
          isAllowed: true,
          confidence: selectedPresetId === 'tritan_bottle' ? 96.4 : 98.8,
          statusLevel: 'success',
          title: 'Dolum Yetkisi Verildi (%98.8 Güven) - Döngüsel Kap Doğrulandı',
          message: `Döngüsel kap doğrulandı. ${vol} ml kalibre edildi. Vana doluma açıldı.`,
          volumeMl: vol,
        });
        soundFx.playTone('scan');
      }
    }, 650);
  };

  // Toggle RFID/QR auth
  const handleToggleAuth = () => {
    soundFx.playTone('scan');
    setIsAuthenticated((prev) => !prev);
  };

  // Check if Step 3 Pour button can be pressed
  const canStartPour = visionStatus.isAllowed && isAuthenticated && !isPouring && !isAnalyzing;

  // Start 5-second smooth water wave pour
  const handleStartPour = () => {
    if (!canStartPour) return;

    setIsPouring(true);
    setPourProgress(0);
    setCurrentMl(0);

    const targetMl = visionStatus.volumeMl || 500;
    const durationSec = 5; // 5 seconds interactive pour
    soundFx.startWaterStream(durationSec);

    const startTime = Date.now();

    pourIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const progress = Math.min(100, (elapsed / durationSec) * 100);
      const mlFilled = Math.min(targetMl, Math.round((progress / 100) * targetMl));

      // 1.8 L/dk simulated flow rate with subtle physical jitter
      const dynamicFlow = parseFloat((1.80 + Math.sin(elapsed * 4) * 0.05).toFixed(2));

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
    soundFx.stopWaterStream();
    soundFx.playSuccessChime();

    try {
      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#10b981', '#059669', '#38bdf8', '#0284c7', '#fde047'],
      });
    } catch {
      // Confetti fallback
    }

    // Instant count-up increments per prompt:
    // 1. Önlenen Toplam PET Şişe: +1
    // 2. Öğrenci Tasarrufu: +15 TL
    // 3. Önlenen Plastik Atık: +32.5 g
    // 4. Engellenen Karbon: +82.8 g CO2
    // 5. Kazanılan LıkırPuan: +10 Puan
    setStats((prev) => ({
      ...prev,
      preventedPetBottles: prev.preventedPetBottles + 1,
      studentSavingsTl: prev.studentSavingsTl + 15,
      preventedPlasticGrams: prev.preventedPlasticGrams + 32.5,
      preventedCarbonGrams: prev.preventedCarbonGrams + 82.8,
    }));

    setStudent((prev) => ({
      ...prev,
      points: prev.points + 10,
      dailyQuotaRemainingLiters: Math.max(0, parseFloat((prev.dailyQuotaRemainingLiters - (visionStatus.volumeMl / 1000)).toFixed(2))),
    }));

    setShowCompletionToast(true);
  };

  const handleStopPour = () => {
    if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
    setIsPouring(false);
    soundFx.stopWaterStream();
    soundFx.playTone('warn');
  };

  useEffect(() => {
    return () => {
      stopCamera();
      if (pourIntervalRef.current) clearInterval(pourIntervalRef.current);
      soundFx.stopWaterStream();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-[#1E293B] dark:text-[#E2E8F0] transition-colors duration-200">
      
      {/* 1. Terminal Header Lockup */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#0F172A]/95 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Terminal Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-xs">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  LıkırLoop
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                  "Lıkır lıkır iç, döngüyü tamamla!"
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Akıllı Döngüsel Su İstasyonu Terminali - Konya Yurtları (Alaeddin & Şems-i Tebrizi Yerleşkesi)
              </p>
            </div>
          </div>

          {/* Quick Controls: Audio & Eye-Care Theme Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = !isMuted;
                setIsMuted(next);
                soundFx.setMuted(next);
              }}
              title={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>

            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              title={isDarkMode ? 'Gündüz Moduna Geç (Soft Sand & Slate)' : 'Gece Moduna Geç (Midnight Soft Slate)'}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Terminal Body */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Canlı Kampüs Etki Sayacı & Telemetri Paneli (Impact & Telemetry Dashboard) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              Canlı Kampüs Etki Sayacı & Telemetri Paneli (Konya Yurtları)
            </span>
            <span className="font-mono text-[11px]">
              KESTİRİMCİ BAKIM: AKTİF · 12 İSTASYON ÇEVRİMİÇİ
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* Stat 1: Önlenen Toplam PET Şişe */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Önlenen PET Şişe</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">+1 / Dolum</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-sky-600 dark:text-sky-400 my-1">
                {stats.preventedPetBottles.toLocaleString('tr-TR')}
              </div>
              <div className="text-[10px] text-slate-400">Hedef: 432.000 Şişe</div>
            </div>

            {/* Stat 2: Öğrenci Tasarrufu */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Öğrenci Tasarrufu</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">+15 TL</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 my-1">
                {stats.studentSavingsTl.toLocaleString('tr-TR')} <span className="text-xs font-normal text-slate-400">TL</span>
              </div>
              <div className="text-[10px] text-slate-400">Kümülatif Cepte</div>
            </div>

            {/* Stat 3: Önlenen Plastik Atık */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Önlenen Plastik</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">+32.5 g</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-teal-600 dark:text-teal-400 my-1">
                {(stats.preventedPlasticGrams / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}{' '}
                <span className="text-xs font-normal text-slate-400">kg</span>
              </div>
              <div className="text-[10px] text-slate-400">Atık Bertarafı</div>
            </div>

            {/* Stat 4: Engellenen Karbon */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Engellenen Karbon</span>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">+82.8 g</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-slate-100 my-1">
                {(stats.preventedCarbonGrams / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })}{' '}
                <span className="text-xs font-normal text-slate-400">kg CO₂</span>
              </div>
              <div className="text-[10px] text-slate-400">Lojistik Tasarrufu</div>
            </div>

            {/* Stat 5: Kazanılan LıkırPuan */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>LıkırPuan Bakiye</span>
                <span className="text-[10px] font-mono text-amber-500 font-bold">+10 Puan</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-500 my-1">
                {student.points} <span className="text-xs font-normal text-slate-400">P</span>
              </div>
              <div className="text-[10px] text-slate-400">Kantin & Çamaşırhane</div>
            </div>

            {/* Stat 6: Donanım & Filtre Sağlığı */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Filtre & Sistem</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 my-1">
                %{stats.systemHealthPercent}{' '}
                <span className="text-xs font-normal text-slate-400">Sağlıklı</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">Ters Osmoz & Mineral</div>
            </div>
          </div>
        </section>

        {/* 3-Step Interactive Station Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Step 1 (Kap Tanıma & Vision Analizi) - 7 cols */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-5">
            
            <div className="space-y-4">
              {/* Step 1 Title */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      1. Adım: Kap Tanıma & Vision Analizi
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Cihaz kamerası, fotoğraf yükleme veya hızlı jüri demosu ile kabınızı doğrulayın
                    </p>
                  </div>
                </div>

                {/* Input Channel Switcher */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => {
                      setInputChannel('preset');
                      stopCamera();
                    }}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                      inputChannel === 'preset'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Hızlı Demo
                  </button>

                  <button
                    onClick={() => {
                      setInputChannel('camera');
                      startCamera();
                    }}
                    className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                      inputChannel === 'camera'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Kamera</span>
                  </button>

                  <label
                    className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      inputChannel === 'upload'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setInputChannel('upload');
                        stopCamera();
                        handleFileUpload(e);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Viewfinder / Image Preview Area */}
              <div className="relative w-full h-64 sm:h-72 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                {inputChannel === 'camera' ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
                    <div className="absolute inset-6 border-2 border-emerald-500/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                      <div className="flex justify-between text-[10px] font-mono text-emerald-400">
                        <span>CANLI KAMERA VİZÖRÜ</span>
                        <span>YOLOV8 / VISION AI</span>
                      </div>
                      <div className="text-center font-mono text-[11px] text-emerald-300 bg-black/60 py-1 px-3 rounded self-center backdrop-blur-xs">
                        Kabı çerçeve merkezine yerleştiriniz
                      </div>
                    </div>
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-4 px-4 py-2 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Fotoğraf Çek ve Hazneye Yerleştir</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    <img
                      src={currentImage}
                      alt="Seçili kap"
                      className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-sky-500/10 pointer-events-none flex items-center justify-center">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-laser-scan"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="text-xs text-rose-500 flex items-center gap-1.5 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}

              {/* B) Hızlı Demo / Simülasyon Butonları */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  Hızlı Demo Seçenekleri (Kamerası Olmayanlar veya Hızlı Jüri Testi):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESETS.map((p) => {
                    const isSelected = selectedPresetId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPreset(p)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? p.isAllowed
                              ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                              : p.statusLevel === 'danger'
                              ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 ring-2 ring-rose-500/20'
                              : 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-2 ring-amber-500/20'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="font-bold text-[11px] truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          {p.isAllowed ? '✓ Onaylı' : '✗ Uygunsuz'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* "Kabı Tara ve Doğrula" Button & Result Alert */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                onClick={handleVerifyContainer}
                disabled={isAnalyzing || isPouring}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
                  isAnalyzing
                    ? 'bg-sky-600 text-white cursor-wait opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white cursor-pointer hover:shadow-emerald-600/20'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Vision AI Modeli Analiz Ediyor...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Kabı Tara ve Doğrula</span>
                  </>
                )}
              </button>

              {/* Vision Alert Banner */}
              <div
                className={`p-4 rounded-xl border text-xs flex items-start gap-3 transition-colors ${
                  visionStatus.statusLevel === 'success'
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100'
                    : visionStatus.statusLevel === 'danger'
                    ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100'
                    : 'border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-100'
                }`}
              >
                {visionStatus.statusLevel === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : visionStatus.statusLevel === 'danger' ? (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1">
                  <div className="font-extrabold text-sm flex items-center gap-2">
                    <span>{visionStatus.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      visionStatus.isAllowed
                        ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100'
                        : 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100'
                    }`}>
                      {visionStatus.isAllowed ? 'VANA: AÇILABİLİR' : 'VANA KİLİTLİ'}
                    </span>
                  </div>
                  <div className="text-[12px] opacity-95 leading-relaxed font-medium">
                    {visionStatus.message}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Step 2 (Kimlik/Cüzdan) & Step 3 (Lıkır Lıkır Doldur) - 5 cols */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* 2. ADIM: Kimlik & Cüzdan Doğrulama (RFID / Sanal QR) */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      2. Adım: Kimlik & Cüzdan Doğrulama
                    </h3>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {isAuthenticated ? 'TEMASSIZ AKTİF' : 'KART BEKLENİYOR'}
                </span>
              </div>

              {/* RFID / QR Scan Trigger Button */}
              <button
                onClick={handleToggleAuth}
                className={`w-full p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                  isAuthenticated
                    ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-950 dark:text-sky-100'
                    : 'bg-slate-900 dark:bg-sky-600 text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-sky-500" />
                  <span>Öğrenci Kartı / Sanal QR Okut</span>
                </div>
                <span className="text-[11px] font-mono font-bold">
                  {isAuthenticated ? '✓ Doğrulandı' : 'Okutmak İçin Tıkla'}
                </span>
              </button>

              {/* Status Message when Authenticated */}
              {isAuthenticated && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                    <span>Hoş geldin! Öğrenci No: {student.studentId}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">{student.points} LıkırPuan</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Günlük Kalan Kota: <strong>{student.dailyQuotaRemainingLiters.toFixed(1)} L</strong></span>
                    <span>KYK Konya Alaeddin Yurdu</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. ADIM: Lıkır Lıkır Doldur! (Dolum Otomasyonu) */}
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex-1 flex flex-col justify-between space-y-4">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center">
                      3
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        3. Adım: Lıkır Lıkır Doldur!
                      </h3>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
                    {visionStatus.isAllowed ? `${visionStatus.volumeMl} ml Hedef` : 'Vana Kilitli'}
                  </span>
                </div>

                {/* Live Dispenser Nozzle & Wave Graphic (SVG) */}
                <div className="relative w-full h-44 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-between p-2 select-none">
                  
                  {/* Top Nozzle */}
                  <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                    <span>NOZUL: GIDA UYUMLU SUS316</span>
                    <span className={isPouring ? 'text-sky-400 font-bold animate-pulse' : 'text-slate-500'}>
                      {isPouring ? 'AKIS SÜRÜYOR' : 'HAZIR'}
                    </span>
                  </div>

                  {/* SVG Bottle & Stream */}
                  <div className="relative w-full flex-1 flex items-center justify-center">
                    <svg viewBox="0 0 240 180" className="w-full h-full max-h-40">
                      <defs>
                        <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>
                      </defs>

                      {/* Nozzle */}
                      <rect x="110" y="0" width="20" height="15" fill="#64748b" rx="2" />
                      <rect
                        x="115"
                        y="15"
                        width="10"
                        height="6"
                        rx="1"
                        fill={isPouring ? '#0284c7' : visionStatus.isAllowed ? '#10b981' : '#f43f5e'}
                      />

                      {/* Water stream jet during pour */}
                      {isPouring && (
                        <g>
                          <rect x="117" y="21" width="6" height="85" fill="url(#streamGrad)" rx="2" opacity="0.9" />
                          <line x1="120" y1="21" x2="120" y2="106" stroke="#e0f2fe" strokeWidth="2" />
                          <ellipse cx="120" cy="106" rx="14" ry="3" fill="#38bdf8" className="animate-ping" />
                        </g>
                      )}

                      {/* Bottle Silhouette with rising liquid */}
                      <g transform="translate(0, 20)">
                        <rect
                          x="90"
                          y="85"
                          width="60"
                          height="70"
                          rx="10"
                          fill={visionStatus.isAllowed ? '#0284c7' : '#ef4444'}
                          fillOpacity="0.25"
                          stroke={visionStatus.isAllowed ? '#38bdf8' : '#f87171'}
                          strokeWidth="2"
                        />
                        <rect x="105" y="70" width="30" height="15" rx="2" fill="#94a3b8" />
                        <text
                          x="120"
                          y="125"
                          fill="white"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                          fontFamily="JetBrains Mono"
                        >
                          {visionStatus.isAllowed ? `${currentMl} ml` : 'KİLİTLİ'}
                        </text>
                      </g>

                      {/* Floor */}
                      <rect x="60" y="172" width="120" height="6" rx="2" fill="#334155" />
                    </svg>
                  </div>

                  {/* Telemetry Footer */}
                  <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 border-t border-slate-800/80 pt-1">
                    <span>Debi: {isPouring ? `${flowRate} L/dk` : '1.8 L/dk'}</span>
                    <span>Sıcaklık: {waterTemp}°C</span>
                    <span className="text-emerald-400 font-bold">Taşma Sensörü: AKTİF</span>
                  </div>
                </div>

                {/* Progress bar during pour */}
                {(isPouring || pourProgress > 0) && (
                  <div className="space-y-1 font-mono text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-sky-600 dark:text-sky-400">
                        {currentMl} / {visionStatus.volumeMl} ml
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400">%{Math.round(pourProgress)}</span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-75"
                        style={{ width: `${pourProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* [Dolumu Başlat] Primary Button */}
              <div className="space-y-2">
                {!isPouring ? (
                  <button
                    onClick={handleStartPour}
                    disabled={!canStartPour}
                    className={`w-full py-4 px-6 rounded-xl font-extrabold text-base transition-all flex items-center justify-center gap-2.5 shadow-md ${
                      canStartPour
                        ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white cursor-pointer hover:shadow-emerald-600/25 ring-2 ring-emerald-500/20'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {canStartPour ? (
                      <>
                        <Droplets className="w-5 h-5 text-sky-200" />
                        <span>Dolumu Başlat (Lıkır Lıkır Doldur!)</span>
                      </>
                    ) : !visionStatus.isAllowed ? (
                      <>
                        <Lock className="w-5 h-5 text-rose-500" />
                        <span>Vana Kilitli: Geçerli Matara Doğrulayınız</span>
                      </>
                    ) : (
                      <>
                        <QrCode className="w-5 h-5" />
                        <span>Öğrenci Kartı / QR Okutunuz</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={handleStopPour}
                    className="w-full py-4 px-6 rounded-xl font-extrabold text-base bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Dolumu Durdur (Acil Stop)</span>
                  </button>
                )}

                {showCompletionToast && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-in fade-in">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      Afiyet olsun! Döngüye katkın kaydedildi (+10 LıkırPuan, +15 TL).
                    </span>
                    <button onClick={() => setShowCompletionToast(false)} className="text-[11px] underline">
                      Kapat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Footer & Technical Architecture Summary */}
        <footer className="border-t border-slate-200 dark:border-slate-800 pt-5 pb-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-800 dark:text-slate-200">LıkırLoop Konya Terminali</span>
            <span>· Gıda Uyumlu Solenoid Vana, ToF Optik Seviye Sensörü & Edge AI</span>
          </div>

          <div className="font-mono text-[11px]">
            Ters Osmoz & Mineral Dengesi: %88 Sağlıklı (Kestirimci Bakım Aktif)
          </div>
        </footer>
      </main>
    </div>
  );
};
