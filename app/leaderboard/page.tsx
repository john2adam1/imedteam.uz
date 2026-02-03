'use client';

import { useEffect, useState } from 'react';
import { ratingService } from '@/services/mobile-api';
import { RatingResponse, RatingUser } from '@/types/mobile-api';
import ProtectedRoute from '@/components/ProtectedRoute';

function LeaderboardContent() {
    const [ratings, setRatings] = useState<RatingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'total'>('total');

    useEffect(() => {
        fetchRatings();
    }, [period]);

    const fetchRatings = async () => {
        setIsLoading(true);
        try {
            const response = await ratingService.getRating({ type: period });
            setRatings(response);
        } catch (error) {
            console.error('Failed to fetch ratings:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Leaderboard</h1>

                {/* Period Filter */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {(['day', 'week', 'month', 'year', 'total'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2 rounded-lg capitalize transition-colors ${period === p
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top Users */}
                {ratings?.items && ratings.items.length > 0 && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Learners</h2>
                        <div className="space-y-3">
                            {ratings.items.map((user) => (
                                <div
                                    key={user.user_id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-2xl font-bold w-12 text-center">
                                            {getRankBadge(user.rank)}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.full_name}</p>
                                            <p className="text-sm text-gray-600">
                                                {formatTime(user.total_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Current User Rank */}
                {ratings?.me && (
                    <div className="bg-blue-50 border-2 border-blue-600 rounded-lg p-6">
                        <h2 className="text-xl font-semibold text-blue-800 mb-4">Your Rank</h2>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-blue-600">
                                    #{ratings.me.rank}
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-800">{ratings.me.full_name}</p>
                                    <p className="text-sm text-gray-600">
                                        {formatTime(ratings.me.total_time)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {(!ratings?.items || ratings.items.length === 0) && (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-600">No rankings available for this period yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function LeaderboardPage() {
    return (
        <ProtectedRoute>
            <LeaderboardContent />
        </ProtectedRoute>
    );
}
