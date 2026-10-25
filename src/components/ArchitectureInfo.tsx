import React from 'react';
import { Cpu, ShieldCheck, RefreshCw, Zap, Database, Smartphone, CheckCircle2 } from 'lucide-react';

export const ArchitectureInfo: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          LıkırLoop Teknik Mimarisi & Döngüsel Altyapı
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Uç Yapay Zeka (Edge AI), IoT Telemetri ve Sıfır Atık Altyapısının Çalışma Prensibi
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: Edge AI Vision */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>

          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            1. YOLOv8-Nano Vision
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            İstasyona yerleştirilen kabın formu, materyali ve ağız çapı entegre geniş açılı kamera ile taranır. 45 milisaniyede çalışan gömülü YOLOv8 modeli tek kullanımlık PET şişeleri kibarca reddederken, onaylı çelik ve tritan mataralara anında onay verir.
          </p>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
            <div>· Model: YOLOv8-nano (INT8 Quantized)</div>
            <div>· Çıkarım Donanımı: Coral TPU / RPi 5</div>
            <div>· Doğruluk Oranı: %98.8 F1-Score</div>
          </div>
        </div>

        {/* Pillar 2: Taşma Önleyici Sensör & Debimetre */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            2. Çift Katmanlı Taşma Güvenliği
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Time-of-Flight (ToF) optik mesafe ölçer ve yüksek frekanslı ultrasonik seviye sensörü bir arada çalışır. Sıvı yüksekliği matara boyun çizgisine 10 mm kala gıda uyumlu solenoid valf 20 ms içinde kapanarak dökülmeyi önler.
          </p>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
            <div>· Debi Sensörü: Hall-Effect Dijital Pals</div>
            <div>· Valf Yanıt Süresi: 20 ms</div>
            <div>· Hata Payı: ±4 ml</div>
          </div>
        </div>

        {/* Pillar 3: Döngüsel Ekonomi & Gamification */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>

          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
            3. LıkırPuan Döngüsel Ekonomi
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Plastik atığı engellemek salt yasakla değil, pozitif teşvikle mümkündür. KYK öğrenci kartıyla her dolumda kazanılan 10 LıkırPuan; kantinde kahve indirimi, çamaşırhane jetonu ve kampüs bisiklet kiralaması olarak öğrenciye geri döner.
          </p>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[11px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
            <div>· Kart Standardı: MIFARE / NFC 13.56MHz</div>
            <div>· Protokol: MQTT / TLS 1.3 Kampüs Bulut</div>
            <div>· Geri Dönüşüm Teşviki: %100 Katılımcı</div>
          </div>
        </div>
      </div>

      {/* Comparison Table: LıkırLoop vs Geleneksel Su Otomatları */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Neden LıkırLoop? Geleneksel Çözümlerle Karşılaştırma
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Özellik</th>
                <th className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">LıkırLoop İstasyonu</th>
                <th className="py-2.5 px-3 font-semibold text-slate-500">Tek Kullanımlık Plastik Su Otomatı</th>
                <th className="py-2.5 px-3 font-semibold text-slate-500">Klasik Damacana Sebil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 px-3 font-semibold">Plastik Atık Üretimi</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">SIFIR (Kaynağında Önleme)</td>
                <td className="py-2.5 px-3 text-rose-500 font-semibold">Yılda ~432.000 PET Atığı</td>
                <td className="py-2.5 px-3 text-amber-500">Karton / Plastik Bardak Atığı</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Öğrenci Maliyeti</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">Ücretsiz + Puan Kazandırır</td>
                <td className="py-2.5 px-3 text-slate-500">15 - 20 TL / 500 ml Şişe</td>
                <td className="py-2.5 px-3 text-slate-500">Sebil Tükenme & Hijyen Sorunu</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Hijyen & Temassız Dolum</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">Temassız Nozul + UV-C (%99.999)</td>
                <td className="py-2.5 px-3 text-slate-500">Dış temaslı plastik ambalaj</td>
                <td className="py-2.5 px-3 text-rose-500">Musluk bakteri üreme riski</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Taşma & Seviye Algılama</td>
                <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">YOLOv8 + Çift Sensör Kontrollü</td>
                <td className="py-2.5 px-3 text-slate-500">Yok</td>
                <td className="py-2.5 px-3 text-slate-500">Manuel taşma riski yüksek</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
