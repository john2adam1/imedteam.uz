'use client';

import { useEffect, useState } from 'react';
import { ratingService } from '@/services';
import { RatingResponse } from '@/types/mobile-api';
import { Trophy, Activity, Users, Search } from 'lucide-react';

export default function LeaderboardPage() {
    const [ratings, setRatings] = useState<RatingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'total'>('total');

    useEffect(() => {
        fetchRatings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        { id: 'total', label: 'Hammasi' },
    ];

    if (isLoading && !ratings) {
        return (
            <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-primary/20 border-t-primary"></div>
                <p className="text-gray-400 font-bold animate-pulse text-sm sm:text-base">Reyting yuklanmoqda...</p>
            </div>
        );
    }

    const topThree = ratings?.items?.slice(0, 3) || [];
    const others = ratings?.items?.slice(3) || [];

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-6 space-y-6 sm:space-y-10 overflow-x-hidden">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
                <div className="space-y-2 sm:space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 rounded-xl border border-yellow-100 text-yellow-600 font-black text-[10px] sm:text-xs uppercase tracking-widest">
                        <Trophy size={14} className="flex-shrink-0" /> Bilimlar poygasi
                    </div>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        Liderlar jadvali
                    </h1>
                    <p className="text-sm sm:text-lg text-gray-400 font-medium leading-relaxed">
                        Platformaning eng faol talabalari bilan tanishing.
                    </p>
                </div>

                {/* Period Selector (mobile-friendly) */}
                <div className="w-full overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar">
                    <div className="p-1 bg-slate-100/80 backdrop-blur-sm rounded-2xl flex flex-nowrap gap-1 shadow-inner h-fit border border-gray-100 w-max min-w-max">
                        {periods.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id as any)}
                                className={`px-4 sm:px-6 py-2 rounded-xl sm:rounded-[1.5rem] font-black transition-all duration-300 tracking-tight whitespace-nowrap text-[11px] sm:text-base
                  ${period === p.id ? 'bg-white text-gray-900 shadow-sm sm:shadow-md' : 'text-gray-400 hover:text-gray-600'}
                `}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Podium for Top 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 items-end">
                {/* 2nd Place */}
                {topThree[1] && (
                    <div className="order-2 sm:order-1 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 shadow-soft text-center space-y-3 group hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
                        <div className="relative inline-block">
                            <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto text-lg sm:text-3xl font-black text-slate-300 border border-white sm:border-4 shadow-sm overflow-hidden">
                                {topThree[1].name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 transform scale-90 sm:scale-110">🥈</div>
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                {topThree[1].name}
                            </h3>
                            <p className="text-primary font-black text-base sm:text-2xl tracking-tighter">
                                {topThree[1].activity}{' '}
                                <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest opacity-50">
                                    ball
                                </span>
                            </p>
                        </div>
                    </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                    <div className="order-1 sm:order-2 bg-white p-5 sm:p-10 rounded-[1.75rem] sm:rounded-[3rem] border border-primary/10 shadow-premium text-center space-y-4 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300">
                        <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-primary"></div>
                        <div className="relative inline-block">
                            <div className="w-16 h-16 sm:w-32 sm:h-32 rounded-[1.25rem] sm:rounded-[2.5rem] bg-primary/5 flex items-center justify-center mx-auto text-xl sm:text-4xl font-black text-primary border border-white sm:border-4 shadow-md overflow-hidden">
                                {topThree[0].name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-2 -right-1 transform scale-110 sm:scale-150 drop-shadow-lg">🥇</div>
                        </div>
                        <div>
                            <h3 className="text-base sm:text-2xl font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight line-clamp-1">
                                {topThree[0].name}
                            </h3>
                            <p className="text-primary font-black text-xl sm:text-4xl tracking-tighter mt-1">
                                {topThree[0].activity}{' '}
                                <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest opacity-50">
                                    ball
                                </span>
                            </p>
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-white rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20">
                                Chempion
                            </div>
                        </div>
                    </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                    <div className="order-3 bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-gray-100 shadow-soft text-center space-y-3 group hover:shadow-premium transition-all duration-300 hover:-translate-y-1">
                        <div className="relative inline-block">
                            <div className="w-14 h-14 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[2rem] bg-orange-50/30 flex items-center justify-center mx-auto text-lg sm:text-3xl font-black text-orange-200 border border-white sm:border-4 shadow-sm overflow-hidden">
                                {topThree[2].name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 transform scale-90 sm:scale-110">🥉</div>
                        </div>
                        <div>
                            <h3 className="text-sm sm:text-xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                                {topThree[2].name}
                            </h3>
                            <p className="text-primary font-black text-base sm:text-2xl tracking-tighter">
                                {topThree[2].activity}{' '}
                                <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest opacity-50">
                                    ball
                                </span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Current User Rank Card */}
            {ratings?.me && (
                <div className="bg-primary p-4 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-premium relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-56 h-56 sm:w-64 sm:h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
                        <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                            <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-lg sm:text-3xl font-black border border-white/20 flex-shrink-0">
                                {ratings.me.rank}
                            </div>
                            <div className="min-w-0">
                                <p className="text-white/60 text-[10px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                    Sizning o&apos;rningiz
                                </p>
                                <h3 className="text-base sm:text-3xl font-black tracking-tight line-clamp-1">
                                    {ratings.me.name}
                                </h3>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 sm:gap-12 w-full sm:w-auto justify-between sm:justify-end border-t border-white/10 sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-12">
                            <div className="text-left sm:text-right">
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Ballaringiz</p>
                                <p className="text-xl sm:text-3xl font-black tracking-tighter">{ratings.me.activity}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Holat</p>
                                <p className="text-sm sm:text-xl font-black flex items-center gap-2">
                                    <Activity size={16} className="sm:w-5 sm:h-5" /> Faol
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main List/Table */}
            <div className="bg-white rounded-2xl sm:rounded-[2.5rem] border border-gray-100 shadow-soft overflow-hidden">
                <div className="p-4 sm:p-8 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <h3 className="text-base sm:text-xl font-black text-gray-900 flex items-center gap-2 sm:gap-3">
                        <Users className="text-primary w-5 h-5 sm:w-6 sm:h-6" />
                        Barcha ishtirokchilar
                    </h3>
                    <div className="text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl">
                        Jami {ratings?.items?.length || 0} nafar
                    </div>
                </div>

                {/* MOBILE: card list (instead of table) */}
                <div className="sm:hidden">
                    {others.length > 0 ? (
                        <div className="divide-y divide-gray-50">
                            {others.map((learner) => {
                                const isMe = learner.user_id === ratings?.me?.user_id;
                                return (
                                    <div key={learner.user_id} className={`p-4 ${isMe ? 'bg-primary/5' : ''}`}>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-gray-500 flex-shrink-0">
                                                    {learner.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`font-black text-sm line-clamp-1 ${isMe ? 'text-primary' : 'text-gray-900'}`}>
                                                        {learner.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 font-bold">
                                                        <span className="text-gray-500">#{learner.rank}</span>
                                                        {isMe && (
                                                            <span className="ml-2 px-2 py-0.5 bg-primary text-white text-[10px] font-black uppercase rounded-md tracking-widest">
                                                                Siz
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <p className="font-black text-gray-900 tabular-nums">{learner.activity}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-70">ball</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Search className="text-gray-300" />
                            </div>
                            <p className="text-gray-400 font-bold text-sm">Ushbu davr uchun ma&apos;lumotlar mavjud emas.</p>
                        </div>
                    )}
                </div>

                {/* DESKTOP/TABLET: table */}
                <div className="hidden sm:block overflow-x-auto">
                    {others.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                        O&apos;rin
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                        Talaba
                                    </th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right whitespace-nowrap">
                                        Ballar
                                    </th>
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
                                            <td className="px-8 py-6 whitespace-nowrap">
                                                <span className="font-black text-gray-400 group-hover:text-primary transition-colors tracking-tighter text-lg">
                                                    #{learner.rank}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-base text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all flex-shrink-0">
                                                        {learner.name.charAt(0)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`font-bold transition-all text-base line-clamp-1 ${isMe ? 'text-primary' : 'text-gray-900'}`}>
                                                            {learner.name}
                                                        </p>
                                                        {isMe && (
                                                            <span className="px-1.5 py-0.5 bg-primary text-white text-[8px] font-black uppercase rounded-md tracking-widest">
                                                                Siz
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right whitespace-nowrap">
                                                <span className="font-black text-gray-900 tabular-nums text-lg tracking-tighter">
                                                    {learner.activity}
                                                </span>
                                                <span className="ml-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest opacity-50">
                                                    ball
                                                </span>
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
                            <p className="text-gray-400 font-bold text-base">Ushbu davr uchun ma&apos;lumotlar mavjud emas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
