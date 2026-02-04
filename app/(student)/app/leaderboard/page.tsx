'use client';

import { useEffect, useState } from 'react';
import { ratingService } from '@/services/mobile-api';
import { RatingResponse } from '@/types/mobile-api';

export default function LeaderboardPage() {
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
        return `${hours}s ${minutes}d`;
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return <span className="text-3xl">🥇</span>;
        if (rank === 2) return <span className="text-3xl">🥈</span>;
        if (rank === 3) return <span className="text-3xl">🥉</span>;
        return <span className="text-lg font-black text-slate-300">#{rank}</span>;
    };

    if (isLoading && !ratings) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const periods = [
        { id: 'day', label: 'Bugun' },
        { id: 'week', label: 'Hafta' },
        { id: 'month', label: 'Oy' },
        { id: 'year', label: 'Yil' },
        { id: 'total', label: 'Hammasi' }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Liderlar jadvali</h1>
                <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto scrollbar-hide">
                    {periods.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPeriod(p.id as any)}
                            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${period === p.id
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current User Rank - Sticky highlight */}
            {ratings?.me && (
                <div className="bg-primary-600 rounded-[2.5rem] p-8 shadow-xl shadow-primary-200 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:scale-110 transition-transform">
                        <span className="text-8xl font-black">#{ratings.me.rank}</span>
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-black border-2 border-white/30 truncate uppercase">
                                {ratings.me.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="text-primary-100 text-xs font-bold uppercase tracking-widest mb-1">Sizning o'rningiz</p>
                                <h2 className="text-2xl font-black">{ratings.me.name}</h2>
                                <p className="text-primary-100 font-bold mt-1">
                                    {ratings.me.activity} ball
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:block text-right">
                            <p className="text-primary-200 text-[10px] font-black uppercase tracking-widest">Reyting</p>
                            <p className="text-4xl font-black">#{ratings.me.rank}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Users List */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                {ratings?.items && ratings.items.length > 0 ? (
                    <div className="divide-y divide-slate-50">
                        {ratings.items.map((learner) => (
                            <div
                                key={learner.user_id}
                                className={`flex items-center justify-between p-6 md:p-8 transition-colors hover:bg-slate-50/50 ${learner.user_id === ratings.me?.user_id ? 'bg-primary-50/30' : ''}`}
                            >
                                <div className="flex items-center gap-6 md:gap-8">
                                    <div className="w-12 flex justify-center shrink-0">
                                        {getRankBadge(learner.rank)}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${learner.rank <= 3 ? 'bg-white border-primary-100 text-primary-600' : 'bg-slate-100 border-transparent text-slate-500'} uppercase truncate`}>
                                            {learner.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-slate-800 md:text-lg">
                                                {learner.name}
                                                {learner.user_id === ratings.me?.user_id && (
                                                    <span className="ml-2 text-[10px] bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Siz</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                Active Learner
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-700 md:text-xl">{learner.activity} ball</p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Faollik bali</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <div className="text-6xl mb-6 opacity-20">📊</div>
                        <p className="text-slate-400 font-medium italic">Ushbu davr uchun ma'lumotlar mavjud emas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

