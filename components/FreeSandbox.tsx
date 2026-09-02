'use client';

import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Bot, 
  Utensils, 
  Music, 
  CheckCircle2, 
  Lightbulb,
  FileCode2,
  Smile
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../lib/sound';

interface CustomStep {
  id: string;
  title: string;
  category: string;
  emoji: string;
  why: string;
}

const SAMPLE_CUSTOM_BLOCKS: CustomStep[] = [
  // Robotik & Hareket
  { id: 'sb_1', title: '2 Adım İleri Yürü', category: 'Hareket', emoji: '🚶', why: 'Hedefe doğru mesafe kat eder.' },
  { id: 'sb_2', title: 'Sağa Dön (90 Derece)', category: 'Hareket', emoji: '➡️', why: 'Yönü sağa çevirir.' },
  { id: 'sb_3', title: 'Sola Dön (90 Derece)', category: 'Hareket', emoji: '⬅️', why: 'Yönü sola çevirir.' },
  { id: 'sb_4', title: 'Yukarı Zıpla!', category: 'Hareket', emoji: '🦘', why: 'Engelin üzerinden atlar.' },
  
  // Dans & Müzik
  { id: 'sb_5', title: '3 Kere El Çırp (Alkış!)', category: 'Dans', emoji: '👏', why: 'Ritim tutmayı sağlar.' },
  { id: 'sb_6', title: 'Kendi Etrafında Dön', category: 'Dans', emoji: '💃', why: 'Dans figürünü tamamlar.' },
  { id: 'sb_7', title: 'Neşeli Bir Şarkı Söyle', category: 'Dans', emoji: '🎵', why: 'Ortama neşe katar.' },

  // Mutfak & Günlük
  { id: 'sb_8', title: 'Ellerini Sabunla Yıka', category: 'Günlük', emoji: '🧼', why: 'Hijyen ve sağlık sağlar.' },
  { id: 'sb_9', title: 'Buzdolabından Sütü Al', category: 'Günlük', emoji: '🥛', why: 'İçeceği hazırlar.' },
  { id: 'sb_10', title: 'Tabağa Dilim Pasta Koy', category: 'Günlük', emoji: '🍰', why: 'Leziz bir ikram sunar.' },
  { id: 'sb_11', title: 'Arkadaşına "Günaydın!" De', category: 'Sosyal', emoji: '👋', why: 'Güne güzel başlatır.' },
  { id: 'sb_12', title: 'Tüm Görevi Başarıyla Kutla', category: 'Ödül', emoji: '🎉', why: 'Mutluluk hormonu salgılar!' },
];

