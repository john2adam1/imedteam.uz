'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authService, activityService, profileService } from '@/services/mobile-api';
import { ActivityStatsResponse } from '@/types/mobile-api';

export default function ProfilePage() {
    const { user, logout, refreshUser } = useAuth();
    const [activityStats, setActivityStats] = useState<ActivityStatsResponse | null>(null);

    // UI State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Password Form State
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Edit Profile State
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [editImage, setEditImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Feedback
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchActivityStats();
        if (user) {
            setEditName(user.name || '');
            setEditPhone(user.phone_number || '');
        }
    }, [user]);

    const fetchActivityStats = async () => {
        try {
            const stats = await activityService.getStats({ type: 'year' });
            setActivityStats(stats);
        } catch (err) {
            console.error('Failed to fetch activity stats:', err);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (newPassword !== confirmPassword) {
            setError('Yangi parollar mos kelmadi');
            return;
        }

        try {
            setLoading(true);
            await authService.changePassword({
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            setMessage('Parol muvaffaqiyatli o‘zgartirildi');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err: any) {
            setError(err.message || 'Parolni o‘zgartirishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            await profileService.updateProfile({
                name: editName,
                phone_number: editPhone,
                image: editImage || undefined,
            });

            await refreshUser();
            setMessage('Profil muvaffaqiyatli yangilandi');
            setShowEditProfileForm(false);
        } catch (err: any) {
            setError(err.message || 'Profilni yangilashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await profileService.deleteProfile();
            logout();
        } catch (err: any) {
            setError(err.message || 'Hisobni o‘chirishda xatolik yuz berdi');
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}s ${minutes}d`;
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Shaxsiy profil</h1>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-4 rounded-2xl animate-fade-in">
                    {error}
                </div>
            )}
            {message && (
                <div className="bg-green-50 border border-green-100 text-green-700 px-6 py-4 rounded-2xl animate-fade-in">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm text-center">
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-full bg-primary-50 flex items-center justify-center text-4xl font-black text-primary-600 border-4 border-white shadow-xl overflow-hidden capitalize">
                                {user?.image_url ? (
                                    <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0) || 'U'
                                )}
                            </div>
                            <button
                                onClick={() => setShowEditProfileForm(true)}
                                className="absolute bottom-1 right-1 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-400 hover:text-primary-600 transition-colors border border-slate-50"
                            >
                                ✎
                            </button>
                        </div>
                        <h2 className="text-xl font-black text-slate-800 mb-1">{user?.name}</h2>
                        <p className="text-sm text-slate-400 font-medium">{user?.phone_number}</p>

                        <div className="mt-8 pt-8 border-t border-slate-50">
                            <button
                                onClick={() => logout()}
                                className="w-full py-3 px-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                            >
                                Chiqish
                            </button>
                        </div>
                    </div>

                    {/* Security Quick Link */}
                    <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-widest">Xavfsizlik</h3>
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="w-full py-3 px-4 border border-slate-100 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors text-left flex justify-between items-center"
                        >
                            <span>Parolni o‘zgartirish</span>
                            <span className="text-slate-300">→</span>
                        </button>
                    </div>
                </div>

                {/* Right Column: Dynamic Forms & Stats */}
                <div className="md:col-span-2 space-y-8">
                    {/* Activity Stats */}
                    {activityStats && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 mb-6">O'quv ko'rsatkichlari</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-6 bg-blue-50 rounded-3xl">
                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Umumiy faollik</p>
                                    <p className="text-2xl font-black text-blue-700">{activityStats.total} ball</p>
                                </div>
                                <div className="p-6 bg-green-50 rounded-3xl">
                                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Davomiylik</p>
                                    <p className="text-2xl font-black text-green-700">{formatTime(activityStats.total)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Profile Form */}
                    {showEditProfileForm && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm animate-fade-in">
                            <h3 className="text-lg font-black text-slate-800 mb-6">Profilni tahrirlash</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Ism-familiya</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                                            placeholder="Ismingizni kiriting"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Telefon raqam</label>
                                        <input
                                            type="tel"
                                            value={editPhone}
                                            onChange={(e) => setEditPhone(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                                            placeholder="+998 00 000 00 00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Rasm (ixtiyoriy)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setEditImage(e.target.files[0]);
                                            }
                                        }}
                                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all disabled:opacity-50"
                                    >
                                        {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditProfileForm(false)}
                                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                    >
                                        Bekor qilish
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Password Form */}
                    {showPasswordForm && (
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm animate-fade-in">
                            <h3 className="text-lg font-black text-slate-800 mb-6">Parolni o'zgartirish</h3>
                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Eski parol</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Yangi parol</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Parolni tasdiqlang</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg shadow-primary-100 hover:bg-primary-700 transition-all"
                                    >
                                        {loading ? 'Saqlanmoqda...' : 'Parolni saqlash'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordForm(false)}
                                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                                    >
                                        Bekor qilish
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="p-8 bg-red-50/50 rounded-[2.5rem] border border-red-100/50">
                        <h3 className="text-lg font-black text-red-800 mb-2">Xavfli hudud</h3>
                        <p className="text-sm text-red-600/70 mb-6">Hisobingizni o'chirib tashlash barcha ma'lumotlaringiz va sotib olingan kurslaringizni yo'qolishiga olib keladi.</p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-3 bg-white text-red-600 border border-red-100 rounded-2xl text-sm font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm"
                            >
                                Hisobni o‘chirish
                            </button>
                        ) : (
                            <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-red-200 shadow-xl shadow-red-100/50">
                                <span className="text-sm text-red-800 font-bold">Haqiqatdan ham o'chirmoqchimisiz?</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 text-white text-xs rounded-xl font-bold hover:bg-red-700 transition-colors"
                                    >
                                        Ha, tasdiqlayman
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 text-xs rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                    >
                                        Bekor qilish
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

