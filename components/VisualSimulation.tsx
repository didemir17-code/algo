'use client';

import React from 'react';
import { Level } from '../lib/types';

interface VisualSimulationProps {
  level: Level;
  currentStepIndex: number;
  isRunning: boolean;
  isCompleted: boolean;
  isSuccess: boolean;
  orderedStepIds: string[];
}

export const VisualSimulation: React.FC<VisualSimulationProps> = ({
  level,
  currentStepIndex,
  isRunning,
  isCompleted,
  isSuccess,
  orderedStepIds,
}) => {
  // Determine how many steps have executed so far
  const activeCount = isRunning
    ? Math.max(0, currentStepIndex + 1)
    : isCompleted
    ? orderedStepIds.length
    : 0;

  // Custom visualizer for Sandwich / Tost
  if (level.simulationType === 'sandwich') {
    const hasBottomBread = orderedStepIds.slice(0, activeCount).includes('step_bread_bottom');
    const hasButter = orderedStepIds.slice(0, activeCount).includes('step_butter');
    const hasCheese = orderedStepIds.slice(0, activeCount).includes('step_cheese');
    const hasTopBread = orderedStepIds.slice(0, activeCount).includes('step_bread_top');
    const isToasted = orderedStepIds.slice(0, activeCount).includes('step_toast_machine');

    return (
      <div className="w-full h-64 bg-gradient-to-b from-[#FFF9F0] to-[#FFEAA7]/40 rounded-[32px] border-4 border-[#DFE6E9] p-4 flex flex-col items-center justify-between relative overflow-hidden shadow-[0_4px_0_0_#DFE6E9]">
        {/* Status Tag */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-xs font-black text-[#D35400] bg-[#FFEAA7] px-3.5 py-1 rounded-full border-2 border-[#F1C40F] flex items-center gap-1.5 shadow-xs">
            <span>🍳 Mutfak Tezgahı</span>
          </span>
          {isToasted && isSuccess && (
            <span className="text-xs font-black text-white bg-[#55E6C1] px-3.5 py-1 rounded-full border-2 border-[#26de81] shadow-[0_2px_0_0_#26de81] animate-bounce">
              🔥 Çıtır Çıtır Tost Hazır!
            </span>
          )}
        </div>

        {/* Dynamic Sandwich Assembly Stack */}
        <div className="relative flex flex-col items-center justify-end w-full max-w-xs h-44 pb-2">
          {/* Plate */}
          <div className="w-48 h-6 bg-white rounded-full border-3 border-[#DFE6E9] shadow-md flex items-center justify-center">
            <div className="w-40 h-3 bg-[#FFF9F0] rounded-full opacity-80"></div>
          </div>

          {/* Bottom Bread */}
          {hasBottomBread && (
            <div className="absolute bottom-6 w-36 h-7 bg-[#FD9644] border-3 border-[#fa8231] rounded-xl shadow-[0_2px_0_0_#fa8231] transition-all duration-300 transform animate-in fade-in slide-in-from-top-4 flex items-center justify-center">
              <span className="text-[10px] font-black text-white">🍞 Taban Ekmeği</span>
            </div>
          )}

          {/* Butter Layer */}
          {hasButter && (
            <div className="absolute bottom-11 w-32 h-3.5 bg-[#FFEAA7] border-2 border-[#F1C40F] rounded-lg shadow-xs transition-all duration-300 animate-in fade-in flex items-center justify-center">
              <span className="text-[8px] font-black text-[#D35400]">🧈 Tereyağı Katmanı</span>
            </div>
          )}

          {/* Cheese Layer */}
          {hasCheese && (
            <div className={`absolute bottom-13 w-34 h-5.5 bg-[#F1C40F] border-2 border-[#f39c12] rounded-lg shadow-sm transition-all duration-300 animate-in fade-in flex items-center justify-center ${isToasted ? 'bg-[#FFEAA7] animate-pulse' : ''}`}>
              <span className="text-[10px] font-black text-[#2D3436]">🧀 Leziz Kaşar Peyniri</span>
            </div>
          )}

          {/* Top Bread */}
          {hasTopBread && (
            <div className="absolute bottom-17 w-36 h-7 bg-[#FD9644] border-3 border-[#fa8231] rounded-xl shadow-[0_3px_0_0_#fa8231] transition-all duration-300 transform animate-in fade-in slide-in-from-top-6 flex items-center justify-center">
              <span className="text-[10px] font-black text-white">🍞 Üst Ekmek Kapağı</span>
            </div>
          )}

          {/* Toast Grill Effect */}
          {isToasted && (
            <div className="absolute -top-1 right-4 flex items-center gap-1 text-2xl animate-bounce">
              <span>♨️</span>
              <span>✨</span>
            </div>
          )}

          {!hasBottomBread && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#B2BEC3] text-xs font-bold gap-1">
              <span className="text-3xl">🍞</span>
              <span>Adımları sıraya dizip tostu hazırlayalım!</span>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-[11px] font-black text-[#D35400] z-10">
          Hazırlanan Katman: {activeCount} / {orderedStepIds.length}
        </div>
      </div>
    );
  }

  // Custom visualizer for Flower blooming
  if (level.simulationType === 'flower') {
    const hasDug = orderedStepIds.slice(0, activeCount).includes('step_dig_soil');
    const hasSeed = orderedStepIds.slice(0, activeCount).includes('step_plant_seed');
    const hasCovered = orderedStepIds.slice(0, activeCount).includes('step_cover_soil');
    const hasWatered = orderedStepIds.slice(0, activeCount).includes('step_water_seed');
    const hasSun = orderedStepIds.slice(0, activeCount).includes('step_sunlight');

    return (
      <div className="w-full h-64 bg-gradient-to-b from-[#45AAF2]/15 via-[#FFF9F0] to-[#55E6C1]/20 rounded-[32px] border-4 border-[#DFE6E9] p-4 flex flex-col items-center justify-between relative overflow-hidden shadow-[0_4px_0_0_#DFE6E9]">
        <div className="w-full flex items-center justify-between z-10">
          <span className="text-xs font-black text-[#10ac84] bg-[#55E6C1]/20 px-3.5 py-1 rounded-full border-2 border-[#55E6C1]">
            🌱 Çiçek Bahçesi
          </span>
          {hasSun && (
            <span className="text-3xl animate-spin text-[#FD9644] duration-1000">☀️</span>
          )}
        </div>

        {/* Garden Center Animation */}
        <div className="relative flex flex-col items-center justify-end w-full max-w-xs h-40">
          {/* Flower Growth Stages */}
          {hasSun && hasWatered && hasCovered ? (
            <div className="flex flex-col items-center animate-in zoom-in-50 duration-500">
              <span className="text-5xl animate-bounce">🌸</span>
              <div className="w-2 h-16 bg-[#55E6C1] rounded-full flex items-center justify-center">
                <span className="text-xs -translate-x-2">🍃</span>
              </div>
            </div>
          ) : hasWatered ? (
            <div className="flex flex-col items-center animate-in zoom-in duration-300">
              <span className="text-3xl animate-pulse">🌱</span>
              <div className="w-1.5 h-6 bg-[#55E6C1] rounded-full"></div>
            </div>
          ) : hasSeed && !hasCovered ? (
            <div className="mb-2 text-xl animate-bounce">🌰</div>
          ) : null}

          {/* Pot & Soil */}
          <div className="w-36 h-18 bg-[#FD9644] rounded-b-3xl border-3 border-[#fa8231] shadow-md flex flex-col items-center justify-start p-1.5 relative overflow-hidden">
            <div className="w-full h-4 bg-[#D35400] rounded-full flex items-center justify-center">
              {hasDug && !hasCovered && <span className="text-[9px] text-[#FFEAA7] font-black">🕳️ Açılmış Çukur</span>}
              {hasCovered && <span className="text-[9px] text-[#FFEAA7] font-black">Toprakla Örtüldü ✓</span>}
            </div>
            {hasWatered && <div className="text-xs mt-2 text-white font-black animate-bounce">💧 Can Suyu Verildi</div>}
          </div>
        </div>

        <div className="text-[11px] font-black text-[#10ac84] z-10">
          {hasSun && hasWatered ? 'Harika! Çiçeğimiz rengarenk açtı! 🌸' : 'Tohumu sevgiyle büyütüyoruz...'}
        </div>
      </div>
    );
  }

  // Custom visualizer for Robot Grid
  if (level.simulationType === 'robot_grid' && level.gridConfig) {
    const config = level.gridConfig;
    const items = config.items;

    // Calculate robot animated position
    let robotX = config.startPos.x;
    let robotY = config.startPos.y;
    let collectedItems: string[] = [];

    // Simulate executed steps
    for (let i = 0; i < activeCount; i++) {
      const stepId = orderedStepIds[i];
      if (stepId.includes('forward_1') || stepId.includes('fwd1')) {
        robotX = Math.min(config.width - 1, robotX + 1);
      } else if (stepId.includes('forward_2')) {
        robotX = Math.min(config.width - 1, robotX + 1);
      } else if (stepId.includes('forward_up_1')) {
        robotY = Math.max(0, robotY - 1);
      } else if (stepId.includes('forward_up_2')) {
        robotY = Math.max(0, robotY - 1);
        collectedItems.push('star');
      } else if (stepId.includes('loop_4_times')) {
        robotX = Math.min(config.width - 1, robotX + 4);
        collectedItems.push('strawberry');
      } else if (stepId.includes('move_to_key')) {
        robotX = 3;
        robotY = 0;
        collectedItems.push('key');
      } else if (stepId.includes('move_down_door')) {
        robotY = 3;
      } else if (stepId.includes('unlock_door')) {
        collectedItems.push('door');
      }
    }

    return (
      <div className="w-full min-h-64 bg-[#2D3436] rounded-[32px] border-4 border-[#DFE6E9] p-4 flex flex-col items-center justify-between relative shadow-[0_4px_0_0_#DFE6E9] text-white">
        <div className="w-full flex items-center justify-between z-10 text-xs">
          <span className="font-black text-white bg-[#FF7675] px-3.5 py-1 rounded-full shadow-[0_2px_0_0_#D63031] flex items-center gap-1.5">
            <span>🚀 Robi Uzay Navigasyonu</span>
          </span>
          <span className="font-black text-[#2D3436] bg-[#FFEAA7] px-3.5 py-1 rounded-full shadow-xs">
            Pozisyon: ({robotX}, {robotY})
          </span>
        </div>

        {/* The 2D Grid */}
        <div
          className="grid gap-2 p-3 bg-black/40 rounded-2xl border-2 border-white/10 my-2 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${config.width}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: config.height }).map((_, r) =>
            Array.from({ length: config.width }).map((_, c) => {
              const isRobotHere = robotX === c && robotY === r;
              const cellItem = items.find((it) => it.x === c && it.y === r && it.type !== 'robot');
              const isItemCollected = cellItem && collectedItems.includes(cellItem.type);

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl border-2 flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 relative ${
                    isRobotHere
                      ? 'bg-[#FF7675] border-white shadow-lg scale-105 ring-4 ring-[#FFEAA7]'
                      : 'bg-white/10 border-white/15'
                  }`}
                >
                  {/* Background grid coord watermark */}
                  <span className="absolute top-0.5 left-1 text-[8px] text-white/40 select-none font-bold">
                    {c},{r}
                  </span>

                  {isRobotHere ? (
                    <span className="animate-pulse">🤖</span>
                  ) : cellItem && !isItemCollected ? (
                    <span>
                      {cellItem.type === 'star' && '⭐'}
                      {cellItem.type === 'obstacle' && '🪨'}
                      {cellItem.type === 'strawberry' && '🍓'}
                      {cellItem.type === 'key' && '🗝️'}
                      {cellItem.type === 'door' && '🚪'}
                    </span>
                  ) : isItemCollected ? (
                    <span className="text-[#55E6C1] text-xs font-black">✨</span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>

        <div className="text-[11px] font-bold text-white/80 text-center">
          {collectedItems.length > 0 ? '🎉 Nesneler toplandı! Robi hedefine ulaştı.' : 'Komutları çalıştırarak Robi\'yi hareket ettir!'}
        </div>
      </div>
    );
  }

  // Generic and Default Visualizer for other simulation types (Teeth, Cake, Weather, Bag, Routine, Traffic)
  return (
    <div className="w-full h-64 bg-white rounded-[32px] border-4 border-[#DFE6E9] p-4 flex flex-col items-center justify-between relative overflow-hidden shadow-[0_4px_0_0_#DFE6E9]">
      <div className="w-full flex items-center justify-between z-10">
        <span className="text-xs font-black text-[#FF7675] bg-[#FFF9F0] px-3.5 py-1 rounded-full border-2 border-[#DFE6E9]">
          🎮 Canlı Simülasyon
        </span>
        <span className="text-xs font-black text-[#636E72] bg-[#F1F2F6] px-3 py-1 rounded-full">
          Adım: {activeCount} / {orderedStepIds.length}
        </span>
      </div>

      {/* Dynamic Animated Scene */}
      <div className="flex flex-col items-center justify-center gap-3 my-auto">
        <div className="w-20 h-20 rounded-[24px] bg-[#FFF9F0] shadow-md border-3 border-[#DFE6E9] flex items-center justify-center text-4xl transform hover:rotate-6 transition-all duration-300">
          {level.simulationType === 'teeth' && (activeCount >= 3 ? '✨🪥' : '🪥')}
          {level.simulationType === 'cake_baking' && (activeCount >= 5 ? '🎂' : activeCount >= 4 ? '🥣' : '🥚')}
          {level.simulationType === 'weather' && (activeCount >= 2 ? '☔👢' : '🌧️')}
          {level.simulationType === 'school_bag' && (activeCount >= 5 ? '🎒✨' : '📚')}
          {level.simulationType === 'morning_routine' && (activeCount >= 4 ? '🏃👟' : '⏰')}
          {level.simulationType === 'traffic_light' && (activeCount >= 3 ? '🟢🚶' : '🔴🛑')}
          {level.simulationType === 'tea' && (activeCount >= 4 ? '🥤🧊' : '🍋')}
          {level.simulationType === 'generic' && (isSuccess ? '🏆' : '🎯')}
        </div>

        <div className="text-center space-y-1">
          <p className="text-sm font-black text-[#2D3436]">
            {isSuccess && isCompleted
              ? '🎉 Harika! Algoritma Kusursuz Çalıştı!'
              : isRunning
              ? `Adım ${currentStepIndex + 1} Çalıştırılıyor...`
              : 'Algoritmayı Çalıştır ve Sonucu Gör!'}
          </p>
          <p className="text-xs text-[#636E72] font-semibold">
            {orderedStepIds.length > 0
              ? `${orderedStepIds.length} komut sıraya dizildi.`
              : 'Aşağıdan adımları çalışma alanına dokunarak ekle.'}
          </p>
        </div>
      </div>

      <div className="w-full bg-[#DFE6E9] h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-[#55E6C1] h-full transition-all duration-300"
          style={{
            width: `${orderedStepIds.length > 0 ? (activeCount / orderedStepIds.length) * 100 : 0}%`,
          }}
        ></div>
      </div>
    </div>
  );
};
