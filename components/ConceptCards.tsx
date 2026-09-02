'use client';

import React, { useState } from 'react';
import { 
  ListOrdered, 
  Repeat, 
  GitFork, 
  Bug, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  RotateCcw,
  CloudRain,
  Sun,
  Umbrella,
  Glasses
} from 'lucide-react';
import { sound } from '../lib/sound';

export const ConceptCards: React.FC<{ onSelectCategoryTask: (cat: string) => void }> = ({ onSelectCategoryTask }) => {
  // Mini interactive state for Loop demo
  const [loopCount, setLoopCount] = useState(3);
  const [currentLoopStep, setCurrentLoopStep] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

  // Mini interactive state for Condition demo
  const [isRaining, setIsRaining] = useState(true);

  // Mini interactive state for Sequence demo
  const [sequenceStep, setSequenceStep] = useState(0);

  // Run the loop animation in the concept card
  const runLoopDemo = () => {
    sound.playPop();
    setIsLooping(true);
    setCurrentLoopStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step <= loopCount) {
        sound.playStep(step);
        setCurrentLoopStep(step);
      } else {
        clearInterval(interval);
        setIsLooping(false);
        sound.playSuccess();
      }
    }, 600);
  };

  return (
    <section className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFEAA7] text-[#D35400] text-xs font-black border-2 border-[#F1C40F] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#FD9644]" />
          <span>Algoritmanın 4 Süper Gücü</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[#2D3436] tracking-tight">
          Algoritma Nedir ve Nasıl Düşünürüz?
        </h2>
        <p className="text-sm sm:text-base text-[#636E72] font-medium">
          Algoritma; bir işi veya oyunu başarıyla tamamlamak için takip ettiğimiz <strong className="text-[#FF7675] font-black">adım adım yol haritasıdır</strong>. Aşağıdaki kartlara dokunarak keşfet!
        </p>
      </div>

      {/* 4 Super Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Sıralama (Sequence) */}
        <div className="bg-white rounded-[32px] p-6 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] hover:border-[#FD9644] hover:shadow-[0_4px_0_0_#fa8231] transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#FFEAA7] text-[#D35400] border-2 border-[#F1C40F] flex items-center justify-center font-bold shadow-xs">
                <ListOrdered className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FFEAA7] text-[#D35400] border-2 border-[#F1C40F]">
                1. Süper Güç
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#2D3436]">Sıralama (Adım Adım Mantık)</h3>
              <p className="text-sm text-[#636E72] mt-1 font-medium">
                Bir işin doğru sonuçlanması için adımların <strong className="text-[#FD9644] font-black">doğru sırada</strong> yapılması gerekir. Ayakkabıyı giymeden çorap giyemeyiz!
              </p>
            </div>

            {/* Interactive Sequence Mini Demo */}
            <div className="bg-[#FFF9F0] rounded-2xl p-4 border-2 border-[#DFE6E9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2D3436]">Sabah Rutini Adım Takibi:</span>
                <span className="text-xs font-black text-[#D35400] bg-[#FFEAA7] px-2.5 py-0.5 rounded-lg border border-[#F1C40F]">
                  Adım {sequenceStep + 1} / 3
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { title: '1. Çalar saat çaldığında uyan ⏰', desc: 'Güne başlama sinyali' },
                  { title: '2. Yüzünü yıka ve dişlerini fırçala 🪥', desc: 'Kişisel temizlik' },
                  { title: '3. Okul çantanı alıp kapıdan çık 🎒', desc: 'Hazırlık tamam!' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border-2 text-xs font-black transition-all flex items-center justify-between ${
                      sequenceStep === idx
                        ? 'bg-[#FFEAA7] text-[#2D3436] border-[#FD9644] shadow-xs scale-102'
                        : sequenceStep > idx
                        ? 'bg-[#55E6C1]/20 text-[#10ac84] border-[#55E6C1] line-through opacity-80'
                        : 'bg-white text-[#636E72] border-[#DFE6E9]'
                    }`}
                  >
                    <span>{item.title}</span>
                    {sequenceStep > idx && <CheckCircle2 className="w-4 h-4 text-[#10ac84]" />}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  id="btn-seq-next"
                  onClick={() => {
                    sound.playPop();
                    setSequenceStep((prev) => (prev + 1) % 3);
                  }}
                  className="w-full py-2.5 bg-[#FD9644] hover:bg-[#fa8231] text-white font-black text-xs rounded-xl shadow-[0_3px_0_0_#fa8231] transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Sonraki Adıma Geç</span>
                </button>
              </div>
            </div>
          </div>

          <button
            id="btn-goto-seq"
            onClick={() => {
              sound.playPop();
              onSelectCategoryTask('sirali');
            }}
            className="mt-5 w-full py-3 rounded-2xl bg-[#FFEAA7] hover:bg-[#FDCB6E] text-[#D35400] font-black text-xs sm:text-sm border-2 border-[#F1C40F] shadow-[0_3px_0_0_#F1C40F] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Sıralama Görevlerini Oyna</span>
            <span>👉</span>
          </button>
        </div>

        {/* Card 2: Döngüler (Loops / Tekrar) */}
        <div className="bg-white rounded-[32px] p-6 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] hover:border-[#A55EEA] hover:shadow-[0_4px_0_0_#8854d0] transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#A55EEA]/15 text-[#8854d0] border-2 border-[#A55EEA]/30 flex items-center justify-center font-bold shadow-xs">
                <Repeat className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#A55EEA]/15 text-[#8854d0] border-2 border-[#A55EEA]/30">
                2. Süper Güç
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#2D3436]">Döngü (Yorulmadan Tekrar Et!)</h3>
              <p className="text-sm text-[#636E72] mt-1 font-medium">
                Aynı işi 10 kez arka arkaya yazmak yerine bilgisayara <strong className="text-[#A55EEA] font-black">&quot;10 kere tekrarla&quot;</strong> deriz. Bu bize süper zaman kazandırır!
              </p>
            </div>

            {/* Interactive Loop Demo */}
            <div className="bg-[#FFF9F0] rounded-2xl p-4 border-2 border-[#DFE6E9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2D3436]">Kaç Kez Zıplasın?</span>
                <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-xl border-2 border-[#DFE6E9]">
                  {[3, 4, 5].map((cnt) => (
                    <button
                      key={cnt}
                      onClick={() => {
                        sound.playPop();
                        setLoopCount(cnt);
                      }}
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-black transition cursor-pointer ${
                        loopCount === cnt ? 'bg-[#A55EEA] text-white shadow-xs' : 'text-[#636E72] hover:bg-[#A55EEA]/15'
                      }`}
                    >
                      {cnt}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumping Star visualizer */}
              <div className="h-18 bg-white rounded-xl border-2 border-[#DFE6E9] flex items-center justify-around px-3 relative overflow-hidden">
                {Array.from({ length: loopCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                      currentLoopStep === i + 1
                        ? 'transform -translate-y-2 scale-125 text-[#FD9644]'
                        : currentLoopStep > i + 1
                        ? 'opacity-80 text-[#A55EEA]'
                        : 'opacity-30 text-[#B2BEC3]'
                    }`}
                  >
                    <span className="text-2xl">⭐</span>
                    <span className="text-[10px] font-black">{i + 1}. Kez</span>
                  </div>
                ))}
              </div>

              <button
                id="btn-run-loop-demo"
                disabled={isLooping}
                onClick={runLoopDemo}
                className={`w-full py-2.5 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isLooping
                    ? 'bg-[#DFE6E9] text-[#B2BEC3] cursor-not-allowed'
                    : 'bg-[#A55EEA] hover:bg-[#8854d0] text-white shadow-[0_3px_0_0_#8854d0]'
                }`}
              >
                <Repeat className={`w-3.5 h-3.5 ${isLooping ? 'animate-spin' : ''}`} />
                <span>{isLooping ? 'Döngü Çalışıyor...' : `Döngüyü Başlat (${loopCount} Kez Zıpla)`}</span>
              </button>
            </div>
          </div>

          <button
            id="btn-goto-loop"
            onClick={() => {
              sound.playPop();
              onSelectCategoryTask('dongu');
            }}
            className="mt-5 w-full py-3 rounded-2xl bg-[#A55EEA]/15 hover:bg-[#A55EEA]/25 text-[#8854d0] font-black text-xs sm:text-sm border-2 border-[#A55EEA]/30 shadow-[0_3px_0_0_#A55EEA]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Döngü Görevlerini Oyna</span>
            <span>👉</span>
          </button>
        </div>

        {/* Card 3: Koşullar (Conditions / Eğer - İse) */}
        <div className="bg-white rounded-[32px] p-6 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] hover:border-[#45AAF2] hover:shadow-[0_4px_0_0_#2d98da] transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#45AAF2]/15 text-[#2d98da] border-2 border-[#45AAF2]/30 flex items-center justify-center font-bold shadow-xs">
                <GitFork className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#45AAF2]/15 text-[#2d98da] border-2 border-[#45AAF2]/30">
                3. Süper Güç
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#2D3436]">Koşul (Eğer... İse... Değilse...)</h3>
              <p className="text-sm text-[#636E72] mt-1 font-medium">
                Farklı durumlarda farklı kararlar veririz. <strong className="text-[#45AAF2] font-black">Eğer yağmur yağıyorsa</strong> şemsiye açarız, güneş varsa gözlük takarız!
              </p>
            </div>

            {/* Interactive Condition Demo */}
            <div className="bg-[#FFF9F0] rounded-2xl p-4 border-2 border-[#DFE6E9] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#2D3436]">Hava Durumunu Değiştir:</span>
                <button
                  id="btn-toggle-weather"
                  onClick={() => {
                    sound.playPop();
                    setIsRaining(!isRaining);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border-2 border-[#45AAF2]/40 text-xs font-black text-[#2d98da] flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isRaining ? <CloudRain className="w-3.5 h-3.5 text-[#45AAF2]" /> : <Sun className="w-3.5 h-3.5 text-[#FD9644]" />}
                  <span>{isRaining ? 'Hava: Yağmurlu 🌧️' : 'Hava: Güneşli ☀️'}</span>
                </button>
              </div>

              {/* Decision Box */}
              <div className="bg-white rounded-xl p-3 border-2 border-[#DFE6E9] space-y-2">
                <div className="text-xs font-black text-[#2D3436] flex items-center gap-1">
                  <span className="text-[#FF7675] font-mono font-black">EĞER:</span>
                  <span>(Hava == {isRaining ? '"Yağmurlu"' : '"Güneşli"'})</span>
                </div>

                <div
                  className={`p-2.5 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    isRaining
                      ? 'bg-sky-50 border-[#45AAF2]/40 text-sky-950'
                      : 'bg-[#FFEAA7]/40 border-[#F1C40F] text-[#D35400]'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white shadow-xs border border-[#DFE6E9]">
                    {isRaining ? (
                      <Umbrella className="w-5 h-5 text-[#45AAF2]" />
                    ) : (
                      <Glasses className="w-5 h-5 text-[#FD9644]" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-black">
                      {isRaining ? 'Karar: Şemsiyeni Al ve Yağmurluk Giy!' : 'Karar: Güneş Gözlüğünü ve Şapkanı Tak!'}
                    </div>
                    <div className="text-[11px] opacity-80 font-medium">
                      {isRaining ? 'Islanmamak için doğru karar verdin!' : 'Gözlerini ışıktan korudun!'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            id="btn-goto-condition"
            onClick={() => {
              sound.playPop();
              onSelectCategoryTask('kosul');
            }}
            className="mt-5 w-full py-3 rounded-2xl bg-[#45AAF2]/15 hover:bg-[#45AAF2]/25 text-[#2d98da] font-black text-xs sm:text-sm border-2 border-[#45AAF2]/30 shadow-[0_3px_0_0_#45AAF2]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Koşul Görevlerini Oyna</span>
            <span>👉</span>
          </button>
        </div>

        {/* Card 4: Hata Ayıklama (Debugging) */}
        <div className="bg-white rounded-[32px] p-6 border-4 border-[#DFE6E9] shadow-[0_4px_0_0_#DFE6E9] hover:border-[#55E6C1] hover:shadow-[0_4px_0_0_#26de81] transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#55E6C1]/20 text-[#10ac84] border-2 border-[#55E6C1] flex items-center justify-center font-bold shadow-xs">
                <Bug className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#55E6C1]/20 text-[#10ac84] border-2 border-[#55E6C1]">
                4. Süper Güç
              </span>
            </div>

            <div>
              <h3 className="text-xl font-black text-[#2D3436]">Hata Ayıklama (Böcek Avcısı 🐛)</h3>
              <p className="text-sm text-[#636E72] mt-1 font-medium">
                Yazılımcılar hata yapınca buna <strong className="text-[#10ac84] font-black">&quot;Bug&quot; (Böcek)</strong> der. Hatayı bulup düzeltmek (Debug) bizi gerçek bir kodlama ustası yapar!
              </p>
            </div>

            {/* Interactive Debugging Tip */}
            <div className="bg-[#FFF9F0] rounded-2xl p-4 border-2 border-[#DFE6E9] space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-[#2D3436]">
                <span>🔍 Bir hatayı bulmak için 3 altın kural:</span>
              </div>

              <div className="space-y-1.5 text-xs text-[#2D3436]">
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#DFE6E9]">
                  <span className="w-5 h-5 rounded-full bg-[#55E6C1] text-white flex items-center justify-center font-black text-[10px]">1</span>
                  <span className="font-semibold">Adımları en baştan yavaşça tek tek oku.</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#DFE6E9]">
                  <span className="w-5 h-5 rounded-full bg-[#55E6C1] text-white flex items-center justify-center font-black text-[10px]">2</span>
                  <span className="font-semibold">Hangi adımın mantıksız olduğunu tespit et.</span>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-[#DFE6E9]">
                  <span className="w-5 h-5 rounded-full bg-[#55E6C1] text-white flex items-center justify-center font-black text-[10px]">3</span>
                  <span className="font-semibold">Adımın yerini değiştir ve tekrar test et!</span>
                </div>
              </div>
            </div>
          </div>

          <button
            id="btn-goto-debug"
            onClick={() => {
              sound.playPop();
              onSelectCategoryTask('hata_ayiklama');
            }}
            className="mt-5 w-full py-3 rounded-2xl bg-[#55E6C1]/20 hover:bg-[#55E6C1]/30 text-[#10ac84] font-black text-xs sm:text-sm border-2 border-[#55E6C1] shadow-[0_3px_0_0_#55E6C1] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Hata Avcısı Görevlerini Oyna</span>
            <span>👉</span>
          </button>
        </div>

      </div>
    </section>
  );
};
