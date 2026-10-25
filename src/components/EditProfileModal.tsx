import React, { useState } from 'react';
import { X, User, Building2, Droplets, Target, Save, Check } from 'lucide-react';
import { StudentProfile } from '../types.ts';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSave: (updated: Partial<StudentProfile>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
}) => {
  const [fullName, setFullName] = useState(student.fullName);
  const [dormBlock, setDormBlock] = useState(student.dormBlock || 'B Blok');
  const [bottleVolume, setBottleVolume] = useState<number>(student.registeredBottleVolume || 500);
  const [dailyGoal, setDailyGoal] = useState<number>(student.dailyWaterGoalLiters || 2.0);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bottleType = bottleVolume === 750 ? '750 ml Tritan Sporcu Matarası' : '500 ml Paslanmaz Çelik';

    onSave({
      fullName: fullName.trim() || 'Zeynep Liva Palamut',
      dormBlock: dormBlock,
      registeredBottleVolume: bottleVolume,
      registeredBottleType: bottleType,
      dailyWaterGoalLiters: dailyGoal,
    });

    setIsSavedRecently(true);
    setTimeout(() => {
      setIsSavedRecently(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/80">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              Öğrenci Profilini & Matarayı Düzenle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kimlik, yurt konumu, kayıtlı matara hacmi ve günlük su kotanızı güncelleyin
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Ad Soyad */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Ad Soyad
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-xs font-medium"
              placeholder="Örn: Zeynep Liva Palamut"
            />
          </div>

          {/* Öğrenci No & Yurt Bloğu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Öğrenci No (Sabit RFID)
              </label>
              <input
                type="text"
                disabled
                value={student.studentId}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Yurt Bloğu
              </label>
              <select
                value={dormBlock}
                onChange={(e) => setDormBlock(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/30 text-xs font-medium"
              >
                <option value="A Blok">KYK FSM Yurdu - A Blok</option>
                <option value="B Blok">KYK FSM Yurdu - B Blok</option>
                <option value="C Blok">KYK FSM Yurdu - C Blok</option>
                <option value="D Blok">KYK FSM Yurdu - D Blok</option>
                <option value="İTÜ Gölet">İTÜ Gölet Yurtları</option>
              </select>
            </div>
          </div>

          {/* Kayıtlı Matara Tipi & Hacmi */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-sky-500" />
              Kayıtlı Matara Hacmi (Kalibrasyon)
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setBottleVolume(500)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  bottleVolume === 500
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">500 ml Standart</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Paslanmaz Çelik Termos</div>
              </button>

              <button
                type="button"
                onClick={() => setBottleVolume(750)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  bottleVolume === 750
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="font-bold text-xs">750 ml Sporcu</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">BPA-Free Tritan Matara</div>
              </button>
            </div>
          </div>

          {/* Günlük Su Hedefi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                Günlük Su Tüketim Hedefi
              </label>
              <span className="font-mono font-bold text-sky-600 dark:text-sky-400">
                {dailyGoal.toFixed(1)} Litre ({Math.round(dailyGoal * 1000 / bottleVolume)} Dolum)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {[1.5, 2.0, 2.5, 3.0].map((goal) => (
                <button
                  type="button"
                  key={goal}
                  onClick={() => setDailyGoal(goal)}
                  className={`flex-1 py-2 rounded-lg font-mono text-xs font-semibold border transition-colors ${
                    dailyGoal === goal
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {goal.toFixed(1)}L
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-700/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Vazgeç
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {isSavedRecently ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Kaydedildi!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Değişiklikleri Kaydet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
