'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
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
  Layers,
  Award
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

const CATEGORIES = [
  { id: 'all' as const, label: 'Tüm Görevler', icon: Sparkles, color: 'bg-[#FF7675]', text: 'text-[#FF7675]', border: 'border-[#FF7675]' },
  { id: 'sirali' as const, label: 'Sıralama (Adım Adım)', icon: ListOrdered, color: 'bg-[#FD9644]', text: 'text-[#FD9644]', border: 'border-[#FD9644]' },
  { id: 'dongu' as const, label: 'Döngüler (Tekrar)', icon: Repeat, color: 'bg-[#A55EEA]', text: 'text-[#A55EEA]', border: 'border-[#A55EEA]' },
  { id: 'kosul' as const, label: 'Koşullar (Eğer/İse)', icon: GitFork, color: 'bg-[#45AAF2]', text: 'text-[#45AAF2]', border: 'border-[#45AAF2]' },
  { id: 'robotik' as const, label: 'Robotik Labirent', icon: Bot, color: 'bg-[#55E6C1]', text: 'text-[#10ac84]', border: 'border-[#55E6C1]' },
  { id: 'hata_ayiklama' as const, label: 'Böcek Avı (Debug)', icon: Bug, color: 'bg-[#FF7675]', text: 'text-[#FF7675]', border: 'border-[#FF7675]' },
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
  // Açılır menü durumu (Varsayılan olarak kapalıdır, görev seçilince otomatik kapanır)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Aktif görevi ve index'ini bul
  const currentIdx = levels.findIndex((lvl) => lvl.id === currentLevelId);
  const currentLevel = levels[currentIdx] || levels[0];
  const isCurrentSolved = userStats.solvedLevelIds.includes(currentLevel.id);

  // Filtrelenmiş görevler
  const filteredLevels = levels.filter((lvl) => {
    const matchGrade = selectedGrade === 'all' || lvl.gradeLevel === selectedGrade;
    const matchCategory = selectedCategory === 'all' || lvl.category === selectedCategory;
    return matchGrade && matchCategory;
  });

  const handleCategoryClick = (catId: 'all' | CategoryType) => {
    sound.playPop();
    setSelectedCategory(catId);
    // Kategori butonuna tıklandığında menüyü aç
    setIsMenuOpen(true);
  };

  const handleLevelCardSelect = (levelId: string) => {
    sound.playPop();
    onSelectLevel(levelId);
    // Görev seçilince menüyü otomatik kapat ve alttaki oyunu göster!
    setIsMenuOpen(false);
  };

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

  const currentCategoryConfig = CATEGORIES.find((c) => c.id === currentLevel.category) || CATEGORIES[0];
  const CurrentIcon = currentCategoryConfig.icon;

  return (
    <div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 space-y-3">
      {/* 1. Üst Ana Görev & Kategori Seçim Çubuğu (Her Zaman Görünür) */}
      <div className="bg-white rounded-[28px] border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] p-3 sm:p-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Sol: Aktif Görev Başlığı ve Hızlı Geçiş Butonları */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9F0] border-3 border-[#DFE6E9] text-[#2D3436] flex items-center justify-center font-black text-base shrink-0 shadow-xs">
            <span>{currentIdx + 1}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold text-[#636E72]">Aktif Görev:</span>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black ${currentCategoryConfig.color} text-white`}>
                <CurrentIcon className="w-3 h-3" />
                <span>{currentCategoryConfig.label}</span>
              </span>
              {isCurrentSolved && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFEAA7] text-[#D35400] text-[10px] font-black border border-[#F1C40F]">
                  <Star className="w-3 h-3 fill-[#FD9644] text-[#FD9644]" />
                  <span>Tamamlandı</span>
                </span>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#2D3436] tracking-tight line-clamp-1">
              {currentLevel.title}
            </h3>
          </div>
        </div>

        {/* Sağ: Hızlı Önceki/Sonraki Butonları ve Ana Açılır Menü Butonu */}
        <div className="flex items-center gap-2 justify-between lg:justify-end">
          {/* Hızlı Önceki / Sonraki */}
          <div className="flex items-center gap-1 bg-[#FFF9F0] p-1 rounded-2xl border-2 border-[#DFE6E9]">
            <button
              onClick={handlePrevLevel}
              disabled={currentIdx === 0}
              className="p-1.5 rounded-xl hover:bg-white text-[#2D3436] disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
              title="Önceki Görev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black px-1.5 text-[#636E72]">
              {currentIdx + 1} / {levels.length}
            </span>
            <button
              onClick={handleNextLevel}
              className="p-1.5 rounded-xl hover:bg-white text-[#2D3436] transition cursor-pointer"
              title="Sonraki Görev"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Açılır Menüyü Aç / Kapat Butonu */}
          <button
            id="btn-toggle-level-menu"
            onClick={() => {
              sound.playPop();
              setIsMenuOpen(!isMenuOpen);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
              isMenuOpen
                ? 'bg-[#FF7675] text-white shadow-[0_3px_0_0_#D63031]'
                : 'bg-[#55E6C1] hover:bg-[#26de81] text-white shadow-[0_3px_0_0_#26de81] hover:translate-y-[-1px]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isMenuOpen ? 'Görev Menüsünü Kapat' : 'Görevleri Seç & Değiştir'}</span>
            {isMenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Açılır Menü Gövdesi (Tüm Görevler, Sıralama, Döngüler, Koşullar, Robotik, Böcek Avı) */}
      {isMenuOpen && (
        <div className="bg-white rounded-[32px] border-4 border-[#DFE6E9] shadow-[0_8px_0_0_#DFE6E9] p-4 sm:p-6 space-y-4 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Kategori Sekmeleri (Açılır Menü İçinde) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#636E72] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FD9644]" />
                <span>Kategori Seç:</span>
              </span>
              <span className="text-[11px] font-bold text-[#636E72]">
                Bir göreve tıkladığında menü otomatik kapanacaktır ✨
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const count = cat.id === 'all' 
                  ? levels.length 
                  : levels.filter((l) => l.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    id={`cat-${cat.id}`}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-3.5 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? `${cat.color} text-white shadow-[0_3px_0_0_rgba(0,0,0,0.2)] scale-102`
                        : 'bg-[#FFF9F0] hover:bg-white text-[#2D3436] border-2 border-[#DFE6E9]'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-black/20 text-white' : 'bg-white text-[#636E72]'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Görev Kartları Listesi (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 max-h-[420px] overflow-y-auto p-1">
            {filteredLevels.map((lvl, index) => {
              const isCurrent = lvl.id === currentLevelId;
              const isSolved = userStats.solvedLevelIds.includes(lvl.id);
              const lvlNumber = levels.findIndex((l) => l.id === lvl.id) + 1;

              return (
                <button
                  key={lvl.id}
                  id={`level-card-${lvl.id}`}
                  onClick={() => handleLevelCardSelect(lvl.id)}
                  className={`p-3.5 rounded-[22px] border-3 text-left transition-all relative flex flex-col justify-between cursor-pointer group ${
                    isCurrent
                      ? 'bg-white border-[#FF7675] shadow-[0_4px_0_0_#D63031] ring-2 ring-[#FF7675]/30'
                      : isSolved
                      ? 'bg-[#F0FFF4] border-[#55E6C1] shadow-[0_3px_0_0_#26de81] hover:scale-102'
                      : 'bg-white border-[#DFE6E9] hover:border-[#45AAF2] hover:shadow-[0_3px_0_0_#2d98da] hover:scale-102'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center border-2 ${
                        isCurrent 
                          ? 'bg-[#FF7675] text-white border-[#D63031]' 
                          : 'bg-[#FFF9F0] text-[#2D3436] border-[#DFE6E9]'
                      }`}>
                        {lvlNumber}
                      </span>

                      <div className="flex items-center gap-1">
                        {isSolved ? (
                          <span className="flex items-center gap-0.5 text-[11px] font-black text-[#D35400] bg-[#FFEAA7] px-2 py-0.5 rounded-full border border-[#F1C40F]">
                            <Star className="w-3 h-3 fill-[#FD9644] text-[#FD9644]" />
                            <span>3</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[#636E72] bg-[#F1F2F6] px-2 py-0.5 rounded-full">
                            {lvl.difficulty}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-[#2D3436] line-clamp-1 group-hover:text-[#45AAF2] transition-colors">
                        {lvl.title}
                      </h4>
                      <p className="text-[11px] text-[#636E72] line-clamp-2 mt-0.5 leading-snug">
                        {lvl.scenario}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2 border-t-2 border-[#DFE6E9] flex items-center justify-between text-[11px] font-extrabold">
                    <span className="text-[#45AAF2] font-black">
                      {lvl.availableSteps.length} Komut Adımı
                    </span>
                    <span className="flex items-center gap-1 text-[#2D3436] font-black">
                      {isCurrent ? 'Seçili' : isSolved ? 'Tekrar Oyna' : 'Başla'}
                      <Play className="w-3 h-3 fill-current text-[#FF7675]" />
                    </span>
                  </div>
                </button>
              );
            })}

            {/* Sonsuz Seviye Ekle Butonu */}
            <button
              id="btn-generate-endless"
              onClick={() => {
                sound.playStar();
                onGenerateEndlessLevel();
                setIsMenuOpen(false);
              }}
              className="p-3.5 rounded-[22px] border-3 border-dashed border-[#FD9644] bg-[#FFF9F0] hover:bg-[#FFEAA7]/40 text-[#2D3436] transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer shadow-[0_3px_0_0_#fa8231] hover:scale-102 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#FD9644] text-white group-hover:scale-110 transition flex items-center justify-center text-base shadow-xs">
                ✨
              </div>
              <div>
                <h4 className="text-xs font-black text-[#2D3436]">
                  Yeni Görev Ekle
                </h4>
                <p className="text-[10px] text-[#636E72] font-semibold">
                  Sonsuz Seviye Üret
                </p>
              </div>
              <span className="text-[10px] font-black text-white bg-[#FD9644] px-3 py-0.5 rounded-full flex items-center gap-1">
                <PlusCircle className="w-3 h-3" />
                <span>Ekle & Başla</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
