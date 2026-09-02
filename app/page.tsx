'use client';

import React, { useState, useEffect } from 'react';
import { LEVELS, INITIAL_BADGES, generateDynamicLevel } from '../lib/data/levels';
import { Level, CategoryType, UserStats } from '../lib/types';
import { Header } from '../components/Header';
import { LevelSelector } from '../components/LevelSelector';
import { AlgorithmBoard } from '../components/AlgorithmBoard';
import { ConceptCards } from '../components/ConceptCards';
import { FreeSandbox } from '../components/FreeSandbox';
import { SummaryCertificateModal } from '../components/SummaryCertificateModal';
import { sound } from '../lib/sound';

export default function HomePage() {
  // All levels list (starts with static levels, dynamically expandable when student plays more!)
  const [levelsList, setLevelsList] = useState<Level[]>(LEVELS);
  const [currentLevelId, setCurrentLevelId] = useState<string>(LEVELS[0].id);

  // Active view tab: 'play' | 'learn' | 'sandbox'
  const [activeTab, setActiveTab] = useState<'play' | 'learn' | 'sandbox'>('play');

  // Filters
  const [selectedGrade, setSelectedGrade] = useState<'all' | '1-2' | '3-4'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');

  // Sound enabled
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Summary & Certificate Modal
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // User Stats & Progress
  const [userStats, setUserStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('kodlama_macerasi_stats');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch {
        // ignore
      }
    }
    return {
      solvedLevelIds: [],
      totalStars: 0,
      streak: 0,
      totalAttempts: 0,
      firstTimeCorrect: 0,
      badges: INITIAL_BADGES,
      currentGrade: 'all',
      currentCategory: 'all',
    };
  });

  // Save progress to localStorage whenever userStats change
  useEffect(() => {
    try {
      localStorage.setItem('kodlama_macerasi_stats', JSON.stringify(userStats));
    } catch {
      // ignore
    }
  }, [userStats]);

  // Sound toggle handler
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
  };

  // Called when a level is correctly solved
  const handleLevelSolved = (levelId: string, isFirstTime: boolean) => {
    setUserStats((prev) => {
      const isAlreadySolved = prev.solvedLevelIds.includes(levelId);
      const nextSolved = isAlreadySolved ? prev.solvedLevelIds : [...prev.solvedLevelIds, levelId];
      const nextStars = isFirstTime ? prev.totalStars + 3 : prev.totalStars + 1;
      const nextStreak = prev.streak + 1;
      const nextFirstTime = isFirstTime ? prev.firstTimeCorrect + 1 : prev.firstTimeCorrect;

      // Check badge unlocks
      const nextBadges = prev.badges.map((b) => {
        let unlock = b.isUnlocked;
        if (b.id === 'first_step' && nextSolved.length >= 1) unlock = true;
        if (b.id === 'sequence_champ' && nextSolved.length >= 3) unlock = true;
        if (b.id === 'loop_master' && levelId === 'level_5') unlock = true;
        if (b.id === 'condition_hero' && (levelId === 'level_6' || levelId === 'level_9')) unlock = true;
        if (b.id === 'robot_navigator' && (levelId === 'level_4' || levelId === 'level_10')) unlock = true;
        if (b.id === 'bug_hunter' && levelId === 'level_8') unlock = true;
        if (b.id === 'super_coder' && nextSolved.length >= 10) unlock = true;
        return { ...b, isUnlocked: unlock };
      });

      return {
        ...prev,
        solvedLevelIds: nextSolved,
        totalStars: nextStars,
        streak: nextStreak,
        firstTimeCorrect: nextFirstTime,
        badges: nextBadges,
      };
    });
  };

  // Navigate to Next Level automatically or loop
  const handleNextLevel = () => {
    const currentIdx = levelsList.findIndex((lvl) => lvl.id === currentLevelId);
    if (currentIdx !== -1 && currentIdx < levelsList.length - 1) {
      setCurrentLevelId(levelsList[currentIdx + 1].id);
    } else {
      // Generate a dynamic endless level so student can keep playing until they say 'Yeter'!
      const newDynamicLevel = generateDynamicLevel(levelsList.length + 1);
      setLevelsList((prev) => [...prev, newDynamicLevel]);
      setCurrentLevelId(newDynamicLevel.id);
    }
  };

  // Generate Endless Level on demand
  const handleGenerateEndlessLevel = () => {
    const newDynamicLevel = generateDynamicLevel(levelsList.length + 1);
    setLevelsList((prev) => [...prev, newDynamicLevel]);
    setCurrentLevelId(newDynamicLevel.id);
    setActiveTab('play');
  };

  // Reset all progress
  const handleResetProgress = () => {
    setUserStats({
      solvedLevelIds: [],
      totalStars: 0,
      streak: 0,
      totalAttempts: 0,
      firstTimeCorrect: 0,
      badges: INITIAL_BADGES,
      currentGrade: 'all',
      currentCategory: 'all',
    });
    try {
      localStorage.removeItem('kodlama_macerasi_stats');
    } catch {
      // ignore
    }
    setShowSummaryModal(false);
  };

  // Find currently active level
  const currentLevel = levelsList.find((lvl) => lvl.id === currentLevelId) || levelsList[0];

  return (
    <div className="min-h-screen bg-[#FFF9F0] font-sans antialiased text-[#2D3436] flex flex-col selection:bg-[#FF7675] selection:text-white">
      {/* Top Main Navigation Header */}
      <Header
        totalStars={userStats.totalStars}
        streak={userStats.streak}
        solvedCount={userStats.solvedLevelIds.length}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenSummary={() => setShowSummaryModal(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'play' && (
          <div className="space-y-4">
            {/* Level Selector & Category Pills */}
            <LevelSelector
              levels={levelsList}
              currentLevelId={currentLevelId}
              onSelectLevel={(id) => {
                setCurrentLevelId(id);
              }}
              selectedGrade={selectedGrade}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              userStats={userStats}
              onGenerateEndlessLevel={handleGenerateEndlessLevel}
            />

            {/* Active Algorithm Workspace Board */}
            <AlgorithmBoard
              key={currentLevel.id}
              level={currentLevel}
              userStats={userStats}
              onLevelSolved={handleLevelSolved}
              onNextLevel={handleNextLevel}
              onOpenSummary={() => setShowSummaryModal(true)}
              onOpenConcepts={() => setActiveTab('learn')}
            />
          </div>
        )}

        {activeTab === 'learn' && (
          <ConceptCards
            onSelectCategoryTask={(categoryKey) => {
              setSelectedCategory(categoryKey as CategoryType);
              setActiveTab('play');
              // find first level with this category
              const targetLvl = levelsList.find((lvl) => lvl.category === categoryKey);
              if (targetLvl) {
                setCurrentLevelId(targetLvl.id);
              }
            }}
          />
        )}

        {activeTab === 'sandbox' && <FreeSandbox />}
      </main>

      {/* Persistent Bottom Encouragement Bar */}
      <footer className="bg-white border-t-4 border-[#DFE6E9] py-3.5 px-4 text-center text-xs text-[#636E72] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-medium">
          <div className="flex items-center gap-2 text-[#2D3436] font-extrabold">
            <span className="text-lg">🚀</span>
            <span>Algoritma Akademisi • İlkokul Kodlama & Düşünme Platformu</span>
          </div>

          <div className="flex items-center gap-4 text-[#636E72]">
            <span>Çözülen Görevler: <strong className="text-[#FF7675] font-black">{userStats.solvedLevelIds.length}</strong> / {levelsList.length}</span>
            <button
              id="btn-footer-summary"
              onClick={() => {
                sound.playStar();
                setShowSummaryModal(true);
              }}
              className="font-black text-[#FD9644] hover:text-[#fa8231] underline cursor-pointer"
            >
              Karnemi Göster &quot;Yeter&quot; 🎓
            </button>
          </div>
        </div>
      </footer>

      {/* Summary / Report Card & Certificate Modal ("Öğrenci Yeter Diyene Kadar Devam Et") */}
      <SummaryCertificateModal
        isOpen={showSummaryModal}
        onClose={() => setShowSummaryModal(false)}
        userStats={userStats}
        totalAvailableLevels={levelsList.length}
        onContinuePlaying={() => {
          setShowSummaryModal(false);
          setActiveTab('play');
        }}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
