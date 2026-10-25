import React from 'react';
import {
  Leaf,
  Droplets,
  Coins,
  ShieldCheck,
  TrendingUp,
  Activity,
  Thermometer,
  Zap,
  CheckCircle,
  Building2,
  Filter,
} from 'lucide-react';
import { CampusTelemetryData, CampusStationNode } from '../types.ts';
import { CAMPUS_STATION_NODES } from '../data/mockData.ts';

interface CampusTelemetryProps {
  telemetry: CampusTelemetryData;
}

export const CampusTelemetry: React.FC<CampusTelemetryProps> = ({ telemetry }) => {
  const targetPercent = Math.min(100, ((telemetry.preventedPetBottles / telemetry.targetBottles) * 100));
  const carbonKg = (telemetry.preventedCarbonGrams / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 });
  const savingsFormatted = telemetry.studentSavingsTl.toLocaleString('tr-TR');
  const bottlesFormatted = telemetry.preventedPetBottles.toLocaleString('tr-TR');
  const targetFormatted = telemetry.targetBottles.toLocaleString('tr-TR');

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Telemetry Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Canlı Kampüs Etki Sayacı & Telemetri
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            KYK Yurtları ve İTÜ Ayazağa Kampüsü anlık sıfır atık ve su kalitesi verileri
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>CANLI IoT VERİ AKIŞI AKTİF</span>
        </div>
      </div>

      {/* 4 Core Impact Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Önlenen PET Şişe */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Önlenen PET Şişe</span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {bottlesFormatted}
            </div>
            <div className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-1">
              +1 Dolum Başına
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2 flex justify-between">
            <span>Yurt Hedefi:</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{targetFormatted}</span>
          </div>
        </div>

        {/* Metric 2: Öğrenci Tasarrufu */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Öğrenci Tasarrufu</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {savingsFormatted} <span className="text-lg font-sans font-normal text-slate-500">TL</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
              +15 TL Dolum Başına Cepte
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2 flex justify-between">
            <span>Öğrenci Bütçe Koruması:</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">Aktif Koruma</span>
          </div>
        </div>

        {/* Metric 3: Engellenen Karbon */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Engellenen Karbon</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {carbonKg} <span className="text-lg font-sans font-normal text-slate-500">kg CO₂</span>
            </div>
            <div className="text-xs text-teal-600 dark:text-teal-400 font-medium mt-1">
              +82.8 g CO₂ / 500 ml
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2 flex justify-between">
            <span>Lojistik & Ambalaj:</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">Sıfır Emisyon</span>
          </div>
        </div>

        {/* Metric 4: Filtre & Sistem Sağlığı */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Filtre & Sistem Sağlığı</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              %{telemetry.filterRoHealthPercent} <span className="text-sm font-sans font-bold text-emerald-600 dark:text-emerald-400">Sağlıklı</span>
            </div>
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
              Ters Osmoz & Mineral Dengesi
            </div>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/60 pt-2 flex justify-between">
            <span>Kestirimci Bakım:</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">Aktif (184 Gün Kalan)</span>
          </div>
        </div>
      </div>

      {/* Campus Target Progress Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              KYK Yurdu Sıfır Atık Hedef Çubuğu (Döngü Tamamlama)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Yıllık hedeflenen 432.000 adet tek kullanımlık PET şişeyi bertaraf etme yolculuğu
            </p>
          </div>

          <div className="text-right">
            <span className="font-mono text-sm font-bold text-sky-600 dark:text-sky-400">
              %{targetPercent.toFixed(1)} Tamamlandı
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${targetPercent}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 pt-0.5">
          <span>Başlangıç: 0 Şişe</span>
          <span>Mevcut: {bottlesFormatted} Şişe Önendi</span>
          <span>Hedef: {targetFormatted} Şişe</span>
        </div>
      </div>

      {/* Water Quality & Station Node Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Water Quality Lab Card (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              5 Kademeli Arıtma & Mineralizasyon Analizi
            </h3>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              TS 266 Standart Uyumlu
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">TDS Değeri</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                {telemetry.tdsValuePpm} <span className="text-xs font-normal text-slate-400">ppm</span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">İdeal Doğal Kaynak</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Su Sıcaklığı</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                {telemetry.waterTempCelsius} <span className="text-xs font-normal text-slate-400">°C</span>
              </div>
              <div className="text-[10px] text-sky-600 dark:text-sky-400 font-medium">Optimum Soğutma</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">pH Seviyesi</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                7.8 <span className="text-xs font-normal text-slate-400">pH</span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Alkali Mineral Dengesi</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">UV-C Hücresi</div>
              <div className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                %99.999
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Sıfır Bakteri / Virüs</div>
            </div>
          </div>

          {/* Filtration stages roadmap */}
          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Kestirimci Bakım Filtre Zinciri:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>1. Tortu & Aktif Karbon (Aktif)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>2. Ters Osmoz Membran (%88)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>3. Ca²⁺ & Mg²⁺ Remineralizasyon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Campus Station Nodes (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Kampüs İstasyon Noktaları
            </h3>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              4/4 ÇEVRİMİÇİ
            </span>
          </div>

          <div className="space-y-2">
            {CAMPUS_STATION_NODES.map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>{node.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {node.location} · {node.todayFills} dolum bugün
                  </div>
                </div>

                <div className="text-right font-mono text-[11px]">
                  <div className="text-slate-800 dark:text-slate-200 font-bold">{node.tds} ppm</div>
                  <div className="text-emerald-600 dark:text-emerald-400">Filtre %{node.filterHealth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
