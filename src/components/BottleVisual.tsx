import React from 'react';
import { BottleOption, ValveSignalStatus } from '../types.ts';
import { Lock, Unlock, Eye, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface BottleVisualProps {
  bottle: BottleOption;
  isPouring: boolean;
  isScanning: boolean;
  valveStatus: ValveSignalStatus;
  progressPercent: number; // 0 to 100
  currentMl: number;
}

export const BottleVisual: React.FC<BottleVisualProps> = ({
  bottle,
  isPouring,
  isScanning,
  valveStatus,
  progressPercent,
  currentMl,
}) => {
  const isAllowed = bottle.isAllowed;
  const isSteel = bottle.id === 'steel_flask';
  const isTritan = bottle.id === 'tritan_sports';
  const isPet = bottle.id === 'single_use_pet';
  const isOpenCup = bottle.id === 'open_cup';

  // Liquid height calculation inside bottle container (SVG coordinates)
  const maxLiquidHeight = isOpenCup ? 100 : isPet ? 180 : isTritan ? 210 : 200;
  const liquidHeight = (progressPercent / 100) * maxLiquidHeight;
  const liquidY = 300 - liquidHeight;

  return (
    <div className="relative w-full h-84 sm:h-96 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 dark:from-slate-950 dark:via-black dark:to-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-inner flex flex-col items-center justify-between select-none">
      
      {/* Top Station Dispenser Housing & Solenoid Valve Indicator */}
      <div className="w-full flex items-center justify-between px-3 text-xs text-slate-400 border-b border-slate-800/80 pb-2.5 z-10">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            isScanning
              ? 'bg-sky-400 animate-ping'
              : isPouring
              ? 'bg-sky-400 animate-pulse'
              : valveStatus === 'READY_GREEN'
              ? 'bg-emerald-400'
              : 'bg-rose-500'
          }`}></span>
          <span className="font-mono text-slate-300 font-semibold">
            İSTASYON #01 // UÇ KAMERA HAZNESİ
          </span>
        </div>

        {/* Real-time Hardware Solenoid Valve State */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          {isScanning ? (
            <span className="text-sky-400 animate-pulse flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              YOLOv8 OPTİK TARANIYOR...
            </span>
          ) : isPouring ? (
            <span className="text-sky-300 font-bold animate-pulse">
              DEBİ: 1.20 L/DK · VANA AÇIK
            </span>
          ) : valveStatus === 'READY_GREEN' ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5" />
              VANA AÇILABİLİR (YEŞİL SİNYAL)
            </span>
          ) : (
            <span className="text-rose-400 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" />
              DONANIM KİLİTLİ (VANA AÇILAMAZ)
            </span>
          )}
        </div>
      </div>

      {/* Main Dispenser Alcove SVG */}
      <div className="relative flex-1 w-full max-w-xs flex items-center justify-center my-1">
        
        {/* Dynamic YOLOv8 Bounding Box Overlay */}
        <div
          className={`absolute inset-x-6 inset-y-3 pointer-events-none rounded-lg border-2 transition-all duration-300 z-20 flex flex-col justify-between p-2.5 ${
            isScanning
              ? 'border-sky-400/80 bg-sky-500/10'
              : bottle.statusLevel === 'success'
              ? 'border-emerald-500/85 bg-emerald-500/5'
              : bottle.statusLevel === 'danger'
              ? 'border-rose-500/90 bg-rose-500/10'
              : 'border-amber-500/85 bg-amber-500/10'
          }`}
        >
          {/* Header Bounding Box Label */}
          <div className="flex items-center justify-between text-[10px] font-mono font-semibold">
            <span
              className={`px-2 py-0.5 rounded shadow-xs flex items-center gap-1 ${
                isScanning
                  ? 'bg-sky-950 text-sky-300 border border-sky-400/50'
                  : bottle.statusLevel === 'success'
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                  : bottle.statusLevel === 'danger'
                  ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50'
                  : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
              }`}
            >
              {isScanning ? (
                <>YOLOv8: Nesne Tanımlanıyor...</>
              ) : bottle.statusLevel === 'success' ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  YOLOv8: %{bottle.confidenceScore} Onaylı Matara
                </>
              ) : bottle.statusLevel === 'danger' ? (
                <>
                  <AlertOctagon className="w-3 h-3 text-rose-400" />
                  YOLOv8: Tek Kullanımlık Plastik (%{bottle.confidenceScore})
                </>
              ) : (
                <>
                  <AlertOctagon className="w-3 h-3 text-amber-400" />
                  YOLOv8: Geçersiz Geometri (%{bottle.confidenceScore})
                </>
              )}
            </span>

            <span className="text-slate-300 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700/60 text-[9px]">
              Ø: {bottle.mouthWidthMm}mm · H: {bottle.heightMm}mm
            </span>
          </div>

          {/* Ultrasonic Distance & Hardware Valve Gate Status */}
          <div className="flex justify-between items-center text-[9px] font-mono font-bold">
            <span className="text-slate-400">
              HALL-EFFECT SENSÖR: HAZIR
            </span>
            <span
              className={`px-1.5 py-0.5 rounded ${
                isScanning
                  ? 'text-sky-300 bg-sky-950/80'
                  : isAllowed
                  ? 'text-emerald-300 bg-emerald-950/80'
                  : 'text-rose-300 bg-rose-950/80'
              }`}
            >
              {isScanning ? 'TARAMA DEVAM EDİYOR' : isAllowed ? 'VANA: YEŞİL SİNYAL' : 'VANA: DONANIM KİLİTLİ'}
            </span>
          </div>
        </div>

        {/* Optical Scanning Line Sweep Animation */}
        {isScanning && (
          <div className="absolute inset-x-8 top-6 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_#38bdf8] z-30 animate-laser-scan"></div>
        )}

        {/* SVG Drawing of Dispenser Bay & Bottle */}
        <svg viewBox="0 0 320 330" className="w-full h-full max-h-76 drop-shadow-xl" aria-label="LıkırLoop Su Dolum Simülasyonu">
          <defs>
            {/* Water gradient */}
            <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.9" />
            </linearGradient>

            {/* Steel bottle gradient */}
            <linearGradient id="steelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="25%" stopColor="#94a3b8" />
              <stop offset="55%" stopColor="#cbd5e1" />
              <stop offset="85%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Tritan flask gradient */}
            <linearGradient id="tritanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#2dd4bf" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.6" />
            </linearGradient>

            {/* PET plastic bottle gradient */}
            <linearGradient id="petGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#dbeafe" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.4" />
            </linearGradient>

            {/* Glass tumbler gradient */}
            <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#f8fafc" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.35" />
            </linearGradient>

            {/* Clip path for steel bottle interior */}
            <clipPath id="steelClip">
              <path d="M 125 110 L 125 145 C 125 155 115 165 115 180 L 115 292 C 115 298 120 300 126 300 L 194 300 C 200 300 205 298 205 292 L 205 180 C 205 165 195 155 195 145 L 195 110 Z" />
            </clipPath>

            {/* Clip path for tritan bottle interior */}
            <clipPath id="tritanClip">
              <path d="M 120 95 L 120 120 C 120 135 110 145 110 160 L 110 292 C 110 298 116 300 122 300 L 198 300 C 204 300 210 298 210 292 L 210 160 C 210 145 200 135 200 120 L 200 95 Z" />
            </clipPath>

            {/* Clip path for open glass */}
            <clipPath id="cupClip">
              <path d="M 110 190 L 125 296 C 126 299 130 300 134 300 L 186 300 C 190 300 194 299 195 296 L 210 190 Z" />
            </clipPath>

            {/* Clip path for PET bottle */}
            <clipPath id="petClip">
              <path d="M 134 110 L 134 135 C 134 145 120 160 120 180 L 120 292 C 120 298 124 300 130 300 L 190 300 C 196 300 200 298 200 292 L 200 180 C 200 160 186 145 186 135 L 186 110 Z" />
            </clipPath>
          </defs>

          {/* Stainless Steel Dispenser Nozzle & Sensor Head (Top Center) */}
          <rect x="140" y="0" width="40" height="25" rx="3" fill="#334155" />
          <rect x="150" y="25" width="20" height="15" fill="#64748b" />
          <rect
            x="154"
            y="40"
            width="12"
            height="8"
            rx="2"
            fill={isPouring ? '#0284c7' : isAllowed && !isScanning ? '#10b981' : '#f43f5e'}
          />

          {/* Laser Scanner Alignment Beam */}
          <line
            x1="160"
            y1="48"
            x2="160"
            y2="300"
            stroke={isScanning ? '#38bdf8' : isAllowed ? '#10b981' : isPet ? '#f43f5e' : '#f59e0b'}
            strokeWidth="1.5"
            strokeDasharray="4,4"
            className="animate-laser-scan"
            opacity="0.65"
          />

          {/* Liquid Stream (Only visible during pour) */}
          {isPouring && (
            <g>
              {/* Outer laminar water stream */}
              <rect
                x="156"
                y="48"
                width="8"
                height={Math.max(0, liquidY - 48)}
                fill="url(#waterGrad)"
                opacity="0.92"
                rx="3"
              />
              {/* Core high-velocity stream line */}
              <line
                x1="160"
                y1="48"
                x2="160"
                y2={liquidY}
                stroke="#e0f2fe"
                strokeWidth="2.5"
                opacity="0.95"
              />
              {/* Splash ripples at water impact point */}
              <ellipse
                cx="160"
                cy={liquidY}
                rx="18"
                ry="4"
                fill="#38bdf8"
                opacity="0.8"
                className="animate-ping"
              />
            </g>
          )}

          {/* Dispenser Floor Platform */}
          <rect x="80" y="302" width="160" height="8" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="1" />
          <ellipse cx="160" cy="304" rx="42" ry="3" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />

          {/* === BOTTLE TYPE 1: Kayıtlı Standart Çelik Matara === */}
          {isSteel && (
            <g transform="translate(0, 0)">
              {/* Liquid inside steel bottle with clip path */}
              <g clipPath="url(#steelClip)">
                <rect
                  x="110"
                  y={liquidY}
                  width="100"
                  height={liquidHeight + 10}
                  fill="url(#waterGrad)"
                />
                {isPouring && (
                  <ellipse cx="160" cy={liquidY} rx="40" ry="4" fill="#7dd3fc" opacity="0.9" />
                )}
              </g>

              {/* Outer Bottle Shell */}
              <path
                d="M 125 110 L 125 145 C 125 155 115 165 115 180 L 115 292 C 115 298 120 300 126 300 L 194 300 C 200 300 205 298 205 292 L 205 180 C 205 165 195 155 195 145 L 195 110 Z"
                fill="url(#steelGrad)"
                fillOpacity="0.65"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              <rect x="123" y="106" width="74" height="6" rx="2" fill="#cbd5e1" stroke="#64748b" strokeWidth="1" />
              <line x1="124" y1="116" x2="196" y2="116" stroke="#475569" strokeWidth="1" />

              <text
                x="160"
                y="215"
                textAnchor="middle"
                fill="#f8fafc"
                fontSize="11"
                fontWeight="700"
                letterSpacing="1"
                opacity="0.85"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                LıkırLoop
              </text>
              <text
                x="160"
                y="228"
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="8"
                fontWeight="500"
                letterSpacing="0.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
              >
                500 ml · Çelik
              </text>

              <path
                d="M 122 185 L 122 285"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.35"
              />
            </g>
          )}

          {/* === BOTTLE TYPE 2: Onaylı Sporcu Matarası (Tritan) === */}
          {isTritan && (
            <g transform="translate(0, 0)">
              <g clipPath="url(#tritanClip)">
                <rect
                  x="105"
                  y={liquidY}
                  width="110"
                  height={liquidHeight + 10}
                  fill="url(#waterGrad)"
                />
                {isPouring && (
                  <ellipse cx="160" cy={liquidY} rx="46" ry="4" fill="#a7f3d0" opacity="0.9" />
                )}
              </g>

              <path
                d="M 120 95 L 120 120 C 120 135 110 145 110 160 L 110 292 C 110 298 116 300 122 300 L 198 300 C 204 300 210 298 210 292 L 210 160 C 210 145 200 135 200 120 L 200 95 Z"
                fill="url(#tritanGrad)"
                stroke="#14b8a6"
                strokeWidth="2"
              />

              <rect x="118" y="90" width="84" height="7" rx="2" fill="#0f766e" stroke="#2dd4bf" strokeWidth="1" />

              <line x1="112" y1="260" x2="122" y2="260" stroke="#ccfbf1" strokeWidth="1.5" />
              <text x="126" y="263" fill="#ccfbf1" fontSize="7" fontFamily="JetBrains Mono">250ml</text>

              <line x1="112" y1="210" x2="125" y2="210" stroke="#ccfbf1" strokeWidth="1.5" />
              <text x="129" y="213" fill="#ccfbf1" fontSize="7" fontFamily="JetBrains Mono">500ml</text>

              <line x1="112" y1="160" x2="128" y2="160" stroke="#ccfbf1" strokeWidth="1.5" />
              <text x="132" y="163" fill="#ccfbf1" fontSize="7" fontFamily="JetBrains Mono">750ml</text>

              <text
                x="160"
                y="235"
                textAnchor="middle"
                fill="#ccfbf1"
                fontSize="10"
                fontWeight="700"
                letterSpacing="0.5"
                opacity="0.9"
              >
                TRITAN 750 ML
              </text>
            </g>
          )}

          {/* === BOTTLE TYPE 3: Tek Kullanımlık PET Şişe (Reddedildi) === */}
          {isPet && (
            <g transform="translate(0, 0)">
              <g clipPath="url(#petClip)">
                <rect
                  x="110"
                  y={liquidY}
                  width="100"
                  height={liquidHeight + 10}
                  fill="url(#waterGrad)"
                />
              </g>

              <path
                d="M 134 110 L 134 135 C 134 145 120 160 120 180 L 120 292 C 120 298 124 300 130 300 L 190 300 C 196 300 200 298 200 292 L 200 180 C 200 160 186 145 186 135 L 186 110 Z"
                fill="url(#petGrad)"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeDasharray="3,2"
              />

              <rect x="132" y="106" width="56" height="5" rx="1" fill="#3b82f6" />

              <rect x="121" y="200" width="78" height="42" fill="#ef4444" opacity="0.25" stroke="#f87171" strokeWidth="1" />
              <text x="160" y="218" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="700">
                TEK KULLANIMLIK
              </text>
              <text x="160" y="230" textAnchor="middle" fill="#fca5a5" fontSize="7">
                PET ŞİŞE ATIK
              </text>

              {/* Red Strike & Hardware Lock Symbol */}
              <circle cx="160" cy="220" r="32" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.9" />
              <line x1="138" y1="198" x2="182" y2="242" stroke="#ef4444" strokeWidth="3" opacity="0.9" />
            </g>
          )}

          {/* === BOTTLE TYPE 4: Açık Bardak / Karton Kupa (Uygunsuz) === */}
          {isOpenCup && (
            <g transform="translate(0, 0)">
              <g clipPath="url(#cupClip)">
                <rect
                  x="100"
                  y={liquidY}
                  width="120"
                  height={liquidHeight + 10}
                  fill="url(#waterGrad)"
                />
              </g>

              <path
                d="M 110 190 L 125 296 C 126 299 130 300 134 300 L 186 300 C 190 300 194 299 195 296 L 210 190 Z"
                fill="url(#glassGrad)"
                stroke="#f59e0b"
                strokeWidth="2"
              />

              <ellipse cx="160" cy="190" rx="50" ry="6" fill="#fde68a" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="1.5" />

              <text x="160" y="245" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="700">
                AÇIK KAP / KUPA
              </text>
              <text x="160" y="258" textAnchor="middle" fill="#fde68a" fontSize="7">
                Taşma & Hijyen Riski
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Real-time Telemetry Bar */}
      <div className="w-full bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 flex items-center justify-between text-xs font-mono z-10">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Kalibre Hacim:</span>
          <span className="text-sky-300 font-bold text-sm">
            {currentMl} <span className="text-xs font-normal text-slate-400">/ {bottle.volumeMl} ml</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Durum:</span>
          <span className={`font-bold text-xs ${
            isScanning
              ? 'text-sky-400 animate-pulse'
              : isAllowed
              ? 'text-emerald-400'
              : 'text-rose-400'
          }`}>
            {isScanning ? 'Optik Tarama...' : isAllowed ? 'Vana Açılabilir' : 'Vana Kilitli'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
          <span>Hall-Effect: 1.2 L/dk</span>
        </div>
      </div>
    </div>
  );
};
