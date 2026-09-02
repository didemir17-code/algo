'use client';

import React from 'react';
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
  Play
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
  // Filter levels by grade & category
  const filteredLevels = levels.filter((lvl) => {
    const matchGrade = selectedGrade === 'all' || lvl.gradeLevel === selectedGrade;
    const matchCategory = selectedCategory === 'all' || lvl.category === selectedCategory;
    return matchGrade && matchCategory;
  });

  return (
    <div className="max-w-7xl mx-auto py-2 px-3 sm:px-6 space-y-4">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
        <button
          id="cat-all"
          onClick={() => {
            sound.playPop();
            setSelectedCategory('all');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'all'
              ? 'bg-[#FF7675] text-white shadow-[0_3px_0_0_#D63031] scale-102'
              : 'bg-white hover:bg-[#FFF9F0] text-[#2D3436] border-2 border-[#DFE6E9]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Tüm Görevler ({levels.length})</span>
        </button>

        <button
          id="cat-sirali"
          onClick={() => {
            sound.playPop();
            setSelectedCategory('sirali');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'sirali'
              ? 'bg-[#FD9644] text-white shadow-[0_3px_0_0_#fa8231] scale-102'
              : 'bg-white hover:bg-amber-50 text-[#2D3436] border-2 border-[#DFE6E9]'
          }`}
        >
          <ListOrdered className="w-4 h-4 text-[#FD9644]" />
          <span>Sıralama (Adım Adım)</span>
        </button>

        <button
          id="cat-dongu"
          onClick={() => {
            sound.playPop();
            setSelectedCategory('dongu');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'dongu'
              ? 'bg-[#A55EEA] text-white shadow-[0_3px_0_0_#8854d0] scale-102'
              : 'bg-white hover:bg-purple-50 text-[#2D3436] border-2 border-[#DFE6E9]'
          }`}
        >
          <Repeat className="w-4 h-4 text-[#A55EEA]" />
          <span>Döngüler (Tekrar)</span>
        </button>

        <button
          id="cat-kosul"
          onClick={() => {
            sound.playPop();
            setSelectedCategory('kosul');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'kosul'
              ? 'bg-[#45AAF2] text-white shadow-[0_3px_0_0_#2d98da] scale-102'
              : 'bg-white hover:bg-sky-50 text-[#2D3436] border-2 border-[#DFE6E9]'
          }`}
        >
          <GitFork className="w-4 h-4 text-[#45AAF2]" />
          <span>Koşullar (Eğer/İse)</span>
        </button>

        <button
          id="cat-robotik"
          onClick={() => {
            sound.playPop();
            setSelectedCategory('robotik');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'robotik'
              ? 'bg-[#55E6C1] text-[#2D3436] shadow-[0_3px_0_0_#26de81] scale-102'
              : 'bg-white hover:bg-emerald-50 text-[#2D3436] border-2 border-[#DFE6E9]'
          }`}
        >
          <Bot className="w-4 h-4 text-[#26de81]" />
          <span>Robotik Labirent</span>
        </button>

        <button
          id="cat-hata_ayiklama"
          onClick={() => {
            sound.playPop();
            setSelectedCategory('hata_ayiklama');
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            selectedCategory === 'hata_ayiklama'
              ? 'bg-[#FF7675] text-white shadow-[0_3px_0_0_#D63031] scale-102'
              : 'bg-white hover:bg-rose-50 text-[#2D3436] border-2 border-[#DFE6E9]'
          }`}
        >
          <Bug className="w-4 h-4 text-[#FF7675]" />
          <span>Böcek Avı (Debug)</span>
        </button>
      </div>

      {/* Levels Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredLevels.map((lvl, index) => {
          const isCurrent = lvl.id === currentLevelId;
          const isSolved = userStats.solvedLevelIds.includes(lvl.id);

          return (
            <button
              key={lvl.id}
              id={`level-card-${lvl.id}`}
              onClick={() => {
                sound.playPop();
                onSelectLevel(lvl.id);
              }}
              className={`p-4 rounded-[24px] border-3 sm:border-4 text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'bg-white border-[#FF7675] shadow-[0_4px_0_0_#D63031] scale-102 ring-2 ring-[#FF7675]/30'
                  : isSolved
                  ? 'bg-white border-[#55E6C1] shadow-[0_4px_0_0_#26de81] hover:translate-y-[-2px]'
                  : 'bg-white border-[#DFE6E9] hover:border-[#45AAF2] hover:shadow-[0_4px_0_0_#2d98da] hover:translate-y-[-2px]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-[#FFF9F0] border-2 border-[#DFE6E9] text-[#2D3436] font-black text-xs flex items-center justify-center">
                    {index + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    {isSolved ? (
                      <span className="flex items-center gap-0.5 text-xs font-black text-[#D35400] bg-[#FFEAA7] px-2.5 py-0.5 rounded-full border border-[#F1C40F]">
                        <Star className="w-3.5 h-3.5 fill-[#FD9644] text-[#FD9644]" />
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
                  <h4 className="text-xs sm:text-sm font-black text-[#2D3436] line-clamp-1">
                    {lvl.title}
                  </h4>
                  <p className="text-[11px] text-[#636E72] line-clamp-2 mt-0.5 leading-snug">
                    {lvl.scenario}
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-2 border-t-2 border-[#DFE6E9] flex items-center justify-between text-[11px] font-extrabold">
                <span className="text-[#45AAF2]">
                  {lvl.availableSteps.length} Komut Adımı
                </span>
                <span className="flex items-center gap-1 text-[#2D3436]">
                  {isCurrent ? 'Şu Anki' : isSolved ? 'Tekrar Oyna' : 'Başla'}
                  <Play className="w-3 h-3 fill-current text-[#FF7675]" />
                </span>
              </div>
            </button>
          );
        })}

        {/* Endless / Extra Level Generator Card */}
        <button
          id="btn-generate-endless"
          onClick={() => {
            sound.playStar();
            onGenerateEndlessLevel();
          }}
          className="p-4 rounded-[24px] border-4 border-dashed border-[#FD9644] bg-white hover:bg-[#FFEAA7]/40 text-[#2D3436] transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer shadow-[0_4px_0_0_#fa8231] hover:translate-y-[-2px] group"
        >
          <div className="w-10 h-10 rounded-2xl bg-[#FD9644] text-white group-hover:scale-110 transition flex items-center justify-center text-xl shadow-xs">
            ✨
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#2D3436]">
              Yeni Maceraya Devam Et!
            </h4>
            <p className="text-[10px] text-[#636E72] font-semibold mt-0.5">
              Sonsuz Seviye Üret & Puan Kazan
            </p>
          </div>
          <span className="text-[11px] font-black text-white bg-[#FD9644] px-3.5 py-1 rounded-full flex items-center gap-1 shadow-[0_2px_0_0_#fa8231]">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Yeni Seviye Ekle</span>
          </span>
        </button>
      </div>
    </div>
  );
};
