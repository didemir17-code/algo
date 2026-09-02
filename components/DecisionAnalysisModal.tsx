'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw, 
  X, 
  Award,
  Layers,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { Level, AlgorithmStep } from '../lib/types';
import { IconHelper } from './IconHelper';
import { sound } from '../lib/sound';

interface DecisionAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: Level;
  isCorrect: boolean;
  userSteps: AlgorithmStep[];
  correctSteps: AlgorithmStep[];
  onNextLevel: () => void;
  onRetry: () => void;
  onOpenSummary: () => void;
  isLastLevel?: boolean;
}

export const DecisionAnalysisModal: React.FC<DecisionAnalysisModalProps> = ({
  isOpen,
  onClose,
  level,
  isCorrect,
  userSteps,
  correctSteps,
  onNextLevel,
  onRetry,
  onOpenSummary,
}) => {
  if (!isOpen) return null;

  const analysis = level.pedagogicalAnalysis;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-[#FFF9F0] rounded-[36px] max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border-4 border-[#DFE6E9] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 sm:p-6 text-white flex items-center justify-between ${
          isCorrect 
            ? 'bg-[#55E6C1] shadow-[0_4px_0_0_#26de81]' 
            : 'bg-[#FD9644] shadow-[0_4px_0_0_#fa8231]'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
              {isCorrect ? '🌟' : '💡'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {isCorrect ? 'Harika Çözüm! Algoritma Başarılı!' : 'Güzel Deneme! Gel Birlikte İnceleyelim'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-white/95 font-bold">
                {isCorrect 
                  ? 'Tüm adımları kusursuz bir sırayla dizdin. Şimdi karar analizine bakalım.' 
                  : 'Algoritmanın doğru halini ve nedenlerini adım adım öğrenelim.'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-analysis-modal"
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-black/10 hover:bg-black/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-[#2D3436]">
          
          {/* Section 1: Algoritmanın Doğru Hali (Correct Algorithm Flowchart) */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#DFE6E9] shadow-[0_3px_0_0_#DFE6E9] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#45AAF2] text-white flex items-center justify-center shadow-[0_2px_0_0_#2d98da]">
                  <Layers className="w-4 h-4" />
                </div>
                <h4 className="text-sm sm:text-base font-black text-[#2D3436]">
                  Algoritmanın Doğru Sıralanışı
                </h4>
              </div>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#55E6C1]/20 text-[#10ac84] border-2 border-[#55E6C1]">
                {correctSteps.length} Adım
              </span>
            </div>

            {/* Sequence Pills */}
            <div className="grid grid-cols-1 gap-2.5 pt-1">
              {correctSteps.map((step, idx) => {
                const userStepAtThisIndex = userSteps[idx];
                const isMatch = userStepAtThisIndex && userStepAtThisIndex.id === step.id;

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-2xl border-3 flex items-center justify-between gap-3 transition-all ${
                      isMatch
                        ? 'bg-white border-[#55E6C1] shadow-[0_3px_0_0_#26de81]'
                        : isCorrect
                        ? 'bg-white border-[#DFE6E9] shadow-xs'
                        : 'bg-[#FFEAA7]/40 border-[#FD9644] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                        isMatch || isCorrect 
                          ? 'bg-[#55E6C1] text-white shadow-[0_2px_0_0_#26de81]' 
                          : 'bg-[#FD9644] text-white shadow-[0_2px_0_0_#fa8231]'
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="p-2 rounded-xl bg-[#FFF9F0] border border-[#DFE6E9] text-[#FF7675] shrink-0">
                        <IconHelper name={step.iconName} className="w-4 h-4" />
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-[#2D3436] truncate">
                          {step.text}
                        </div>
                        <div className="text-[11px] text-[#636E72] font-semibold truncate">
                          {step.decisionRationale}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      {isMatch ? (
                        <span className="flex items-center gap-1 text-[11px] font-black text-[#10ac84] bg-[#55E6C1]/20 px-2.5 py-1 rounded-full border border-[#55E6C1]/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10ac84]" />
                          <span className="hidden sm:inline">Doğru Sıra</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-black text-[#D35400] bg-[#FFEAA7] px-2.5 py-1 rounded-full border border-[#F1C40F]">
                          <Sparkles className="w-3.5 h-3.5 text-[#FD9644]" />
                          <span>Hedef Adım</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Alınan Kararların Derin Analizi (Step by Step Decision Analysis) */}
          <div className="bg-white rounded-[28px] p-5 border-3 border-[#DFE6E9] shadow-[0_3px_0_0_#DFE6E9] space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FD9644] text-white flex items-center justify-center shadow-[0_2px_0_0_#fa8231]">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-black text-[#2D3436]">
                  Alınan Kararların Analizi & Neden-Sonuç İlişkisi
                </h4>
                <p className="text-xs text-[#636E72] font-semibold">
                  Bu algoritmada neden bu sıralamayı yaptık?
                </p>
              </div>
            </div>

            {/* Decision Analysis Cards */}
            <div className="space-y-2.5">
              {analysis.stepByStepAnalysis.map((item) => (
                <div 
                  key={item.stepNumber}
                  className="bg-[#FFF9F0] rounded-2xl p-3.5 border-2 border-[#DFE6E9] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs font-black text-[#2D3436]">
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#FFEAA7] text-[#D35400] border border-[#F1C40F] flex items-center justify-center text-[10px] font-black">
                        {item.stepNumber}
                      </span>
                      <span>{item.stepTitle}</span>
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white border border-[#DFE6E9] text-[#636E72]">
                      {item.whyImportant}
                    </span>
                  </div>
                  <p className="text-xs text-[#636E72] pl-7 font-medium">
                    <strong className="text-[#2D3436] font-black">Kritik Karar: </strong> 
                    {item.criticalDecision}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Bilgisayar Bilimi & Günlük Hayat Kavramı */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-[24px] p-4 border-3 border-[#45AAF2]/30 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#2d98da] font-black text-xs sm:text-sm">
                <Cpu className="w-4 h-4 text-[#45AAF2]" />
                <span>Kodlama & Bilgisayar Bilimi</span>
              </div>
              <p className="text-xs text-[#636E72] leading-relaxed font-medium">
                <strong className="text-[#2D3436] font-black">{analysis.coreConcept}: </strong>
                {analysis.computerScienceConcept}
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-4 border-3 border-[#A55EEA]/30 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-[#8854d0] font-black text-xs sm:text-sm">
                <TrendingUp className="w-4 h-4 text-[#A55EEA]" />
                <span>Günlük Hayat Benzetmesi</span>
              </div>
              <p className="text-xs text-[#636E72] leading-relaxed font-medium">
                {analysis.realLifeAnalogy}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer with Actions */}
        <div className="p-4 sm:p-5 bg-white border-t-2 border-[#DFE6E9] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-analysis-retry"
              onClick={() => {
                sound.playPop();
                onRetry();
              }}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-[#F1F2F6] hover:bg-[#DFE6E9] text-[#2D3436] font-black text-xs sm:text-sm shadow-[0_3px_0_0_#DFE6E9] transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[1px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Dene & Canlandır</span>
            </button>

            <button
              id="btn-analysis-summary"
              onClick={() => {
                sound.playStar();
                onOpenSummary();
              }}
              className="px-4 py-3 rounded-2xl border-2 border-[#F1C40F] bg-[#FFEAA7] hover:bg-[#FDCB6E] text-[#D35400] font-black text-xs sm:text-sm shadow-[0_3px_0_0_#F1C40F] transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[1px]"
            >
              <Award className="w-4 h-4" />
              <span>Yeter / Karnem</span>
            </button>
          </div>

          <button
            id="btn-analysis-next"
            onClick={() => {
              sound.playSuccess();
              onNextLevel();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#55E6C1] hover:bg-[#26de81] text-white font-black text-xs sm:text-sm shadow-[0_4px_0_0_#26de81] transition-all transform hover:translate-y-[2px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sonraki Göreve Geç</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
