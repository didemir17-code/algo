'use client';

import React, { useState } from 'react';
import { X, Sparkles, User, Lock, Mail, GraduationCap, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { sound } from '@/lib/sound';

const AVATARS = [
  { emoji: '🤖', name: 'Robot Robi' },
  { emoji: '🚀', name: 'Roketçi' },
  { emoji: '🐱', name: 'Minik Kedi' },
  { emoji: '🦁', name: 'Cesur Aslan' },
  { emoji: '🦄', name: 'Sihirli Tekboynuz' },
  { emoji: '🐼', name: 'Sevimli Panda' },
  { emoji: '🦊', name: 'Zeki Tilki' },
  { emoji: '🐬', name: 'Neşeli Yunus' },
];

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalTab, closeAuthModal, openAuthModal, login, register } = useAuth();

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'1-2' | '3-4'>('1-2');
  const [selectedAvatar, setSelectedAvatar] = useState('🤖');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const isRegister = authModalTab === 'register';

  const resetForm = () => {
    setUsername('');
    setName('');
    setEmail('');
    setPassword('');
    setErrorMessage(null);
  };

  const handleTabSwitch = (tab: 'login' | 'register') => {
    sound.playPop();
    setErrorMessage(null);
    openAuthModal(tab);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    if (isRegister) {
      if (!name.trim()) {
        setErrorMessage('Lütfen adını gir!');
        setIsLoading(false);
        return;
      }
      if (!username.trim() || username.length < 3) {
        setErrorMessage('Kullanıcı adı en az 3 harf olmalı!');
        setIsLoading(false);
        return;
      }
      if (!password || password.length < 4) {
        setErrorMessage('Şifre en az 4 karakter olmalı!');
        setIsLoading(false);
        return;
      }

      const res = await register({
        username,
        name,
        password,
        grade: selectedGrade,
        avatar: selectedAvatar,
        email: email.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Kayıt olurken bir sorun çıktı.');
      } else {
        resetForm();
      }
    } else {
      if (!username.trim() || !password) {
        setErrorMessage('Lütfen kullanıcı adını ve şifreni gir!');
        setIsLoading(false);
        return;
      }

      const res = await login(username, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Kullanıcı adı veya şifre yanlış.');
      } else {
        resetForm();
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] border-4 border-[#DFE6E9] shadow-[0_12px_0_0_#B2BEC3] w-full max-w-md overflow-hidden flex flex-col relative transform animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={() => {
            sound.playPop();
            closeAuthModal();
          }}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-2xl bg-[#F1F2F6] hover:bg-[#DFE6E9] text-[#636E72] hover:text-[#2D3436] flex items-center justify-center transition-all cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Mascot Banner */}
        <div className="bg-[#FF7675] p-6 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto bg-white rounded-3xl flex items-center justify-center text-3xl shadow-[0_4px_0_0_#D63031] mb-2 transform hover:rotate-6 transition-transform">
            {isRegister ? selectedAvatar : '🚀'}
          </div>
          <h3 className="text-xl font-black tracking-tight">
            {isRegister ? 'Algoritma Kulübüne Katıl! 🎉' : 'Tekrar Hoş Geldin! 👋'}
          </h3>
          <p className="text-xs text-white/90 font-bold mt-1">
            {isRegister
              ? 'Yıldızlarını ve rozetlerini buluta kaydet!'
              : 'Kaldığın yerden kodlama macerasına devam et!'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b-2 border-[#DFE6E9] bg-[#FFF9F0]">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-3 text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !isRegister
                ? 'bg-white text-[#FF7675] border-b-4 border-[#FF7675]'
                : 'text-[#636E72] hover:text-[#2D3436]'
            }`}
          >
            <span>Giriş Yap</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 py-3 text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isRegister
                ? 'bg-white text-[#FF7675] border-b-4 border-[#FF7675]'
                : 'text-[#636E72] hover:text-[#2D3436]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FD9644]" />
            <span>Kayıt Ol</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-[#FF7675]/15 border-2 border-[#FF7675] text-[#D63031] rounded-2xl text-xs font-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isRegister && (
            <>
              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-black text-[#2D3436] mb-1.5">
                  Sevimli Karakterini Seç:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.emoji}
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        setSelectedAvatar(av.emoji);
                      }}
                      className={`p-2 rounded-2xl text-2xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        selectedAvatar === av.emoji
                          ? 'border-[#45AAF2] bg-[#45AAF2]/15 scale-105 shadow-[0_2px_0_0_#45AAF2]'
                          : 'border-[#DFE6E9] hover:bg-[#FFF9F0]'
                      }`}
                      title={av.name}
                    >
                      <span>{av.emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-black text-[#2D3436] mb-1">
                  Adın veya Takma Adın:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#636E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Ayşe veya Ali"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F0] border-2 border-[#DFE6E9] focus:border-[#45AAF2] focus:outline-none rounded-2xl text-xs sm:text-sm font-bold text-[#2D3436] transition-colors"
                  />
                </div>
              </div>

              {/* Grade Selection */}
              <div>
                <label className="block text-xs font-black text-[#2D3436] mb-1">
                  Sınıf Seviyen:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedGrade('1-2');
                    }}
                    className={`py-2 px-3 rounded-2xl font-black text-xs border-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedGrade === '1-2'
                        ? 'border-[#55E6C1] bg-[#55E6C1]/15 text-[#10ac84] shadow-[0_2px_0_0_#55E6C1]'
                        : 'border-[#DFE6E9] text-[#636E72] hover:bg-[#FFF9F0]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>1-2. Sınıf</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setSelectedGrade('3-4');
                    }}
                    className={`py-2 px-3 rounded-2xl font-black text-xs border-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedGrade === '3-4'
                        ? 'border-[#55E6C1] bg-[#55E6C1]/15 text-[#10ac84] shadow-[0_2px_0_0_#55E6C1]'
                        : 'border-[#DFE6E9] text-[#636E72] hover:bg-[#FFF9F0]'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>3-4. Sınıf</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Username */}
          <div>
            <label className="block text-xs font-black text-[#2D3436] mb-1">
              Kullanıcı Adı:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#636E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Örn: robicoder1"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F0] border-2 border-[#DFE6E9] focus:border-[#45AAF2] focus:outline-none rounded-2xl text-xs sm:text-sm font-bold text-[#2D3436] transition-colors"
              />
            </div>
          </div>

          {/* Optional Email (Register only) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-black text-[#2D3436] mb-1">
                E-posta (İsteğe Bağlı):
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#636E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="veli@ornek.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F0] border-2 border-[#DFE6E9] focus:border-[#45AAF2] focus:outline-none rounded-2xl text-xs sm:text-sm font-bold text-[#2D3436] transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-black text-[#2D3436] mb-1">
              Şifre:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#636E72] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi yazın"
                className="w-full pl-10 pr-10 py-2.5 bg-[#FFF9F0] border-2 border-[#DFE6E9] focus:border-[#45AAF2] focus:outline-none rounded-2xl text-xs sm:text-sm font-bold text-[#2D3436] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#636E72] hover:text-[#2D3436] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-auth-submit"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-[#55E6C1] hover:bg-[#26de81] text-white font-black text-sm shadow-[0_4px_0_0_#26de81] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isRegister ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Hemen Kayıt Ol 🚀</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Giriş Yap 🌟</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
