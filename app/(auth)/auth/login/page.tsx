'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({
        phone_number: phoneNumber,
        password: password,
      });

      const isAdminFlag = localStorage.getItem('is_admin') === 'true';
      if (isAdminFlag) {
        router.push('/admin');
      } else {
        router.push('/app');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Kirishda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Parollar mos kelmadi');
      return;
    }

    if (password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo‘lishi kerak');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        phone_number: phoneNumber,
        full_name: fullName.trim(),
        password: password,
      });

      router.push('/app');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Ro‘yxatdan o‘tishda xatolik yuz berdi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {mode === 'login' ? 'Xush kelibsiz!' : 'Hoziroq qo‘shiling!'}
        </h2>
        <p className="mt-3 text-slate-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {mode === 'login'
            ? 'Akkauntingizga kirib, o‘qishni davom ettiring'
            : 'iMed Team — tibbiyotni biz bilan o‘rganing'}
        </p>
      </div>

      <div className="p-1.5 bg-slate-100 rounded-2xl flex relative">
        <div
          className={`absolute inset-y-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${mode === 'register' ? 'translate-x-full' : 'translate-x-0'}`}
        ></div>
        <button
          type="button"
          onClick={() => { setMode('login'); setError(''); }}
          className={`flex-1 py-2.5 text-sm font-black relative z-10 transition-colors ${mode === 'login' ? 'text-primary' : 'text-slate-500'}`}
        >
          Kirish
        </button>
        <button
          type="button"
          onClick={() => { setMode('register'); setError(''); }}
          className={`flex-1 py-2.5 text-sm font-black relative z-10 transition-colors ${mode === 'register' ? 'text-primary' : 'text-slate-500'}`}
        >
          Ro‘yxatdan o‘tish
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3 animate-in fade-in zoom-in-95 duration-200">
          <span className="text-xl">⚠️</span>
          <p className="text-sm font-bold text-primary leading-tight">{error}</p>
        </div>
      )}

      <form className="space-y-5" onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit}>
        <div className="space-y-4">
          <div className="relative group">
            <input
              type="tel"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all group-hover:bg-white"
              placeholder="Telefon raqami"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="relative group animate-in slide-in-from-top-2 duration-300">
              <input
                type="text"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all group-hover:bg-white"
                placeholder="Ism Familiya"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}

          <div className="relative group">
            <input
              type="password"
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all group-hover:bg-white"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {mode === 'register' && (
            <div className="relative group animate-in slide-in-from-top-2 duration-300">
              <input
                type="password"
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-400 placeholder:font-medium focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all group-hover:bg-white"
                placeholder="Parolni tasdiqlang"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black text-lg shadow-xl shadow-slate-900/10 hover:bg-primary hover:shadow-primary/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading
            ? (mode === 'login' ? 'Kirilmoqda...' : 'Ochilyapti...')
            : (mode === 'login' ? 'Kirish' : 'Akkaunt ochish')}
        </button>
      </form>
    </div>
  );
}
