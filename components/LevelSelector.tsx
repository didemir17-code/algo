'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  Bot, 
  ListOrdered, 
  Repeat, 
  GitFork, 
  Bug, 
  PlusCircle,
  Play,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Level, CategoryType, UserStats } from '../lib/types';
import { sound } from '../lib/sound';

interface LevelSelectorProps {
  levels: Level[];
  currentLevelId: string;
  onSelectLevel: (levelId: string) => void;
  selectedGrade: 'all' | '1-2' | '3-4';
  selectedCategory: 'all' | CategoryType;
  setSelectedCategory: (cat: 'all' | CategoryType) => void;
  userStats: UserStats;
  onGenerateEndlessLevel: () => void;
}

interface CategoryConfig {
  id: 'all' | CategoryType;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
  activeBorder: string;
  textColor: string;
  desc: string;
}

const CATEGORIES: CategoryConfig[] = [
  { 
    id: 'all', 
    label: 'Tüm Görevler', 
    shortLabel: 'Tümü',
    icon: Sparkles, 
    color: 'bg-[#FF7675]', 
    activeBg: 'bg-[#FF7675]', 
    activeBorder: 'border-[#D63031]',
    textColor: 'text-[#FF7675]',
    desc: 'Tüm algoritma ve kodlama maceraları' 
  },
  { 
    id: 'sirali', 
    label: 'Sıralama (Adım Adım)', 
    shortLabel: 'Sıralama',
    icon: ListOrdered, 
    color: 'bg-[#FD9644]', 
    activeBg: 'bg-[#FD9644]', 
    activeBorder: 'border-[#fa8231]',
    textColor: 'text-[#FD9644]',
    desc: 'Adımları doğru sırayla dizme görevleri' 
  },
  { 
    id: 'dongu', 
    label: 'Döngüler (Tekrar)', 
    shortLabel: 'Döngüler',
    icon: Repeat, 
    color: 'bg-[#A55EEA]', 
    activeBg: 'bg-[#A55EEA]', 
    activeBorder: 'border-[#8854d0]',
    textColor: 'text-[#A55EEA]',
    desc: 'Tekrar eden eylemleri döngüyle çözme görevleri' 
  },
  { 
    id: 'kosul', 
    label: 'Koşullar (Eğer/İse)', 
    shortLabel: 'Koşullar',
    icon: GitFork, 
    color: 'bg-[#45AAF2]', 
    activeBg: 'bg-[#45AAF2]', 
    activeBorder: 'border-[#2d98da]',
    textColor: 'text-[#45AAF2]',
    desc: 'Şartlara ve duruma göre doğru karar verme görevleri' 
  },
  { 
    id: 'robotik', 
    label: 'Robotik Labirent', 
    shortLabel: 'Robotik',
    icon: Bot, 
    color: 'bg-[#55E6C1]', 
    activeBg: 'bg-[#20bf6b]', 
    activeBorder: 'border-[#26de81]',
    textColor: 'text-[#10ac84]',
    desc: 'Robot Robi’yi hedefe ulaştırma görevleri' 
  },
  { 
    id: 'hata_ayiklama', 
    label: 'Böcek Avı (Debug)', 
    shortLabel: 'Böcek Avı',
    icon: Bug, 
    color: 'bg-[#EB3B5A]', 
    activeBg: 'bg-[#EB3B5A]', 
    activeBorder: 'border-[#fc5c65]',
    textColor: 'text-[#EB3B5A]',
    desc: 'Hatalı kodları bulup düzeltme görevleri' 
  },
];

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  levels,
  currentLevelId,
  onSelectLevel,
  selectedGrade,
  selectedCategory,
  setSelectedCategory,
  userStats,
  onGenerateEndlessLevel,
}) => {
  // Açık olan kategori menü başlığı
  const [openCategoryMenu, setOpenCategoryMenu] = useState<('all' | CategoryType) | null>(null);

  // Aktif görev
  const currentIdx = levels.findIndex((lvl) => lvl.id === currentLevelId);
  const currentLevel = levels[currentIdx] || levels[0];
  const isCurrentSolved = userStats.solvedLevelIds.includes(currentLevel.id);

  // Kategori menü başlığına tıklandığında (Aç / Kapat)
  const handleCategoryHeaderClick = (catId: 'all' | CategoryType) => {
    sound.playPop();
    setSelectedCategory(catId);
    if (openCategoryMenu === catId) {
      setOpenCategoryMenu(null);
    } else {
      setOpenCategoryMenu(catId);
    }
  };

  // Menüden bir görev seçildiğinde
  const handleLevelSelect = (levelId: string) => {
    sound.playPop();
    onSelectLevel(levelId);
    setOpenCategoryMenu(null);
  };

  // Hızlı önceki / sonraki geçişleri
  const handlePrevLevel = () => {
    if (currentIdx > 0) {
      sound.playPop();
      onSelectLevel(levels[currentIdx - 1].id);
    }
  };

  const handleNextLevel = () => {
    if (currentIdx < levels.length - 1) {
      sound.playPop();
      onSelectLevel(levels[currentIdx + 1].id);
    } else {
      sound.playStar();
      onGenerateEndlessLevel();
    }
  };

  const currentOpenConfig = openCategoryMenu ? CATEGORIES.find((c) => c.id === openCategoryMenu) : null;
  const levelsToShow = openCategoryMenu
    ? levels.filter((lvl) => {
        const matchGrade = selectedGrade === 'all' || lvl.gradeLevel === selectedGrade;
        const matchCategory = openCategoryMenu === 'all' || lvl.category === openCategoryMenu;
        return matchGrade && matchCategory;
      })
    : [];

  const activeLevelCategoryConfig = CATEGORIES.find((c) => c.id === currentLevel.category) || CATEGORIES[0];
  const ActiveCatIcon = activeLevelCategoryConfig.icon;

  return (
    <div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 space-y-2.5">
      {/* 1. Her Kategori İçin Ayrı Açılır Menü Başlıkları (Tamamen Responsive Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
        {CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const isOpen = openCategoryMenu === cat.id;
          
          const filteredCount = cat.id === 'all'
            ? levels.filter((lvl) => selectedGrade === 'all' || lvl.gradeLevel === selectedGrade).length
            : levels.filter((lvl) => (selectedGrade === 'all' || lvl.gradeLevel === selectedGrade) && lvl.category === cat.id).length;

          return (
            <button
              key={cat.id}
              id={`menu-header-${cat.id}`}
              onClick={() => handleCategoryHeaderClick(cat.id)}
              className={`p-2 sm:px-3 sm:py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer flex items-center justify-between gap-1.5 border-2 sm:border-3 w-full shadow-xs ${
                isOpen
                  ? `${cat.activeBg} text-white ${cat.activeBorder} shadow-[0_3px_0_0_rgba(0,0,0,0.2)] scale-102`
                  : 'bg-white hover:bg-[#FFF9F0] text-[#2D3436] border-[#DFE6E9] hover:border-[#B2BEC3] hover:translate-y-[-1px]'
              }`}
              title={`${cat.label} görev listesini aç/kapat`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <IconComp className={`w-4 h-4 shrink-0 ${isOpen ? 'text-white' : cat.textColor}`} />
                <span className="truncate text-[11px] sm:text-xs">
                  {cat.shortLabel}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    isOpen ? 'bg-black/25 text-white' : 'bg-[#F1F2F6] text-[#636E72]'
                  }`}
                >
                  {filteredCount}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-white shrink-0" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#636E72] shrink-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. Seçilen Kategoriye Ait Açılır Menü Gövdesi (Görev seçilince otomatik kapanır) */}
      {openCategoryMenu && currentOpenConfig && (
        <div className="bg-white rounded-[28px] border-3 sm:border-4 border-[#DFE6E9] shadow-[0_6px_0_0_#DFE6E9] p-3 sm:p-5 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Menü Başlığı ve Kapat Butonu */}
          <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#DFE6E9] gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-xl ${currentOpenConfig.color} text-white flex items-center justify-center text-sm shadow-xs shrink-0`}>
                <currentOpenConfig.icon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#2D3436] leading-tight">
                  {currentOpenConfig.label} Menüsü
                </h4>
                <p className="text-[11px] text-[#636E72] font-semibold hidden xs:block">
                  {currentOpenConfig.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOpenCategoryMenu(null)}
              className="px-2.5 py-1 rounded-xl bg-[#F1F2F6] hover:bg-[#DFE6E9] text-[#636E72] font-black text-xs flex items-center gap-1 cursor-pointer transition shrink-0"
              title="Menüyü Kapat"
            >
              <X className="w-3.5 h-3.5" />
              <span>Kapat</span>
            </button>
          </div>

          {/* Kategoriye Ait Görev Kartları Listesi (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 max-h-[360px] overflow-y-auto p-1">
            {levelsToShow.map((lvl) => {
              const isCurrent = lvl.id === currentLevelId;
              const isSolved = userStats.solvedLevelIds.includes(lvl.id);
              const lvlNumber = levels.findIndex((l) => l.id === lvl.id) + 1;

              return (
                <button
                  key={lvl.id}
                  id={`level-card-${lvl.id}`}
                  onClick={() => handleLevelSelect(lvl.id)}
                  className={`p-3 rounded-[20px] border-2 sm:border-3 text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                    isCurrent
                      ? 'bg-white border-[#FF7675] shadow-[0_3px_0_0_#D63031] ring-2 ring-[#FF7675]/30 scale-101'
                      : isSolved
                      ? 'bg-[#F0FFF4] border-[#55E6C1] shadow-[0_2px_0_0_#26de81] hover:scale-102'
                      : 'bg-white border-[#DFE6E9] hover:border-[#45AAF2] hover:shadow-[0_2px_0_0_#2d98da] hover:scale-102'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span
                        className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center border ${
                          isCurrent
                            ? 'bg-[#FF7675] text-white border-[#D63031]'
                            : 'bg-[#FFF9F0] text-[#2D3436] border-[#DFE6E9]'
                        }`}
                      >
                        {lvlNumber}
                      </span>

                      <div className="flex items-center gap-1">
                        {isSolved ? (
                          <span className="flex items-center gap-0.5 text-[10px] font-black text-[#D35400] bg-[#FFEAA7] px-2 py-0.2 rounded-full border border-[#F1C40F]">
                            <Star className="w-3 h-3 fill-[#FD9644] text-[#FD9644]" />
                            <span>3</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#636E72] bg-[#F1F2F6] px-1.5 py-0.2 rounded-full">
                            {lvl.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-xs sm:text-sm font-black text-[#2D3436] line-clamp-1 group-hover:text-[#45AAF2] transition-colors">
                        {lvl.title}
                      </h5>
                      <p className="text-[11px] text-[#636E72] line-clamp-2 mt-0.5 leading-tight">
                        {lvl.scenario}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 mt-1.5 border-t border-[#DFE6E9] flex items-center justify-between text-[10px] sm:text-[11px] font-extrabold">
                    <span className="text-[#45AAF2] font-black">
                      {lvl.availableSteps.length} Komut Adımı
                    </span>
                    <span className="flex items-center gap-1 text-[#2D3436] font-black">
                      {isCurrent ? 'Seçili' : isSolved ? 'Tekrar' : 'Başla'}
                      <Play className="w-3 h-3 fill-current text-[#FF7675]" />
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Sonsuz Seviye Ekle Kartı */}
            <button
              id="btn-generate-endless"
              onClick={() => {
                sound.playStar();
                onGenerateEndlessLevel();
                setOpenCategoryMenu(null);
              }}
              className="p-3 rounded-[20px] border-2 sm:border-3 border-dashed border-[#FD9644] bg-[#FFF9F0] hover:bg-[#FFEAA7]/40 text-[#2D3436] transition-all flex flex-col items-center justify-center text-center gap-1 cursor-pointer shadow-[0_2px_0_0_#fa8231] hover:scale-102 group"
            >
              <div className="w-7 h-7 rounded-xl bg-[#FD9644] text-white group-hover:scale-110 transition flex items-center justify-center text-sm shadow-xs">
                ✨
              </div>
              <div>
                <h5 className="text-xs font-black text-[#2D3436]">
                  Yeni Görev Ekle
                </h5>
                <p className="text-[10px] text-[#636E72]">
                  Sonsuz Seviye Üret
                </p>
              </div>
              <span className="text-[10px] font-black text-white bg-[#FD9644] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <PlusCircle className="w-3 h-3" />
                <span>Ekle & Başla</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Kompakt Aktif Görev Bilgi & Hızlı Gezinme Çubuğu */}
      <div className="bg-white rounded-[22px] border-2 sm:border-3 border-[#DFE6E9] shadow-[0_2px_0_0_#DFE6E9] px-3.5 py-2 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-lg bg-[#FFF9F0] border border-[#DFE6E9] font-black text-xs text-[#2D3436] flex items-center justify-center shrink-0">
            {currentIdx + 1}
          </span>
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black ${activeLevelCategoryConfig.color} text-white shrink-0`}>
              <ActiveCatIcon className="w-3 h-3" />
              <span>{activeLevelCategoryConfig.shortLabel}</span>
            </span>
            <span className="text-xs sm:text-sm font-black text-[#2D3436] truncate">
              {currentLevel.title}
            </span>
            {isCurrentSolved && (
              <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full bg-[#FFEAA7] text-[#D35400] text-[10px] font-black border border-[#F1C40F] shrink-0">
                <Star className="w-3 h-3 fill-[#FD9644] text-[#FD9644]" />
                <span>Tamamlandı</span>
              </span>
            )}
          </div>
        </div>

        {/* Hızlı Önceki / Sonraki Butonları */}
        <div className="flex items-center gap-1 bg-[#FFF9F0] p-1 rounded-xl border border-[#DFE6E9] shrink-0 ml-auto">
          <button
            onClick={handlePrevLevel}
            disabled={currentIdx === 0}
            className="p-1 rounded-lg hover:bg-white text-[#2D3436] disabled:opacity-30 transition cursor-pointer"
            title="Önceki Görev"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-black px-1 text-[#636E72]">
            {currentIdx + 1} / {levels.length}
          </span>
          <button
            onClick={handleNextLevel}
            className="p-1 rounded-lg hover:bg-white text-[#2D3436] transition cursor-pointer"
            title="Sonraki Görev"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
