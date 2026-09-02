'use client';

import React, { useState } from 'react';
import { Sparkles, Star, Flame, Volume2, VolumeX, Award, BookOpen, Layers, Bot, User, LogOut, CloudCheck, ChevronDown } from 'lucide-react';
import { sound } from '../lib/sound';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  totalStars: number;
  streak: number;
  solvedCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenSummary: () => void;
  activeTab: 'learn' | 'play' | 'sandbox' | 'chat';
  setActiveTab: (tab: 'learn' | 'play' | 'sandbox' | 'chat') => void;
  selectedGrade: 'all' | '1-2' | '3-4';
  setSelectedGrade: (grade: 'all' | '1-2' | '3-4') => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalStars,
  streak,
  solvedCount,
  soundEnabled,
  onToggleSound,
  onOpenSummary,
  activeTab,
  setActiveTab,
  selectedGrade,
  setSelectedGrade,
}) => {
  const { user, openAuthModal, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-[#FF7675] sticky top-0 z-40 px-3 sm:px-8 py-3.5 transition-all shadow-[0_4px_0_0_#D63031]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Mascot Title */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-2xl flex items-center justify-center shadow-inner shrink-0 transform hover:rotate-6 transition-transform">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Algoritma Akademisi
                </h1>
                <span className="hidden sm:inline-flex px-2.5 py-0.5 text-xs font-black bg-white/20 text-white rounded-full border border-white/40">
                  İlkokul 1-4
                </span>
              </div>
              <p className="text-xs text-white/90 font-semibold hidden sm:block">
                Eğlenceli Kodlama, Sıralama ve Karar Atölyesi 🧩
              </p>
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Auth Button for Mobile */}
            {user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center text-lg cursor-pointer"
                title={user.name}
              >
                <span>{user.avatar || '🤖'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  sound.playPop();
                  openAuthModal('login');
                }}
                className="px-2.5 py-1.5 bg-white text-[#FF7675] font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Giriş
              </button>
            )}

            <button
              id="btn-sound-toggle-mobile"
              onClick={() => {
                sound.playPop();
                onToggleSound();
              }}
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition border border-white/30"
              title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white/60" />}
            </button>
            <button
              id="btn-summary-mobile"
              onClick={() => {
                sound.playStar();
                onOpenSummary();
              }}
              className="px-3 py-1.5 bg-[#55E6C1] hover:bg-[#26de81] text-white font-black text-xs rounded-xl shadow-[0_2px_0_0_#26de81] flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Karnem ({solvedCount})</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 p-1 bg-black/15 backdrop-blur-sm rounded-2xl border border-white/20">
          <button
            id="tab-play"
            onClick={() => {
              sound.playPop();
              setActiveTab('play');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'play'
                ? 'bg-white text-[#FF7675] shadow-[0_2px_0_0_#D63031] scale-102'
                : 'text-white hover:bg-white/15'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Görevler & Oyun</span>
          </button>

          <button
            id="tab-learn"
            onClick={() => {
              sound.playPop();
              setActiveTab('learn');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'learn'
                ? 'bg-white text-[#FF7675] shadow-[0_2px_0_0_#D63031] scale-102'
                : 'text-white hover:bg-white/15'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Kavramları Keşfet</span>
          </button>

          <button
            id="tab-sandbox"
            onClick={() => {
              sound.playPop();
              setActiveTab('sandbox');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-white text-[#FF7675] shadow-[0_2px_0_0_#D63031] scale-102'
                : 'text-white hover:bg-white/15'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Kendi Kodunu Yaz</span>
          </button>

          <button
            id="tab-chat"
            onClick={() => {
              sound.playPop();
              setActiveTab('chat');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-[#45AAF2] shadow-[0_2px_0_0_#2d98da] scale-102'
                : 'text-white hover:bg-white/15'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Robi ile Sohbet 🤖</span>
          </button>
        </nav>

        {/* Stats, Grade Filter, Auth & Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {/* Grade Selector Pill */}
          <div className="flex items-center bg-black/15 border border-white/20 rounded-xl p-0.5 text-xs font-bold text-white">
            <button
              id="grade-filter-all"
              onClick={() => {
                sound.playPop();
                setSelectedGrade('all');
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                selectedGrade === 'all' ? 'bg-white text-[#FF7675] font-black shadow-xs' : 'hover:bg-white/15'
              }`}
            >
              Tüm Sınıflar
            </button>
            <button
              id="grade-filter-1-2"
              onClick={() => {
                sound.playPop();
                setSelectedGrade('1-2');
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                selectedGrade === '1-2' ? 'bg-white text-[#FF7675] font-black shadow-xs' : 'hover:bg-white/15'
              }`}
            >
              1-2. Sınıf
            </button>
            <button
              id="grade-filter-3-4"
              onClick={() => {
                sound.playPop();
                setSelectedGrade('3-4');
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                selectedGrade === '3-4' ? 'bg-white text-[#FF7675] font-black shadow-xs' : 'hover:bg-white/15'
              }`}
            >
              3-4. Sınıf
            </button>
          </div>

          {/* Stars badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 border-2 border-white/40 text-white rounded-full font-black text-sm shadow-xs">
            <Star className="w-4 h-4 fill-[#FFEAA7] text-[#FFEAA7]" />
            <span>{totalStars} Yıldız</span>
          </div>

          {/* Streak badge */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/20 border-2 border-white/40 text-white rounded-full font-black text-sm shadow-xs">
            <Flame className="w-4 h-4 fill-[#FFD200] text-[#FFD200]" />
            <span>{streak} Seri</span>
          </div>

          {/* Sound Toggle */}
          <button
            id="btn-sound-toggle-desktop"
            onClick={() => {
              sound.playPop();
              onToggleSound();
            }}
            className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition border border-white/30 cursor-pointer"
            title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-white" /> : <VolumeX className="w-5 h-5 text-white/60" />}
          </button>

          {/* "Yeter / Dinlen & Karne" Button */}
          <button
            id="btn-summary-desktop"
            onClick={() => {
              sound.playStar();
              onOpenSummary();
            }}
            className="px-4 py-2 bg-[#55E6C1] hover:bg-[#26de81] text-white font-black text-sm rounded-2xl shadow-[0_3px_0_0_#26de81] transition-all transform hover:scale-103 flex items-center gap-1.5 cursor-pointer"
            title="Dersimi bitir, rozetlerimi ve analiz karnemi göster!"
          >
            <Award className="w-4 h-4" />
            <span>Karnem</span>
          </button>

          {/* Auth Button or User Profile Dropdown */}
          {user ? (
            <div className="relative">
              <button
                id="btn-user-profile"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="px-3 py-1.5 bg-white text-[#2D3436] rounded-2xl shadow-[0_3px_0_0_#DFE6E9] hover:bg-[#FFF9F0] transition-all flex items-center gap-2 cursor-pointer border-2 border-white/80"
              >
                <span className="text-xl">{user.avatar || '🤖'}</span>
                <span className="font-black text-xs">{user.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#636E72]" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border-3 border-[#DFE6E9] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2 border-b border-[#DFE6E9]">
                    <div className="text-xs font-black text-[#2D3436] flex items-center gap-1.5">
                      <span>{user.avatar || '🤖'}</span>
                      <span>{user.name}</span>
                    </div>
                    <div className="text-[11px] text-[#636E72] font-semibold">
                      @{user.username} • {user.grade === 'all' ? 'Tüm Sınıflar' : `${user.grade}. Sınıf`}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] font-black text-[#10ac84] bg-[#55E6C1]/20 px-2 py-0.5 rounded-lg">
                      <CloudCheck className="w-3.5 h-3.5" />
                      <span>İlerleme Bulutta Kayıtlı</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full mt-1 px-3 py-2 text-xs font-black text-[#FF7675] hover:bg-[#FF7675]/10 rounded-xl flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              id="btn-header-login"
              onClick={() => {
                sound.playPop();
                openAuthModal('login');
              }}
              className="px-4 py-2 bg-white hover:bg-[#FFF9F0] text-[#FF7675] font-black text-sm rounded-2xl shadow-[0_3px_0_0_#e84118] transition-all transform hover:scale-103 flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Giriş Yap</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
