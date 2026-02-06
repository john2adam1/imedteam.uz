'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authService, activityService, profileService } from '@/services';
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
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Shaxsiy profil</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}
            {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl text-green-600 text-sm">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 border border-gray-200 bg-white p-6 rounded-2xl h-fit shadow-sm">
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 overflow-hidden text-3xl font-bold text-gray-400 border border-gray-100">
                            {user?.image_url ? (
                                <img src={user.image_url} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{user?.name}</h3>
                        <p className="text-gray-500 mb-6">{user?.phone_number}</p>
                        <button
                            onClick={() => setShowEditProfileForm(true)}
                            className="w-full py-2.5 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                        >
                            Edit Profile
                        </button>
                    </div>


                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Security</h4>
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Change Password
                        </button>
                    </div>
                </div>

                {/* Right Column: Dynamic Forms & Stats */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Activity Stats */}
                    {activityStats && (
                        <div className="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Success Stats</h3>
                            <div className="flex gap-4">
                                <div className="flex-1 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Total Points</p>
                                    <p className="text-3xl font-bold text-blue-900 mt-1">{activityStats.total} ball</p>
                                </div>
                                <div className="flex-1 p-4 bg-green-50 rounded-xl border border-green-100">
                                    <p className="text-xs text-green-600 font-medium uppercase tracking-wider">Time Spent</p>
                                    <p className="text-3xl font-bold text-green-900 mt-1">{formatTime(activityStats.total)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Profile Form */}
                    {showEditProfileForm && (
                        <div className="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Profile</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                                    <input
                                        type="tel"
                                        value={editPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Avatar</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setEditImage(e.target.files[0]);
                                            }
                                        }}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 transition-all cursor-pointer"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-70 shadow-sm shadow-primary-600/30"
                                    >
                                        {loading ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowEditProfileForm(false)}
                                        className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Password Form */}
                    {showPasswordForm && (
                        <div className="border border-gray-200 bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Old Password</label>
                                    <input
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-70 shadow-sm shadow-primary-600/30"
                                    >
                                        {loading ? 'Saving...' : 'Update Password'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordForm(false)}
                                        className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="border border-red-100 bg-red-50 p-6 rounded-2xl">
                        <h3 className="text-lg font-bold text-red-700 mb-2">Danger Zone</h3>
                        <p className="text-red-600 text-sm mb-4">Deleting your account is permanent and cannot be undone.</p>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20"
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="p-4 border border-red-200 bg-white rounded-xl">
                                <p className="mb-4 text-gray-900 font-medium">Are you sure you want to delete your account?</p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleDeleteAccount}
                                        disabled={loading}
                                        className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-70 shadow-sm shadow-red-600/20"
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
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

