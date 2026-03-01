'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authService, activityService, profileService } from '@/services';
import { ActivityStatsResponse } from '@/types/mobile-api';
import { User, Phone, Shield, BarChart3, Trash2, Camera, LogOut, Key } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function ProfilePage() {
    const { user, logout, refreshUser } = useAuth();
    const [activityStats, setActivityStats] = useState<ActivityStatsResponse | null>(null);

    // UI State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showEditProfileForm, setShowEditProfileForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Password Form State (Removed as per user request)

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

    // Password change functionality removed as per user request

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
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
            <h1 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Shaxsiy kabinet</h1>

            {error && (
                <div className="mb-8 p-5 bg-primary/5 border border-primary/10 rounded-2xl text-primary text-sm font-medium flex items-center gap-3">
                    <span className="text-xl">⚠️</span> {error}
                </div>
            )}
            {message && (
                <div className="mb-8 p-5 bg-emerald-50 border border-emerald-100/50 rounded-2xl text-emerald-600 text-sm font-medium flex items-center gap-3">
                    <span className="text-xl">✅</span> {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/10 to-primary/5 -mt-4"></div>

                        <div className="relative inline-block mt-4 mb-6">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-white shadow-card flex items-center justify-center mx-auto overflow-hidden text-4xl font-black text-primary p-1 border-4 border-white">
                                <div className="w-full h-full rounded-[2.2rem] bg-primary-tint flex items-center justify-center overflow-hidden">
                                    {user?.image_url ? (
                                        <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0) || 'U'
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                            >
                                <Camera size={18} />
                            </button>
                        </div>

                        <h3 className="text-2xl font-black text-gray-900 mb-1">{user?.name}</h3>
                        <p className="text-gray-400 font-medium mb-8 flex items-center justify-center gap-2">
                            <Phone size={14} /> {user?.phone_number}
                        </p>

                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => setShowEditProfileForm(true)}
                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98]"
                            >
                                Profilni tahrirlash
                            </button>
                            <button
                                onClick={logout}
                                className="w-full py-4 bg-slate-50 text-gray-400 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <LogOut size={18} /> Chiqish
                            </button>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setEditImage(e.target.files[0]);
                                }
                            }}
                        />
                    </div>

                    {/* Security section removed as password feature is gone */}
                </div>

                {/* Right Column: Dynamic Forms & Stats */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Activity Stats */}
                    {activityStats && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft">
                            <h3 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-3">
                                <BarChart3 className="text-primary" />
                                Muvaffaqiyatlarim
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 text-blue-100 group-hover:scale-110 transition-transform duration-500">
                                        <BarChart3 size={100} strokeWidth={1} />
                                    </div>
                                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2">Jami ball</p>
                                    <p className="text-4xl font-black text-blue-900 mt-1">{activityStats.total} <span className="text-lg font-bold opacity-50">ball</span></p>
                                </div>
                                <div className="p-8 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
                                    <div className="absolute -right-4 -bottom-4 text-emerald-100 group-hover:scale-110 transition-transform duration-500">
                                        <BarChart3 size={100} strokeWidth={1} />
                                    </div>
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2">O'qish vaqti</p>
                                    <p className="text-4xl font-black text-emerald-900 mt-1">{formatTime(activityStats.total)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 p-8 rounded-[2.5rem] border border-red-100">
                        <h3 className="text-xl font-black text-red-700 mb-2 flex items-center gap-2">
                            <Trash2 size={24} /> Xavfli hudud
                        </h3>
                        <p className="text-red-600 font-medium mb-8">Hisobingizni o'chirish qaytarib bo'lmas jarayon bo'lib, barcha ma'lumotlaringiz butunlay yo'qoladi.</p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-10 py-4 bg-white border-2 border-red-100 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all active:scale-[0.98] shadow-sm"
                            >
                                Hisobni o'chirish
                            </button>
                        ) : (
                            <div className="p-8 bg-white rounded-[2rem] border-2 border-red-100 shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-full bg-red-600"></div>
                                <p className="mb-8 text-gray-900 font-black text-lg leading-tight uppercase tracking-tight">Haqiqatan ham hisobingizni o'chirib yubormoqchimisiz?</p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                        className="px-10 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? 'O\'chirilmoqda...' : 'Ha, o\'chirilsin'}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-10 py-4 bg-slate-50 text-gray-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                                    >
                                        Yo'q, qolsin
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={showEditProfileForm}
                onClose={() => setShowEditProfileForm(false)}
                title="Profilni tahrirlash"
            >
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Ism familingiz</label>
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-700 hover:border-gray-200"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Telefon raqam</label>
                            <input
                                type="tel"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-700 hover:border-gray-200"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowEditProfileForm(false)}
                            className="flex-1 py-4 bg-slate-50 text-gray-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                        >
                            Bekor qilish
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Password Modal Removed */}

            <Modal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                title="Hisobni o'chirish"
                className="max-w-md"
            >
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={40} />
                    </div>
                    <p className="text-gray-900 font-black text-xl leading-tight tracking-tight uppercase">
                        Haqiqatan ham hisobingizni o'chirib yubormoqchimisiz?
                    </p>
                    <p className="text-red-600 font-medium">
                        Bu qaytarib bo'lmas jarayon bo'lib, barcha ma'lumotlaringiz butunlay yo'qoladi.
                    </p>
                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleDeleteAccount}
                            disabled={loading}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'O\'chirilmoqda...' : 'Ha, o\'chirilsin'}
                        </button>
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="w-full py-4 bg-slate-50 text-gray-500 rounded-2xl font-bold hover:bg-slate-100 transition-all active:scale-[0.98]"
                        >
                            Yo'q, qolsin
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
