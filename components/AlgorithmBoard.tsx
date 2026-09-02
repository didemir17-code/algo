'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  Check, 
  HelpCircle, 
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Level, AlgorithmStep, UserStats } from '../lib/types';
import { IconHelper } from './IconHelper';
import { sound } from '../lib/sound';
import { VisualSimulation } from './VisualSimulation';
import { DecisionAnalysisModal } from './DecisionAnalysisModal';

interface AlgorithmBoardProps {
  level: Level;
  userStats: UserStats;
  onLevelSolved: (levelId: string, isFirstTime: boolean) => void;
  onNextLevel: () => void;
  onOpenSummary: () => void;
  onOpenConcepts: () => void;
}

export const AlgorithmBoard: React.FC<AlgorithmBoardProps> = ({
  level,
  userStats,
  onLevelSolved,
  onNextLevel,
  onOpenSummary,
  onOpenConcepts,
}) => {
  // Current user ordered steps (array of step objects)
  const [workspaceSteps, setWorkspaceSteps] = useState<AlgorithmStep[]>(() => {
    if (level.category === 'hata_ayiklama') {
      return [...level.availableSteps].sort(() => 0.5 - Math.random());
    }
    return [];
  });
  // Execution status
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Show hint
  const [showHint, setShowHint] = useState(false);
  // Show Decision Analysis Modal
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);

  // Add step from bank to workspace
  const handleAddStep = (step: AlgorithmStep) => {
    sound.playPop();
    if (workspaceSteps.some((s) => s.id === step.id)) return;
    setWorkspaceSteps((prev) => [...prev, step]);
    setIsCompleted(false);
  };

  // Remove step from workspace
  const handleRemoveStep = (index: number) => {
    sound.playPop();
    setWorkspaceSteps((prev) => prev.filter((_, i) => i !== index));
    setIsCompleted(false);
  };

  // Move step Up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    sound.playPop();
    setWorkspaceSteps((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
    setIsCompleted(false);
  };

  // Move step Down
  const handleMoveDown = (index: number) => {
    if (index === workspaceSteps.length - 1) return;
    sound.playPop();
    setWorkspaceSteps((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
    setIsCompleted(false);
  };

  // Reset workspace
  const handleReset = () => {
    sound.playPop();
    if (level.category === 'hata_ayiklama') {
      setWorkspaceSteps([...level.availableSteps]);
    } else {
      setWorkspaceSteps([]);
    }
    setIsRunning(false);
    setActiveStepIndex(-1);
    setIsCompleted(false);
    setIsSuccess(false);
  };

  // Execute & Validate Algorithm
  const handleRunAlgorithm = () => {
    if (workspaceSteps.length === 0) return;

    sound.playPop();
    setIsRunning(true);
    setActiveStepIndex(0);
    setIsCompleted(false);

    const stepInterval = 750; // ms per step for nice animation
    let currentIdx = 0;

    const interval = setInterval(() => {
      sound.playStep(currentIdx);
      setActiveStepIndex(currentIdx);
      currentIdx += 1;

      if (currentIdx >= workspaceSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setIsCompleted(true);

          // Check correctness
          const userOrder = workspaceSteps.map((s) => s.id);
          const isExactMatch =
            userOrder.length === level.correctStepOrder.length &&
            userOrder.every((id, idx) => id === level.correctStepOrder[idx]);

          // Also check alternative valid orders if any
          const isAlternativeMatch = level.alternativeValidOrders?.some(
            (alt) =>
              alt.length === userOrder.length &&
              alt.every((id, idx) => id === userOrder[idx])
          );

          const success = isExactMatch || Boolean(isAlternativeMatch);
          setIsSuccess(success);

          if (success) {
            sound.playSuccess();
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
              });
            } catch {
              // ignore
            }
            onLevelSolved(level.id, !userStats.solvedLevelIds.includes(level.id));
          } else {
            sound.playTryAgain();
          }

          // Automatically show the Decision & Correct Analysis
          setShowAnalysisModal(true);
        }, 500);
      }
    }, stepInterval);
  };

  // Correct step objects in order
  const correctStepObjects = level.correctStepOrder
    .map((id) => level.availableSteps.find((s) => s.id === id))
    .filter(Boolean) as AlgorithmStep[];

  return (
    <div className="max-w-7xl mx-auto py-4 px-3 sm:px-6 space-y-6">
      {/* Top Banner: Level Info, Grade, Difficulty & Actions */}
      <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#45AAF2]/15 text-[#2d98da] border-2 border-[#45AAF2]/30">
              {level.gradeLevel}. Sınıf
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFEAA7] text-[#D35400] border-2 border-[#F1C40F]">
              {level.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#A55EEA]/15 text-[#8854d0] border-2 border-[#A55EEA]/30">
              {level.category === 'sirali' && 'Adım Adım Sıralama'}
              {level.category === 'dongu' && 'Döngü & Tekrar'}
              {level.category === 'kosul' && 'Koşul (Eğer-İse)'}
              {level.category === 'hata_ayiklama' && 'Böcek Avı (Debug)'}
              {level.category === 'robotik' && 'Robotik Rota'}
            </span>
            {userStats.solvedLevelIds.includes(level.id) && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#55E6C1]/20 text-[#10ac84] border-2 border-[#55E6C1] flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-[#10ac84]" />
                <span>Tamamlandı</span>
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#2D3436] tracking-tight">
            {level.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#636E72] leading-relaxed font-medium">
            {level.scenario}
          </p>
        </div>

        {/* Mascot Speech Bubble & Tip Button */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            id="btn-toggle-hint"
            onClick={() => {
              sound.playPop();
              setShowHint(!showHint);
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              showHint
                ? 'bg-[#FD9644] text-white shadow-[0_3px_0_0_#fa8231]'
                : 'bg-[#FFEAA7] hover:bg-[#FDCB6E] text-[#D35400] border-2 border-[#F1C40F] shadow-[0_3px_0_0_#F1C40F]'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-[#D35400]" />
            <span>{showHint ? 'İpucunu Gizle' : 'Robi\'nin İpucu'}</span>
          </button>
        </div>
      </div>

      {/* Mascot Hint Reveal Card */}
      {showHint && (
        <div className="bg-[#FFEAA7] rounded-[24px] p-4 border-3 border-[#F1C40F] shadow-[0_4px_0_0_#F1C40F] flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-2xl bg-[#FD9644] text-white flex items-center justify-center text-xl shrink-0 shadow-xs">
            🤖
          </div>
          <div>
            <h4 className="text-xs font-black text-[#D35400]">Robi&apos;nin Akıllı İpucu:</h4>
            <p className="text-xs sm:text-sm text-[#2D3436] mt-0.5 font-bold">
              &quot;{level.mascotTip}&quot;
            </p>
          </div>
        </div>
      )}

      {/* Main Interactive Grid: Simulation (Left/Top) & Algorithm Builder (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Simulation & Execution Status */}
        <div className="lg:col-span-5 space-y-4">
          <VisualSimulation
            level={level}
            currentStepIndex={activeStepIndex}
            isRunning={isRunning}
            isCompleted={isCompleted}
            isSuccess={isSuccess}
            orderedStepIds={workspaceSteps.map((s) => s.id)}
          />

          {/* Controls below simulation */}
          <div className="bg-white rounded-[32px] p-5 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-black text-[#636E72]">
              <span>Çalışma Alanındaki Adım:</span>
              <span className="px-3 py-1 rounded-full bg-[#FFF9F0] text-[#FF7675] border-2 border-[#DFE6E9] font-black">
                {workspaceSteps.length} / {level.availableSteps.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-run-algorithm"
                disabled={isRunning || workspaceSteps.length === 0}
                onClick={handleRunAlgorithm}
                className={`flex-1 py-3.5 rounded-2xl font-black text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isRunning
                    ? 'bg-[#DFE6E9] text-[#B2BEC3] cursor-not-allowed'
                    : workspaceSteps.length === 0
                    ? 'bg-[#F1F2F6] text-[#B2BEC3] cursor-not-allowed'
                    : 'bg-[#55E6C1] hover:bg-[#26de81] text-white shadow-[0_4px_0_0_#26de81] hover:translate-y-[2px]'
                }`}
              >
                <Play className={`w-5 h-5 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
                <span>{isRunning ? 'Çalıştırılıyor...' : 'Algoritmayı Çalıştır & Kontrol Et'}</span>
              </button>

              <button
                id="btn-reset-workspace"
                disabled={isRunning || workspaceSteps.length === 0}
                onClick={handleReset}
                className="p-3.5 rounded-2xl bg-[#F1F2F6] hover:bg-[#DFE6E9] text-[#636E72] shadow-[0_3px_0_0_#b2bec3] transition-all cursor-pointer hover:translate-y-[2px]"
                title="Çalışma Alanını Temizle"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {isCompleted && (
              <button
                id="btn-view-analysis-again"
                onClick={() => {
                  sound.playPop();
                  setShowAnalysisModal(true);
                }}
                className="w-full py-2.5 rounded-2xl bg-[#45AAF2]/15 hover:bg-[#45AAF2]/25 text-[#2d98da] font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border-2 border-[#45AAF2]/40 shadow-xs"
              >
                <Info className="w-4 h-4 text-[#45AAF2]" />
                <span>Doğru Algoritma & Karar Analizini Göster</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Code Blocks / Algorithm Builder */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Workspace (Sıralanan Adımlar) */}
          <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] space-y-4 min-h-[360px] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF7675] text-white flex items-center justify-center font-black text-sm shadow-[0_2px_0_0_#D63031]">
                    💻
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#2D3436]">
                      Algoritma Çalışma Alanı
                    </h3>
                    <p className="text-[11px] text-[#636E72] font-semibold">
                      Komutları yukarıdan aşağıya doğru sıraya diz.
                    </p>
                  </div>
                </div>

                {workspaceSteps.length > 0 && (
                  <button
                    id="btn-clear-all"
                    onClick={handleReset}
                    className="text-[11px] font-black text-[#FF7675] hover:text-[#D63031] bg-[#FF7675]/15 hover:bg-[#FF7675]/25 px-3 py-1.5 rounded-xl border border-[#FF7675]/30 transition cursor-pointer"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Steps List */}
              <div className="space-y-2.5">
                {workspaceSteps.length === 0 ? (
                  <div className="h-44 border-3 border-dashed border-[#DFE6E9] rounded-[24px] flex flex-col items-center justify-center p-4 text-center bg-[#FFF9F0]/60">
                    <span className="text-3xl animate-bounce mb-1">👇</span>
                    <p className="text-xs sm:text-sm font-black text-[#2D3436]">
                      Çalışma Alanı Henüz Boş
                    </p>
                    <p className="text-[11px] text-[#636E72] max-w-xs mt-0.5 font-medium">
                      Aşağıdaki renkli komut bloklarına dokunarak buraya ekle ve doğru sıraya diz!
                    </p>
                  </div>
                ) : (
                  workspaceSteps.map((step, index) => {
                    const isExecuting = isRunning && activeStepIndex === index;
                    return (
                      <div
                        key={`${step.id}-${index}`}
                        className={`p-3 rounded-2xl border-3 flex items-center justify-between gap-3 transition-all ${
                          isExecuting
                            ? 'bg-[#FFEAA7] border-[#FD9644] shadow-[0_4px_0_0_#fa8231] scale-102 ring-2 ring-[#FD9644]'
                            : 'bg-white border-[#DFE6E9] shadow-[0_3px_0_0_#DFE6E9] hover:border-[#45AAF2]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Order Number Badge */}
                          <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            isExecuting ? 'bg-[#FD9644] text-white animate-pulse' : 'bg-[#FF7675] text-white shadow-[0_2px_0_0_#D63031]'
                          }`}>
                            {index + 1}
                          </div>

                          {/* Icon */}
                          <div className="p-2 rounded-xl bg-[#FFF9F0] border border-[#DFE6E9] text-[#FF7675] shrink-0">
                            <IconHelper name={step.iconName} className="w-4 h-4" />
                          </div>

                          {/* Text */}
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-black text-[#2D3436] truncate">
                              {step.text}
                            </div>
                            <div className="text-[10px] text-[#636E72] font-semibold truncate">
                              {step.decisionRationale}
                            </div>
                          </div>
                        </div>

                        {/* Reorder and Delete Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            id={`btn-move-up-${index}`}
                            disabled={index === 0 || isRunning}
                            onClick={() => handleMoveUp(index)}
                            className="p-1.5 rounded-xl bg-[#F1F2F6] hover:bg-[#DFE6E9] disabled:opacity-30 text-[#2D3436] transition cursor-pointer"
                            title="Yukarı Taşı"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-move-down-${index}`}
                            disabled={index === workspaceSteps.length - 1 || isRunning}
                            onClick={() => handleMoveDown(index)}
                            className="p-1.5 rounded-xl bg-[#F1F2F6] hover:bg-[#DFE6E9] disabled:opacity-30 text-[#2D3436] transition cursor-pointer"
                            title="Aşağı Taşı"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`btn-remove-${index}`}
                            disabled={isRunning}
                            onClick={() => handleRemoveStep(index)}
                            className="p-1.5 rounded-xl bg-[#FF7675]/15 hover:bg-[#FF7675]/25 text-[#FF7675] transition cursor-pointer"
                            title="Kaldır"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Bottom Tip for Child */}
            <div className="pt-3 border-t-2 border-[#DFE6E9] flex items-center justify-between text-[11px] text-[#636E72] font-semibold">
              <span>💡 İpucu: Sıralamayı değiştirmek için okları (⬆️ ⬇️) kullanabilirsin.</span>
            </div>
          </div>

          {/* Step Block Bank (Kullanılabilir Bloklar) */}
          <div className="bg-white rounded-[32px] p-5 sm:p-6 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2D3436] uppercase tracking-wider">
                Kullanılabilir Komut Blokları:
              </span>
              <span className="text-[11px] font-bold text-[#636E72]">
                Eklemek için dokun (+)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {level.availableSteps.map((step) => {
                const isAlreadyInWorkspace = workspaceSteps.some((s) => s.id === step.id);
                return (
                  <button
                    key={step.id}
                    id={`btn-add-step-${step.id}`}
                    disabled={isAlreadyInWorkspace || isRunning}
                    onClick={() => handleAddStep(step)}
                    className={`p-3 rounded-2xl border-3 text-left transition-all flex items-center justify-between gap-2.5 ${
                      isAlreadyInWorkspace
                        ? 'bg-[#F1F2F6] border-[#DFE6E9] opacity-40 cursor-not-allowed'
                        : 'bg-white border-[#DFE6E9] hover:border-[#55E6C1] hover:shadow-[0_3px_0_0_#26de81] hover:translate-y-[-1px] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded-xl bg-[#FFF9F0] border border-[#DFE6E9] text-[#FF7675] shrink-0">
                        <IconHelper name={step.iconName} className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#2D3436] leading-snug line-clamp-2">
                        {step.text}
                      </span>
                    </div>

                    <div className="shrink-0">
                      {isAlreadyInWorkspace ? (
                        <Check className="w-4 h-4 text-[#55E6C1]" />
                      ) : (
                        <div className="w-6 h-6 rounded-lg bg-[#55E6C1] text-white flex items-center justify-center font-bold text-xs shadow-[0_2px_0_0_#26de81]">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Decision Analysis Modal (Triggered automatically on run or via button) */}
      <DecisionAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        level={level}
        isCorrect={isSuccess}
        userSteps={workspaceSteps}
        correctSteps={correctStepObjects}
        onNextLevel={() => {
          setShowAnalysisModal(false);
          onNextLevel();
        }}
        onRetry={() => {
          setShowAnalysisModal(false);
        }}
        onOpenSummary={() => {
          setShowAnalysisModal(false);
          onOpenSummary();
        }}
      />
    </div>
  );
};
