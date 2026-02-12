'use client';

import { useEffect, useState } from 'react';
import { ratingService } from '@/services';
import { RatingResponse } from '@/types/mobile-api';
import { Trophy, Medal, Activity, Users, Search } from 'lucide-react';

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

    const periods = [
        { id: 'day', label: 'Bugun' },
        { id: 'week', label: 'Hafta' },
        { id: 'month', label: 'Oy' },
        { id: 'year', label: 'Yil' },
        { id: 'total', label: 'Hammasi' }
    ];

    if (isLoading && !ratings) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <p className="text-gray-400 font-bold animate-pulse">Reyting yuklanmoqda...</p>
            </div>
        );
    }

    const topThree = ratings?.items?.slice(0, 3) || [];
    const others = ratings?.items?.slice(3) || [];

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-2xl border border-yellow-100 text-yellow-600 font-black text-xs uppercase tracking-widest">
                        <Trophy size={14} /> Bilimlar poygasi
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Liderlar jadvali</h1>
                    <p className="text-lg text-gray-400 font-medium">Platformaning eng faol va bilimga chanqoq talabalari bilan tanishing.</p>
                </div>

                {/* Period Selector */}
                <div className="p-1.5 bg-slate-100 rounded-[2rem] flex flex-wrap gap-1 shadow-inner h-fit border border-gray-100">
                    {periods.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setPeriod(p.id as any)}
                            className={`px-6 py-2.5 rounded-[1.5rem] font-black transition-all duration-300 tracking-tight
                                ${period === p.id
                                    ? 'bg-white text-gray-900 shadow-md scale-105'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Podium for Top 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end py-10">
                {/* 2nd Place */}
                {topThree[1] && (
                    <div className="order-2 md:order-1 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft text-center space-y-4 group hover:shadow-premium transition-all duration-500 hover:-translate-y-2">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto text-3xl font-black text-slate-300 border-4 border-white shadow-card overflow-hidden">
                                {topThree[1].name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 transform scale-125">🥈</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{topThree[1].name}</h3>
                            <p className="text-primary font-black text-2xl tracking-tighter">{topThree[1].activity} <span className="text-xs text-gray-400 uppercase tracking-widest opacity-50">ball</span></p>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <div className="order-1 md:order-2 bg-white p-10 rounded-[3rem] border border-primary/10 shadow-premium text-center space-y-6 relative overflow-hidden group hover:-translate-y-4 transition-all duration-500">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-primary/5 flex items-center justify-center mx-auto text-4xl font-black text-primary border-4 border-white shadow-premium overflow-hidden">
                                {topThree[0].name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-4 -right-2 transform scale-150 drop-shadow-lg">🥇</div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight line-clamp-1">{topThree[0].name}</h3>
                            <p className="text-primary font-black text-4xl tracking-tighter mt-1">{topThree[0].activity} <span className="text-xs text-gray-400 uppercase tracking-widest opacity-50">ball</span></p>
                        </div>
                        <div className="pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                Chempion
                            </div>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <div className="order-3 md:order-3 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft text-center space-y-4 group hover:shadow-premium transition-all duration-500 hover:-translate-y-2">
                        <div className="relative inline-block">
                            <div className="w-24 h-24 rounded-[2rem] bg-orange-50/30 flex items-center justify-center mx-auto text-3xl font-black text-orange-200 border-4 border-white shadow-card overflow-hidden">
                                {topThree[2].name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 transform scale-125">🥉</div>
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{topThree[2].name}</h3>
                            <p className="text-primary font-black text-2xl tracking-tighter">{topThree[2].activity} <span className="text-xs text-gray-400 uppercase tracking-widest opacity-50">ball</span></p>
                        </div>
                    </div>
                )}
            </div>

            {/* Current User Rank Card */}
            {ratings?.me && (
                <div className="bg-primary p-8 md:p-10 rounded-[2.5rem] shadow-premium relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-black border border-white/20">
                                {ratings?.me?.rank}
                            </div>
                            <div>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Sizning o'rningiz</p>
                                <h3 className="text-3xl font-black tracking-tight">{ratings?.me?.name}</h3>
                            </div>
                        </div>
                        <div className="flex items-center gap-12 w-full md:w-auto justify-around md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
                            <div className="text-center">
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Ballaringiz</p>
                                <p className="text-3xl font-black tracking-tighter">{ratings?.me?.activity}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Holat</p>
                                <p className="text-xl font-black flex items-center gap-2">
                                    <Activity size={20} /> Faol
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Table for the rest */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-soft overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <Users className="text-primary" />
                        Barcha ishtirokchilar
                    </h3>
                    <div className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Jami {ratings?.items?.length || 0} nafar
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {others.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">O'rin</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Talaba</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ballar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {others.map((learner) => {
                                    const isMe = learner.user_id === ratings?.me?.user_id;
                                    return (
                                        <tr
                                            key={learner.user_id}
                                            className={`hover:bg-slate-50/50 transition-colors group ${isMe ? 'bg-primary/5' : ''}`}
                                        >
                                            <td className="px-8 py-6">
                                                <span className="font-black text-gray-400 group-hover:text-primary transition-colors tracking-tighter text-lg">#{learner.rank}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                        {learner.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className={`font-bold transition-all ${isMe ? 'text-primary' : 'text-gray-900'}`}>
                                                            {learner.name}
                                                        </span>
                                                        {isMe && <span className="ml-2 px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase rounded-md tracking-widest">Siz</span>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <span className="font-black text-gray-900 tabular-nums text-lg tracking-tighter">{learner.activity}</span>
                                                <span className="ml-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-50">ball</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Search className="text-gray-300" />
                            </div>
                            <p className="text-gray-400 font-bold">Ushbu davr uchun ma'lumotlar mavjud emas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
