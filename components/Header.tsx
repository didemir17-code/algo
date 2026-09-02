'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Star, 
  Flame, 
  Volume2, 
  VolumeX, 
  Award, 
  BookOpen, 
  Layers, 
  Bot, 
  User, 
  LogOut, 
  CloudCheck, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#FF7675] sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3 transition-all shadow-[0_4px_0_0_#D63031]">
      <div className="max-w-7xl mx-auto flex flex-col gap-2.5">
        {/* Top Row: Logo, Stats, Auth, Sound & Mobile Menu Toggle */}
        <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-white rounded-2xl flex items-center justify-center shadow-inner shrink-0 transform hover:rotate-6 transition-transform">
              <span className="text-xl sm:text-2xl">🚀</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white leading-tight">
                  Algoritma Akademisi
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-black bg-white/20 text-white rounded-full border border-white/40 hidden xs:inline-block">
                  İlkokul 1-4
                </span>
              </div>
              <p className="text-[11px] text-white/90 font-semibold hidden md:block leading-none mt-0.5">
                Eğlenceli Kodlama & Karar Atölyesi 🧩
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Hidden on small screens, shown in nav row or header) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-black/15 backdrop-blur-sm rounded-2xl border border-white/20 shrink-0">
            <button
              id="tab-play"
              onClick={() => {
                sound.playPop();
                setActiveTab('play');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'play'
                  ? 'bg-white text-[#FF7675] shadow-[0_2px_0_0_#D63031]'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Görevler</span>
            </button>

            <button
              id="tab-learn"
              onClick={() => {
                sound.playPop();
                setActiveTab('learn');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'learn'
                  ? 'bg-white text-[#FF7675] shadow-[0_2px_0_0_#D63031]'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Kavramlar</span>
            </button>

            <button
              id="tab-sandbox"
              onClick={() => {
                sound.playPop();
                setActiveTab('sandbox');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sandbox'
                  ? 'bg-white text-[#FF7675] shadow-[0_2px_0_0_#D63031]'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Sandbox</span>
            </button>

            <button
              id="tab-chat"
              onClick={() => {
                sound.playPop();
                setActiveTab('chat');
              }}
              className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-[#45AAF2] shadow-[0_2px_0_0_#2d98da]'
                  : 'text-white hover:bg-white/15'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Robi AI 🤖</span>
            </button>
          </nav>

          {/* Right Action Controls: Stats, Grade Pill, Sound, Karne, Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Sınıf Filtresi (Desktop) */}
            <div className="hidden sm:flex items-center bg-black/15 border border-white/20 rounded-xl p-0.5 text-xs font-bold text-white">
              <button
                id="grade-filter-all"
                onClick={() => {
                  sound.playPop();
                  setSelectedGrade('all');
                }}
                className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-[11px] ${
                  selectedGrade === 'all' ? 'bg-white text-[#FF7675] font-black shadow-xs' : 'hover:bg-white/15'
                }`}
              >
                Tümü
              </button>
              <button
                id="grade-filter-1-2"
                onClick={() => {
                  sound.playPop();
                  setSelectedGrade('1-2');
                }}
                className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-[11px] ${
                  selectedGrade === '1-2' ? 'bg-white text-[#FF7675] font-black shadow-xs' : 'hover:bg-white/15'
                }`}
              >
                1-2
              </button>
              <button
                id="grade-filter-3-4"
                onClick={() => {
                  sound.playPop();
                  setSelectedGrade('3-4');
                }}
                className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-[11px] ${
                  selectedGrade === '3-4' ? 'bg-white text-[#FF7675] font-black shadow-xs' : 'hover:bg-white/15'
                }`}
              >
                3-4
              </button>
            </div>

            {/* Yıldız Rozeti */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/20 border border-white/30 text-white rounded-full font-black text-xs">
              <Star className="w-3.5 h-3.5 fill-[#FFEAA7] text-[#FFEAA7]" />
              <span>{totalStars}</span>
            </div>

            {/* Seri Rozeti */}
            <div className="flex items-center gap-1 px-2.5 py-1 bg-white/20 border border-white/30 text-white rounded-full font-black text-xs hidden xs:flex">
              <Flame className="w-3.5 h-3.5 fill-[#FFD200] text-[#FFD200]" />
              <span>{streak}</span>
            </div>

            {/* Ses Aç/Kapat Butonu */}
            <button
              id="btn-sound-toggle-main"
              onClick={() => {
                sound.playPop();
                onToggleSound();
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition border border-white/30 cursor-pointer"
              title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white/60" />}
            </button>

            {/* Karnem Butonu */}
            <button
              id="btn-summary-main"
              onClick={() => {
                sound.playStar();
                onOpenSummary();
              }}
              className="px-2.5 sm:px-3 py-1.5 bg-[#55E6C1] hover:bg-[#26de81] text-white font-black text-xs rounded-xl shadow-[0_2px_0_0_#26de81] transition-all flex items-center gap-1 cursor-pointer shrink-0"
              title="Karnemi ve İlerlememi Göster"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Karnem</span>
            </button>

            {/* Giriş / Kullanıcı Menüsü */}
            {user ? (
              <div className="relative">
                <button
                  id="btn-user-profile"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="px-2.5 py-1 bg-white text-[#2D3436] rounded-xl shadow-xs hover:bg-[#FFF9F0] transition flex items-center gap-1.5 cursor-pointer border border-white/80"
                >
                  <span className="text-base">{user.avatar || '🤖'}</span>
                  <span className="font-black text-xs hidden md:inline max-w-[80px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#636E72]" />
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
                        <span>Buluta Kayıtlı</span>
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
                className="px-3 py-1.5 bg-white hover:bg-[#FFF9F0] text-[#FF7675] font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <User className="w-3.5 h-3.5" />
                <span>Giriş</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle (Visible on < lg screens) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl bg-white/20 text-white border border-white/30 cursor-pointer"
              title="Menüyü Aç/Kapat"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Nav Strip (Collapsible or always neat below on smaller screens) */}
        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:hidden flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-2 border-t border-white/20 animate-in fade-in`}>
          <nav className="grid grid-cols-4 gap-1 p-1 bg-black/15 backdrop-blur-sm rounded-xl border border-white/20">
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('play');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 px-2 rounded-lg font-black text-xs text-center transition ${
                activeTab === 'play' ? 'bg-white text-[#FF7675]' : 'text-white'
              }`}
            >
              Görevler
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('learn');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 px-2 rounded-lg font-black text-xs text-center transition ${
                activeTab === 'learn' ? 'bg-white text-[#FF7675]' : 'text-white'
              }`}
            >
              Kavramlar
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('sandbox');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 px-2 rounded-lg font-black text-xs text-center transition ${
                activeTab === 'sandbox' ? 'bg-white text-[#FF7675]' : 'text-white'
              }`}
            >
              Sandbox
            </button>
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('chat');
                setMobileMenuOpen(false);
              }}
              className={`py-1.5 px-2 rounded-lg font-black text-xs text-center transition ${
                activeTab === 'chat' ? 'bg-white text-[#45AAF2]' : 'text-white'
              }`}
            >
              Robi AI
            </button>
          </nav>

          {/* Sınıf Seçimi Mobile */}
          <div className="flex sm:hidden items-center justify-center bg-black/15 border border-white/20 rounded-xl p-1 text-xs font-bold text-white gap-2">
            <span className="text-[10px] text-white/80">Sınıf:</span>
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-2.5 py-0.5 rounded-lg text-xs ${selectedGrade === 'all' ? 'bg-white text-[#FF7675] font-black' : ''}`}
            >
              Tümü
            </button>
            <button
              onClick={() => setSelectedGrade('1-2')}
              className={`px-2.5 py-0.5 rounded-lg text-xs ${selectedGrade === '1-2' ? 'bg-white text-[#FF7675] font-black' : ''}`}
            >
              1-2. Sınıf
            </button>
            <button
              onClick={() => setSelectedGrade('3-4')}
              className={`px-2.5 py-0.5 rounded-lg text-xs ${selectedGrade === '3-4' ? 'bg-white text-[#FF7675] font-black' : ''}`}
            >
              3-4. Sınıf
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
