'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { authService, activityService } from '@/services/mobile-api';
import { ActivityStatsResponse } from '@/types/mobile-api';
import ProtectedRoute from '@/components/ProtectedRoute';

function ProfileContent() {
    const { user, logout, refreshUser } = useAuth();
    const [activityStats, setActivityStats] = useState<ActivityStatsResponse | null>(null);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchActivityStats();
    }, []);

    const fetchActivityStats = async () => {
        try {
            const stats = await activityService.getStats({ type: 'total' });
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

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

                {/* User Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
                    <div className="space-y-3">
                        {user?.full_name && (
                            <div>
                                <span className="text-gray-600">Name:</span>
                                <span className="ml-2 font-semibold">{user.full_name}</span>
                            </div>
                        )}
                        <div>
                            <span className="text-gray-600">Phone:</span>
                            <span className="ml-2 font-semibold">{user?.phone_number}</span>
                        </div>
                        {user?.email && (
                            <div>
                                <span className="text-gray-600">Email:</span>
                                <span className="ml-2 font-semibold">{user.email}</span>
                            </div>
                        )}
                    </div>
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
                            {message && (
                                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}
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
                                        setError('');
                                        setMessage('');
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Logout */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h2>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/login';
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
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