export const FreeSandbox: React.FC = () => {
  const [algoTitle, setAlgoTitle] = useState('Benim Süper Algoritmam');
  const [activeSteps, setActiveSteps] = useState<CustomStep[]>([
    SAMPLE_CUSTOM_BLOCKS[7], // Ellerini yıka
    SAMPLE_CUSTOM_BLOCKS[9], // Pasta koy
    SAMPLE_CUSTOM_BLOCKS[4], // Alkış
    SAMPLE_CUSTOM_BLOCKS[11], // Kutla
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Custom step input
  const [newStepText, setNewStepText] = useState('');
  const [newStepEmoji, setNewStepEmoji] = useState('⚡');

  const handleAddBlock = (block: CustomStep) => {
    sound.playPop();
    setActiveSteps(prev => [...prev, { ...block, id: `step_${Date.now()}_${Math.random()}` }]);
    setShowAnalysis(false);
  };

  const handleAddNewCustomStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    sound.playPop();
    const created: CustomStep = {
      id: `custom_${Date.now()}`,
      title: newStepText.trim(),
      category: 'Özel',
      emoji: newStepEmoji,
      why: 'Kullanıcı tarafından özel olarak tanımlanan yaratıcı işlem adımı.',
    };
    setActiveSteps(prev => [...prev, created]);
    setNewStepText('');
    setShowAnalysis(false);
  };

  const handleRemove = (index: number) => {
    sound.playPop();
    setActiveSteps(prev => prev.filter((_, i) => i !== index));
    setShowAnalysis(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    sound.playPop();
    setActiveSteps(prev => {
      const arr = [...prev];
      const temp = arr[index - 1];
      arr[index - 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === activeSteps.length - 1) return;
    sound.playPop();
    setActiveSteps(prev => {
      const arr = [...prev];
      const temp = arr[index + 1];
      arr[index + 1] = arr[index];
      arr[index] = temp;
      return arr;
    });
  };

  const handleRun = () => {
    if (activeSteps.length === 0) return;
    sound.playPop();
    setIsRunning(true);
    setActiveStepIdx(0);
    setShowAnalysis(false);

    let idx = 0;
    const interval = setInterval(() => {
      sound.playStep(idx);
      setActiveStepIdx(idx);
      idx += 1;

      if (idx >= activeSteps.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setShowAnalysis(true);
          sound.playSuccess();
          try {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch {
            // ignore
          }
        }, 500);
      }
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-[32px] p-6 border-3 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEAA7] text-[#D35400] text-xs font-black border border-[#F1C40F]">
            <Sparkles className="w-3.5 h-3.5 text-[#FD9644]" />
            <span>Serbest Algoritma Atölyesi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2D3436] tracking-tight">
            Kendi Algoritmanı Tasarla ve Çalıştır!
          </h2>
          <p className="text-xs sm:text-sm text-[#636E72] font-semibold">
            İster robotuna dans ettir, ister sabah rutinini yaz, ister lezzetli bir yemek algoritması kurgula!
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={algoTitle}
            onChange={(e) => setAlgoTitle(e.target.value)}
            className="w-full md:w-56 px-4 py-2.5 rounded-2xl border-2 border-[#DFE6E9] bg-[#FFF9F0] text-xs sm:text-sm font-black text-[#2D3436] focus:outline-[#FF7675]"
            placeholder="Algoritma İsmi..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Active Workspace */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-[32px] p-5 sm:p-6 border-3 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] space-y-4 min-h-[420px] flex flex-col justify-between">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#A55EEA] text-white flex items-center justify-center font-black text-base shadow-[0_2px_0_0_#8854d0]">
                    📜
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-[#2D3436]">
                      {algoTitle}
                    </h3>
                    <p className="text-[11px] text-[#636E72] font-semibold">
                      {activeSteps.length} Komut Adımı Hazır
                    </p>
                  </div>
                </div>

                {activeSteps.length > 0 && (
                  <button
                    onClick={() => {
                      sound.playPop();
                      setActiveSteps([]);
                      setShowAnalysis(false);
                    }}
                    className="text-xs font-black text-[#FF7675] hover:bg-[#FF7675]/10 px-3 py-1.5 rounded-xl transition cursor-pointer"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Steps */}
              <div className="space-y-2.5">
                {activeSteps.length === 0 ? (
                  <div className="h-44 border-3 border-dashed border-[#DFE6E9] rounded-[24px] flex flex-col items-center justify-center p-4 text-center bg-[#FFF9F0]">
                    <span className="text-3xl mb-1 animate-bounce">✨</span>
                    <p className="text-sm font-black text-[#2D3436]">Henüz komut eklemedin</p>
                    <p className="text-xs text-[#636E72] font-semibold max-w-xs mt-0.5">
                      Sağdaki komut kütüphanesinden seç veya aşağıdan kendi özel adımını yaz!
                    </p>
                  </div>
                ) : (
                  activeSteps.map((step, idx) => {
                    const isExecuting = isRunning && activeStepIdx === idx;
                    return (
                      <div
                        key={step.id}
                        className={`p-3 rounded-2xl border-3 flex items-center justify-between gap-3 transition-all ${
                          isExecuting
                            ? 'bg-[#FFEAA7] border-[#FD9644] shadow-[0_3px_0_0_#fa8231] scale-102 ring-2 ring-[#FD9644]'
                            : 'bg-white border-[#DFE6E9] hover:border-[#45AAF2] shadow-[0_2px_0_0_#DFE6E9]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                            isExecuting ? 'bg-[#FD9644] text-white animate-pulse' : 'bg-[#FF7675] text-white shadow-[0_2px_0_0_#D63031]'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className="text-xl shrink-0">{step.emoji}</span>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-black text-[#2D3436] truncate">
                              {step.title}
                            </div>
                            <div className="text-[10px] text-[#636E72] font-semibold truncate">
                              Kategori: {step.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            disabled={idx === 0 || isRunning}
                            onClick={() => handleMoveUp(idx)}
                            className="p-1.5 rounded-xl bg-[#F1F2F6] hover:bg-[#DFE6E9] disabled:opacity-30 text-[#2D3436] font-bold transition cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === activeSteps.length - 1 || isRunning}
                            onClick={() => handleMoveDown(idx)}
                            className="p-1.5 rounded-xl bg-[#F1F2F6] hover:bg-[#DFE6E9] disabled:opacity-30 text-[#2D3436] font-bold transition cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={isRunning}
                            onClick={() => handleRemove(idx)}
                            className="p-1.5 rounded-xl bg-[#FF7675]/10 hover:bg-[#FF7675]/20 text-[#FF7675] transition cursor-pointer"
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

            {/* Run Button */}
            <div className="pt-3 border-t-2 border-[#DFE6E9]">
              <button
                disabled={isRunning || activeSteps.length === 0}
                onClick={handleRun}
                className={`w-full py-3.5 rounded-2xl font-black text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  isRunning
                    ? 'bg-[#55E6C1]/60 text-white cursor-not-allowed'
                    : activeSteps.length === 0
                    ? 'bg-[#DFE6E9] text-[#636E72] cursor-not-allowed shadow-none'
                    : 'bg-[#55E6C1] hover:bg-[#26de81] text-white shadow-[0_4px_0_0_#26de81] hover:translate-y-[2px]'
                }`}
              >
                <Play className={`w-5 h-5 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
                <span>{isRunning ? 'Algoritma Yürütülüyor...' : 'Özel Algoritmayı Çalıştır & Canlandır'}</span>
              </button>
            </div>
          </div>

          {/* Analysis Card of Custom Algorithm */}
          {showAnalysis && (
            <div className="bg-white rounded-[28px] p-5 border-3 border-[#55E6C1] shadow-[0_3px_0_0_#26de81] space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-[#10ac84] font-black text-sm">
                <CheckCircle2 className="w-5 h-5 text-[#55E6C1]" />
                <span>Özel Algoritma Başarıyla Yürütüldü!</span>
              </div>
              <p className="text-xs text-[#636E72] leading-relaxed font-semibold">
                Tebrikler! <strong className="text-[#2D3436]">&quot;{algoTitle}&quot;</strong> algoritmanı toplam {activeSteps.length} adımda sırayla çalıştırdın. Kodlama kurallarına göre adımlar en baştan sonuna kadar kesintisiz icra edildi.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-3 rounded-2xl bg-[#FFF9F0] border-2 border-[#DFE6E9] text-xs font-bold text-[#2D3436]">
                  <strong>İcra Süresi:</strong> ~{(activeSteps.length * 0.7).toFixed(1)} saniye
                </div>
                <div className="p-3 rounded-2xl bg-[#FFF9F0] border-2 border-[#DFE6E9] text-xs font-bold text-[#2D3436]">
                  <strong>Mantık Türü:</strong> Ardışık Sıralama (Sequence)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Block Library & Create Custom Step */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Create Custom Step Form */}
          <div className="bg-white rounded-[32px] p-5 border-3 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] space-y-3.5">
            <h4 className="text-xs font-black text-[#2D3436] uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#45AAF2]" />
              <span>Yeni Kendi Komutunu Yaz:</span>
            </h4>

            <form onSubmit={handleAddNewCustomStep} className="space-y-3">
              <div className="flex gap-2">
                <select
                  value={newStepEmoji}
                  onChange={(e) => setNewStepEmoji(e.target.value)}
                  className="p-2.5 rounded-2xl border-2 border-[#DFE6E9] text-lg bg-[#FFF9F0] focus:outline-[#FF7675] cursor-pointer"
                >
                  <option value="⚡">⚡</option>
                  <option value="🚀">🚀</option>
                  <option value="🌟">🌟</option>
                  <option value="🎯">🎯</option>
                  <option value="🤖">🤖</option>
                  <option value="🐱">🐱</option>
                  <option value="🎨">🎨</option>
                  <option value="🍎">🍎</option>
                  <option value="📚">📚</option>
                </select>

                <input
                  type="text"
                  value={newStepText}
                  onChange={(e) => setNewStepText(e.target.value)}
                  placeholder="Örn: 2 Kere Zıpla, Boya..."
                  className="flex-1 px-3.5 py-2 rounded-2xl border-2 border-[#DFE6E9] bg-[#FFF9F0] text-xs sm:text-sm font-bold text-[#2D3436] focus:outline-[#FF7675]"
                />
              </div>

              <button
                type="submit"
                disabled={!newStepText.trim()}
                className="w-full py-2.5 bg-[#45AAF2] hover:bg-[#2d98da] disabled:opacity-50 text-white font-black text-xs rounded-2xl shadow-[0_3px_0_0_#2d98da] transition flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[1px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Çalışma Alanına Ekle</span>
              </button>
            </form>
          </div>

          {/* Preset Blocks Bank */}
          <div className="bg-white rounded-[32px] p-5 border-3 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] space-y-3">
            <span className="text-xs font-black text-[#2D3436] uppercase tracking-wider block">
              Hazır Komut Kartları:
            </span>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {SAMPLE_CUSTOM_BLOCKS.map((block) => (
                <button
                  key={block.id}
                  onClick={() => handleAddBlock(block)}
                  className="w-full p-3 rounded-2xl bg-[#FFF9F0] border-2 border-[#DFE6E9] hover:border-[#FF7675] hover:shadow-[0_2px_0_0_#D63031] text-left transition flex items-center justify-between gap-2 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl shrink-0">{block.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-black text-[#2D3436] truncate group-hover:text-[#FF7675]">
                        {block.title}
                      </div>
                      <div className="text-[10px] text-[#636E72] font-semibold">
                        {block.category}
                      </div>
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-xl bg-white border border-[#DFE6E9] text-[#FF7675] flex items-center justify-center font-black text-sm shrink-0">
                    +
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
