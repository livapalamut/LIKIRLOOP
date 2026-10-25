import React, { useState } from 'react';
import {
  Award,
  Coffee,
  Shirt,
  Bike,
  TreePine,
  CheckCircle2,
  QrCode,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  Flame,
} from 'lucide-react';
import { StudentProfile, RewardPerk } from '../types.ts';
import { REWARD_PERKS } from '../data/mockData.ts';
import { soundFx } from '../utils/audio.ts';

interface RewardsShopProps {
  student: StudentProfile;
  onRedeemReward: (perk: RewardPerk) => boolean;
}

export const RewardsShop: React.FC<RewardsShopProps> = ({ student, onRedeemReward }) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'leaderboard'>('rewards');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemedVoucher, setRedeemedVoucher] = useState<{
    perk: RewardPerk;
    code: string;
  } | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const getPerkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Bike':
        return <Bike className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default:
        return <Award className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
    }
  };

  const handleRedeem = (perk: RewardPerk) => {
    if (student.points < perk.pointsCost) {
      setFeedbackMsg(`Yetersiz puan! ${perk.pointsCost - student.points} LıkırPuan daha gerekli.`);
      soundFx.playTone('warn');
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    const success = onRedeemReward(perk);
    if (success) {
      soundFx.playSuccessChime();
      const code = `LL-${Math.floor(1000 + Math.random() * 9000)}-${perk.category.substring(0, 3).toUpperCase()}`;
      setRedeemedVoucher({ perk, code });
      setFeedbackMsg(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* Header & Segmented Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            LıkırPuan Cüzdanı & Ödül Mağazası
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Döngüsel matarayı her dolduruşunda kazandığın puanları kampüs ayrıcalıklarına dönüştür
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'rewards'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Ödül Kataloğu
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'leaderboard'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Yurt Sıralaması
          </button>
        </div>
      </div>

      {/* Student Digital Pass & Summary Ribbon */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-bold text-xl text-sky-300 shrink-0">
            {student.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ZL'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">{student.fullName}</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 text-sky-200 border border-white/15">
                {student.studentId}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {student.dormBlock}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {student.university} · {student.dormitory} ({student.roomNumber})
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-3 gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-white/10 text-center md:text-right">
          <div>
            <div className="text-[11px] text-slate-400">LıkırPuan Bakiye</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-400 mt-0.5">
              {student.points} P
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Önlenen PET</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-sky-300 mt-0.5">
              {student.totalPetPrevented} Adet
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-400">Toplam Tasarruf</div>
            <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-300 mt-0.5">
              {student.totalSavedTl} TL
            </div>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-semibold text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <span>{feedbackMsg}</span>
          <button onClick={() => setFeedbackMsg(null)} className="underline text-[11px]">Kapat</button>
        </div>
      )}

      {/* Rewards Catalog Tab */}
      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {REWARD_PERKS.map((perk) => {
              const canAfford = student.points >= perk.pointsCost;
              return (
                <div
                  key={perk.id}
                  className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        {getPerkIcon(perk.iconName)}
                      </div>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {perk.pointsCost} Puan
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {perk.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {perk.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>Değer:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{perk.discountValue}</span>
                    </div>

                    <button
                      onClick={() => handleRedeem(perk)}
                      disabled={!canAfford}
                      className={`w-full py-2 px-3 rounded-lg font-semibold text-xs transition-colors ${
                        canAfford
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                          : 'bg-slate-100 dark:bg-slate-700/60 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Hemen Kullan' : `${perk.pointsCost - student.points} Puan Eksik`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Redeemed Voucher Modal / Display */}
          {redeemedVoucher && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                    Ödül Başarıyla Tanımlandı: {redeemedVoucher.perk.title}
                  </div>
                  <div className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                    Kantin görevlisine veya çamaşırhane otomatına aşağıdaki kodu gösteriniz.
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-lg border border-emerald-300 dark:border-emerald-700">
                  {redeemedVoucher.code}
                </span>
                <button
                  onClick={() => copyToClipboard(redeemedVoucher.code)}
                  className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  aria-label="Kodu kopyala"
                >
                  {copiedCode === redeemedVoucher.code ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dormitory Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                KYK Yurt Blokları Sıfır Atık Yarışı
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                En az plastik şişe tüketen ve döngüyü en çok tamamlayan öğrenci yurtları
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Flame className="w-4 h-4" />
              <span>Haftalık Sıralama</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              {
                rank: 1,
                name: 'KYK Fatih Sultan Mehmet Yurdu (A Blok)',
                bottles: 48200,
                saving: '723.000 TL',
                carbon: '3.990 kg',
                isUserDorm: true,
              },
              {
                rank: 2,
                name: 'KYK Valide Sultan Kız Yurdu (B Blok)',
                bottles: 42150,
                saving: '632.250 TL',
                carbon: '3.490 kg',
                isUserDorm: false,
              },
              {
                rank: 3,
                name: 'İTÜ Gölet Yurtları (Lisansüstü Blok)',
                bottles: 37890,
                saving: '568.350 TL',
                carbon: '3.137 kg',
                isUserDorm: false,
              },
              {
                rank: 4,
                name: 'KYK Vezneciler Erkek Yurdu',
                bottles: 31400,
                saving: '471.000 TL',
                carbon: '2.599 kg',
                isUserDorm: false,
              },
            ].map((item) => (
              <div
                key={item.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                  item.isUserDorm
                    ? 'border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs ${
                      item.rank === 1
                        ? 'bg-amber-400 text-amber-950'
                        : item.rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : 'bg-amber-700/20 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    #{item.rank}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <span>{item.name}</span>
                      {item.isUserDorm && (
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.2 rounded">
                          Senin Yurdun
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.saving} Tasarruf · {item.carbon} CO₂ Engellendi
                    </div>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.bottles.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">Önlenen Şişe</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
