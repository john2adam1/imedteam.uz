'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService, profileService } from '@/services';
import { Mail, Phone, ArrowRight, CheckCircle2, RefreshCw, Send, Layout, User, MessageCircle } from 'lucide-react';

type Step = 'identifier' | 'otp' | 'telegram' | 'register';

function LoginContent() {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('identifier');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccount, setHasAccount] = useState<boolean | null>(null);

  const { otpSend, otpConfirm, checkUser, refreshUser } = useAuth();
  const router = useRouter();
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Handle Hydration & Initial State
  useEffect(() => {
    setMounted(true);
    const savedIdentifier = localStorage.getItem('auth_identifier');
    if (savedIdentifier) setIdentifier(savedIdentifier);

    // Set step from URL on mount
    const stepParam = searchParams.get('step') as Step;
    if (stepParam) setStep(stepParam);
  }, [searchParams]);

  // Auto-focus logic
  useEffect(() => {
    if (mounted && step === 'otp' && otpInputRef.current) {
      otpInputRef.current.focus();
    }
  }, [step, mounted]);

  if (!mounted) return null; // Avoid hydration mismatch by waiting for client mount

  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      setError('Iltimos, email yoki telefon raqamingizni kiriting');
      return;
    }

    setIsLoading(false); // Reset just in case, though true below
    setIsLoading(true);
    localStorage.setItem('auth_identifier', cleanIdentifier);

    try {
      const isPhone = /^\+?[\d\s-]{7,15}$/.test(cleanIdentifier);
      const isEmailLike = cleanIdentifier.includes('@');

      if (isEmailLike) {
        // For Emails: Send OTP immediately, don't call phone-only checkUser
        setHasAccount(null); // Will assume needs registration if backend says so or use existing
        await otpSend(cleanIdentifier);
        setStep('otp');
      } else if (isPhone) {
        // For Phone Numbers: Clean for backend and check if user exists
        const numericPhone = cleanIdentifier.replace(/\D/g, '');
        try {
          const exists = await checkUser({ phone_number: numericPhone });
          setHasAccount(exists);
        } catch (e) {
          console.warn('User check failed for phone, continuing anyway');
        }
        setStep('telegram');
      } else {
        setError('Iltimos, email yoki telefon raqamingizni to\'g\'ri formatda kiriting');
      }
    } catch (err: any) {
      console.error('Identifier submit error:', err);
      setError(err.message || 'Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await otpConfirm(identifier.trim(), otp);

      if (hasAccount === false) {
        setStep('register');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error('OTP confirmation error:', err);
      setError(err.message || 'Kod noto\'g\'ri kiritildi');
      setOtp(''); // Clear OTP on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Call profile service to set the user's name
      await profileService.updateProfile({ name: fullName });
      // Refresh the user in the context to reflect the new name
      await refreshUser();
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Ro\'yxatdan o\'tishda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsLoading(true);
    try {
      await otpSend(identifier.trim());
    } catch (err: any) {
      setError(err.message || 'OTP qayta yuborishda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToTelegram = () => {
    window.open('https://t.me/imedteam_bot', '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-primary/10 text-primary mb-6 animate-float">
          {step === 'identifier' && <User size={40} />}
          {step === 'otp' && <Mail size={40} />}
          {step === 'telegram' && <MessageCircle size={40} />}
          {step === 'register' && <Layout size={40} />}
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
          {step === 'identifier' && 'Xush kelibsiz!'}
          {step === 'otp' && 'Tasdiqlash kodi'}
          {step === 'telegram' && 'Telegram Bot'}
          {step === 'register' && 'Ma\'lumotlar'}
        </h1>
        <p className="text-gray-500 font-medium whitespace-pre-line px-4">
          {step === 'identifier' && 'Kirish uchun email yoki telefon raqamingizni kiriting'}
          {step === 'otp' && `${identifier}\npochtasiga yuborilgan kodni kiriting`}
          {step === 'telegram' && `Kodni @imedteam_bot botidan oling\nva platformaga qayting`}
          {step === 'register' && 'Platformaga xush kelibsiz!\nIsm-familiyangiz qanday?'}
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-3 animate-shake shadow-sm">
          <span className="text-lg">⚠️</span> {error}
        </div>
      )}

      {step === 'identifier' && (
        <form onSubmit={handleIdentifierSubmit} className="space-y-6">
          <div className="relative group">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email yoki Telefon</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-gray-400 group-focus-within:text-primary transition-colors">
                {identifier.includes('@') ? <Mail size={20} /> : <Phone size={20} />}
              </div>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-slate-100 focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-bold text-gray-700 bg-slate-50 focus:bg-white text-lg placeholder:text-gray-300 placeholder:font-medium"
                placeholder="example@mail.com yoki +998..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !identifier.trim()}
            className="group w-full py-5 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            {isLoading ? (
              <RefreshCw className="animate-spin" size={24} />
            ) : (
              <>
                Kodni yuborish
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-8">
          <div className="relative group">
            <input
              ref={otpInputRef}
              type="text"
              required
              maxLength={12}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-6 py-6 rounded-3xl border-2 border-slate-100 focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all text-center text-4xl font-black text-gray-900 bg-slate-50 focus:bg-white shadow-inner placeholder:text-gray-200 placeholder:text-2xl placeholder:font-bold"
              placeholder="Kodni kiriting"
              autoFocus
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading || otp.length < 4}
              className="w-full py-5 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 hover:bg-primary-600 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-lg"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={24} /> : 'Tasdiqlash'}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="w-full py-4 text-gray-500 font-bold hover:text-primary transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
              Kodni qayta yuborish
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep('identifier')}
            className="w-full text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors"
          >
            Ma'lumotlarni o'zgartirish
          </button>
        </form>
      )}

      {step === 'telegram' && (
        <div className="space-y-8">
          <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-[1.5rem] bg-white flex items-center justify-center text-primary shadow-lg shadow-primary/10">
              <MessageCircle size={32} />
            </div>
            <div>
              <p className="font-black text-gray-900 text-lg leading-tight">Botga o'ting</p>
              <p className="text-gray-500 text-sm font-medium mt-2">Tasdiqlash kodi Telegram botimizda shakllantirildi.</p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={redirectToTelegram}
              className="group w-full py-5 bg-[#0088cc] text-white rounded-3xl font-black shadow-2xl shadow-[#0088cc]/30 hover:bg-[#0077b5] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
            >
              Botga o'tish
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setStep('otp')}
              className="w-full py-5 bg-white border-2 border-slate-100 text-gray-700 rounded-3xl font-black hover:border-primary/20 hover:bg-slate-50 transition-all text-lg"
            >
              Kodni qo'lda kiritish
            </button>
          </div>

          <button
            type="button"
            onClick={() => setStep('identifier')}
            className="w-full text-sm text-gray-400 font-bold hover:text-gray-600 transition-colors text-center"
          >
            Ortga qaytish
          </button>
        </div>
      )}

      {step === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-8">
          <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-black text-emerald-900 leading-tight">Tasdiqlandi!</p>
              <p className="text-emerald-700/70 text-sm font-medium mt-1">Platformada yangisiz. Iltimos, ismingizni kiriting.</p>
            </div>
          </div>

          <div className="relative group">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ism-familiyangiz</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-6 py-5 rounded-3xl border-2 border-slate-100 focus:border-primary/20 focus:ring-8 focus:ring-primary/5 outline-none transition-all font-bold text-gray-700 bg-slate-50 focus:bg-white text-lg"
              placeholder="Shokirov Olimjon"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !fullName.trim()}
            className="w-full py-5 bg-primary text-white rounded-3xl font-black shadow-2xl shadow-primary/30 hover:bg-primary-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg"
          >
            {isLoading ? <RefreshCw className="animate-spin" size={24} /> : 'Tayyor! Sahifaga o\'tish'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><RefreshCw className="animate-spin text-primary" size={40} /></div>}>
      <LoginContent />
    </Suspense>
  );
}
