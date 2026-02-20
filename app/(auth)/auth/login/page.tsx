'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

type AuthMode = 'login' | 'register';

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [phoneNumber, setPhoneNumber] = useState('+');
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

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        phone_number: phoneNumber,
        full_name: fullName.trim(),
        password: password,
      });

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // If empty or doesn't start with +, ensure it does
    if (!value.startsWith('+')) {
      // Remove any + characters elsewhere and add it to the start
      value = '+' + value.replace(/\+/g, '');
    }

    // If just '+', it's allowed
    setPhoneNumber(value);
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        {mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
      </h1>

      <div className="flex mb-8 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'login'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Kirish
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${mode === 'register'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Ro'yxatdan o'tish
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={mode === 'login' ? handleLoginSubmit : handleRegisterSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon raqam</label>
          <input
            type="tel"
            required
            value={phoneNumber}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
            placeholder="+998"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ism-familiya</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
              placeholder="Ism-familiyangizni kiriting"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Parol</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
            placeholder="Parolingizni kiriting"
          />
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Parolni tasdiqlash</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white"
              placeholder="Parolni qayta kiriting"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-600/30 hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Yuklanmoqda...' : (mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish")}
        </button>
      </form>
    </div>
  );
}
