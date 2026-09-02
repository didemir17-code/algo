'use client';

import React from 'react';
import { 
  Award, 
  Sparkles, 
  Star, 
  Flame, 
  CheckCircle2, 
  Trophy, 
  X, 
  Printer, 
  ArrowRight,
  RotateCcw,
  Medal,
  Cpu
} from 'lucide-react';
import { UserStats } from '../lib/types';
import { sound } from '../lib/sound';

interface SummaryCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  totalAvailableLevels: number;
  onContinuePlaying: () => void;
  onResetProgress: () => void;
}

export const SummaryCertificateModal: React.FC<SummaryCertificateModalProps> = ({
  isOpen,
  onClose,
  userStats,
  totalAvailableLevels,
  onContinuePlaying,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  const solvedCount = userStats.solvedLevelIds.length;
  const progressPercent = Math.min(100, Math.round((solvedCount / Math.max(1, totalAvailableLevels)) * 100));

  const handlePrint = () => {
    sound.playStar();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-[#FFF9F0] rounded-[36px] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-[#DFE6E9] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#FF7675] p-5 sm:p-6 text-white flex items-center justify-between shadow-[0_4px_0_0_#D63031]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner shrink-0">
              🎓
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Öğrenci Başarı Karnesi & Sertifika
              </h3>
              <p className="text-xs sm:text-sm text-white/95 font-bold">
                Tebrikler! Kodlama ve Algoritma Macerandaki Başarıların
              </p>
            </div>
          </div>

          <button
            id="btn-close-certificate-modal"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-black/10 hover:bg-black/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Card Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-[#2D3436]">
          
          {/* Visual Certificate Frame */}
          <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-[#F1C40F] relative shadow-[0_4px_0_0_#F1C40F] text-center space-y-4">
            
            {/* Stamp Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FFEAA7] border-3 border-[#F1C40F] shadow-md flex flex-col items-center justify-center text-[#D35400] transform rotate-12">
                <Medal className="w-6 h-6 text-[#D35400]" />
                <span className="text-[9px] font-black uppercase tracking-wider">ONAYLI</span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFEAA7] text-[#D35400] text-xs font-black border border-[#F1C40F]">
              <Sparkles className="w-3.5 h-3.5 text-[#FD9644]" />
              <span>İLKOKUL KODLAMA VE ALGORİTMA BAŞARI BELGESİ</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#2D3436] tracking-tight">
              Yıldız Algoritma Mimarı
            </h2>

            <p className="text-xs sm:text-sm text-[#636E72] max-w-lg mx-auto leading-relaxed font-medium">
              Bu belge; sıralı düşünme, döngü kurma, mantıksal koşullar ve hata ayıklama adımlarını başarıyla tamamlayıp problem çözme becerisi sergileyen <strong className="text-[#FF7675] font-black">Değerli Genç Kodlayıcıya</strong> verilmiştir.
            </p>

            {/* Certificate Big Stats Ribbon */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              <div className="bg-[#FFF9F0] rounded-2xl p-3.5 border-2 border-[#DFE6E9] shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-[#45AAF2]">{solvedCount}</div>
                <div className="text-[10px] font-black text-[#636E72] uppercase">Çözülen Görev</div>
              </div>
              <div className="bg-[#FFF9F0] rounded-2xl p-3.5 border-2 border-[#DFE6E9] shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-[#FD9644] flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-[#FD9644]" />
                  <span>{userStats.totalStars}</span>
                </div>
                <div className="text-[10px] font-black text-[#636E72] uppercase">Kazanılan Yıldız</div>
              </div>
              <div className="bg-[#FFF9F0] rounded-2xl p-3.5 border-2 border-[#DFE6E9] shadow-xs">
                <div className="text-xl sm:text-2xl font-black text-[#FF7675] flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 fill-[#FF7675]" />
                  <span>{userStats.streak}</span>
                </div>
                <div className="text-[10px] font-black text-[#636E72] uppercase">En Yüksek Seri</div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#636E72] font-black">
              Tarih: {new Date().toLocaleDateString('tr-TR')} • Robot Robi & Kodlama Atölyesi
            </div>
          </div>

          {/* Badges Earned Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-[#2D3436] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#FD9644]" />
                <span>Kazanılan Ustalık Rozetleri</span>
              </h4>
              <span className="text-xs font-black text-[#636E72] bg-white px-3 py-1 rounded-full border border-[#DFE6E9]">
                {userStats.badges.filter(b => b.isUnlocked).length} / {userStats.badges.length} Rozet
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {userStats.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-2xl border-3 flex flex-col items-center text-center gap-2 transition-all ${
                    badge.isUnlocked
                      ? 'bg-white border-[#55E6C1] shadow-[0_3px_0_0_#26de81]'
                      : 'bg-[#F1F2F6] border-[#DFE6E9] opacity-40 grayscale'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
                    badge.isUnlocked ? 'bg-[#FFEAA7] text-[#D35400] border border-[#F1C40F] shadow-xs' : 'bg-[#DFE6E9] text-[#636E72]'
                  }`}>
                    {badge.isUnlocked ? '🏆' : '🔒'}
                  </div>
                  <div className="text-xs font-black text-[#2D3436]">{badge.title}</div>
                  <div className="text-[10px] text-[#636E72] font-semibold leading-tight line-clamp-2">{badge.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Pedagogical Skill Breakdown */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#DFE6E9] shadow-[0_3px_0_0_#DFE6E9] space-y-3">
            <h4 className="text-xs font-black text-[#2D3436] uppercase tracking-wider">
              Kazanılan Algoritmik Beceriler:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center gap-2.5 bg-[#FFF9F0] p-3 rounded-2xl border-2 border-[#DFE6E9]">
                <CheckCircle2 className="w-4 h-4 text-[#55E6C1] shrink-0" />
                <span><strong className="text-[#2D3436] font-black">Sıralama:</strong> Adımları öncelik sırasına göre icra etme.</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#FFF9F0] p-3 rounded-2xl border-2 border-[#DFE6E9]">
                <CheckCircle2 className="w-4 h-4 text-[#55E6C1] shrink-0" />
                <span><strong className="text-[#2D3436] font-black">Döngüler:</strong> Tekrar eden görevleri verimli bloklama.</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#FFF9F0] p-3 rounded-2xl border-2 border-[#DFE6E9]">
                <CheckCircle2 className="w-4 h-4 text-[#55E6C1] shrink-0" />
                <span><strong className="text-[#2D3436] font-black">Koşullar:</strong> Şartlara göre doğru karar yollarını seçme.</span>
              </div>
              <div className="flex items-center gap-2.5 bg-[#FFF9F0] p-3 rounded-2xl border-2 border-[#DFE6E9]">
                <CheckCircle2 className="w-4 h-4 text-[#55E6C1] shrink-0" />
                <span><strong className="text-[#2D3436] font-black">Hata Ayıklama:</strong> Yanlış adımı bulup düzeltme.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-white border-t-2 border-[#DFE6E9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-print-certificate"
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-white border-2 border-[#DFE6E9] hover:bg-[#FFF9F0] text-[#2D3436] font-black text-xs sm:text-sm shadow-[0_3px_0_0_#DFE6E9] transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[1px]"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Kaydet</span>
            </button>

            <button
              id="btn-reset-all-progress"
              onClick={() => {
                if (window.confirm('Tüm ilerlemeni sıfırlamak istiyor musun?')) {
                  onResetProgress();
                }
              }}
              className="px-3 py-3 rounded-2xl text-[#FF7675] hover:bg-[#FF7675]/10 text-xs font-black transition cursor-pointer"
            >
              İlerlemeyi Sıfırla
            </button>
          </div>

          <button
            id="btn-continue-playing"
            onClick={() => {
              sound.playSuccess();
              onContinuePlaying();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#55E6C1] hover:bg-[#26de81] text-white font-black text-xs sm:text-sm shadow-[0_4px_0_0_#26de81] transition-all flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[2px]"
          >
            <span>Oynamaya & Öğrenmeye Devam Et!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
