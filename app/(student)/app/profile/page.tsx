'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authService, activityService, profileService } from '@/services/mobile-api';
import { ActivityStatsResponse } from '@/types/mobile-api';
import ProtectedRoute from '@/components/ProtectedRoute';

function ProfileContent() {
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
            setError('New passwords do not match');
            return;
        }

        try {
            await authService.changePassword({
                old_password: oldPassword,
                new_password: newPassword,
            });
            setMessage('Password changed successfully');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err: any) {
            setError(err.message || 'Failed to change password');
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
            setMessage('Profile updated successfully');
            setShowEditProfileForm(false);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        try {
            await profileService.deleteProfile();
            logout();
            window.location.href = '/login';
        } catch (err: any) {
            setError(err.message || 'Failed to delete account');
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                        {message}
                    </div>
                )}

                {/* User Info / Edit Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                        {!showEditProfileForm && (
                            <button
                                onClick={() => setShowEditProfileForm(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {!showEditProfileForm ? (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="h-16 w-16 rounded-full bg-gray-200 overflow-hidden mr-4">
                                    {/* We don't have user.image_url in generic UserRes type yet, assuming generic avatar */}
                                    {/* If API returns image, we should add it to type. For now showing placeholder or user initials */}
                                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold text-xl">
                                        {user?.name?.charAt(0) || 'U'}
                                    </div>
                                </div>
                                <div>

                                </div>
                            </div>
                            {user?.name && (
                                <div>
                                    <span className="text-gray-600 block text-xs uppercase tracking-wide">Name</span>
                                    <span className="font-medium text-lg text-gray-900">{user.name}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-600 block text-xs uppercase tracking-wide">Phone</span>
                                <span className="font-medium text-lg text-gray-900">{user?.phone_number}</span>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setEditImage(e.target.files[0]);
                                        }
                                    }}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() => {
                                        setShowEditProfileForm(false);
                                        setEditName(user?.name || '');
                                        setEditPhone(user?.phone_number || '');
                                        setEditImage(null);
                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Activity Stats */}
                {activityStats && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Learning Statistics</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <p className="text-blue-600 text-sm font-semibold">Total Time</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatTime(activityStats.total_time)}
                                </p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <p className="text-green-600 text-sm font-semibold">Lessons Completed</p>
                                <p className="text-2xl font-bold text-gray-800">{activityStats.total_lessons}</p>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <p className="text-purple-600 text-sm font-semibold">Courses</p>
                                <p className="text-2xl font-bold text-gray-800">{activityStats.total_courses}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Change Password */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>

                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Save Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        setOldPassword('');
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Account Actions (Logout / Delete) */}
                <div className="bg-white rounded-lg shadow-md p-6 border-t border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => {
                                logout();
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Log Out
                        </button>

                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Delete Account
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 animate-fade-in bg-red-50 p-3 rounded-lg border border-red-200">
                                <span className="text-sm text-red-700 font-medium">Are you sure? This cannot be undone.</span>
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={loading}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Deleting...' : 'Confirm Delete'}
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="px-3 py-1 bg-white text-gray-600 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    );
}
