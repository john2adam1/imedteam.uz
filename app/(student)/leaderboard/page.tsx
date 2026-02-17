'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { ratingService } from '@/services';
import { RatingResponse, RatingUser } from '@/types/mobile-api';
import { Star, Crown, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const PERIODS = [
    { label: 'Haftalik', value: 'week' },
    { label: 'Oylik', value: 'month' },
    { label: 'Yillik', value: 'year' },
    { label: 'Barchasi', value: 'total' },
];

export default function LeaderboardPage() {
    const [ratings, setRatings] = useState<RatingResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year' | 'total'>('total');
    const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchRatings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date().toLocaleString('uz-UZ', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }));
        };
        updateTime();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowPeriodDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const formatActivity = (activity: number) => {
        if (activity >= 1000) {
            return `${(activity / 1000).toFixed(1)}K`;
        }
        return activity.toString();
    };

    const { podiumItems, otherItems } = useMemo(() => {
        const allItems = ratings?.items || [];
        const podium = [
            allItems[1], // 2nd
            allItems[0], // 1st
            allItems[2]  // 3rd
        ].filter((u): u is RatingUser => !!u);

        const others = allItems.slice(3);
        return { podiumItems: podium, otherItems: others };
    }, [ratings]);

    if (isLoading && !ratings) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary/20 border-t-primary"></div>
                <p className="text-gray-400 font-bold animate-pulse text-sm uppercase tracking-widest">Reyting yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 pb-24">

            {/* Header Section for Mobile */}
            <div className="md:hidden space-y-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Faollar jadvali</h1>
                <p className="text-sm text-gray-500 font-medium italic">Sizning platformadagi yutuqlaringiz</p>
            </div>

            {/* Podium Section - Desktop only */}
            <div className="hidden md:flex items-end justify-center gap-10 pt-16 min-h-[460px]">
                {podiumItems.length > 0 ? (
                    podiumItems.map((user) => {
                        const isFirst = user.rank === 1;

                        return (
                            <div
                                key={user.user_id}
                                className={`flex flex-col items-center space-y-6 ${isFirst ? 'z-10 -translate-y-12' : ''}`}
                            >
                                {isFirst && (
                                    <div className="relative">
                                        <Crown className="w-16 h-16 text-yellow-500 mb-2 drop-shadow-lg animate-bounce" />
                                    </div>
                                )}
                                <div className={`relative ${isFirst ? 'w-64 h-80 scale-110' : 'w-56 h-64'} rounded-[3rem] bg-white border ${isFirst ? 'border-primary/20 ring-4 ring-primary/5' : 'border-gray-100'} flex flex-col items-center justify-center p-8 transition-all duration-500 hover:shadow-premium hover:-translate-y-2 group shadow-soft`}>
                                    <div className="relative mb-6">
                                        <div className={`w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border-2 ${isFirst ? 'border-primary/40' : 'border-gray-100'} transition-transform duration-500 group-hover:scale-110`}>
                                            {user.image_url ? (
                                                <Image src={user.image_url} alt={user.name} width={96} height={96} className="object-cover" />
                                            ) : (
                                                <span className="text-4xl font-black text-gray-200">{user.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-black border-2 ${isFirst ? 'bg-primary border-white text-white shadow-lg' : 'bg-slate-100 border-white text-gray-400'}`}>
                                            {user.rank}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-center text-gray-900 line-clamp-2 min-h-[3.5rem] mb-2 px-2 tracking-tight">
                                        {user.name}
                                    </h3>

                                    <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-2.5 flex items-center gap-2 mt-auto w-full justify-center group-hover:bg-primary transition-all duration-300">
                                        <Star className="w-4 h-4 text-primary fill-primary group-hover:text-white group-hover:fill-white" />
                                        <span className="font-black text-primary group-hover:text-white text-lg tracking-tight">
                                            {formatActivity(user.activity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-400 font-bold italic py-20 text-center w-full">Reyting ma'lumotlari mavjud emas</div>
                )}
            </div>

            {/* Podium Section - Mobile only (Refined List View) */}
            <div className="md:hidden space-y-6">
                {(ratings?.items || []).slice(0, 3).map((user) => (
                    <div
                        key={user.user_id}
                        className="bg-white rounded-[2.5rem] p-6 flex items-center gap-5 border border-gray-100 shadow-soft active:scale-[0.98] transition-all group"
                    >
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            {user.image_url ? (
                                <Image src={user.image_url} alt={user.name} width={80} height={80} className="object-cover" />
                            ) : (
                                <span className="text-3xl font-black text-gray-200">{user.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-black text-gray-900 truncate mb-1 tracking-tight">{user.name}</h3>
                            <div className="flex items-center gap-1.5 text-primary">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="font-black text-lg tracking-tighter">{formatActivity(user.activity)} ball</span>
                            </div>
                        </div>
                        <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center font-black text-2xl shadow-lg transition-colors ${user.rank === 1 ? 'bg-primary text-white shadow-primary/20' :
                                'bg-slate-100 text-gray-400'
                            }`}>
                            {user.rank}
                        </div>
                    </div>
                ))}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[3rem] p-8 sm:p-12 border border-gray-100 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-12">
                    <div className="space-y-1">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                            <span className="w-2 h-10 bg-primary rounded-full"></span>
                            Faollar jadvali
                        </h2>
                        {currentTime && (
                            <p className="text-sm text-gray-400 font-medium italic">
                                So'nggi yangilanish vaqti: <span className="text-gray-900 font-black not-italic">{currentTime}</span>
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                            className="flex items-center gap-4 bg-white hover:bg-slate-50 border border-gray-200 px-8 py-4 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-soft group"
                        >
                            <span className="text-gray-600 group-hover:text-primary transition-colors uppercase tracking-widest">
                                {PERIODS.find(p => p.value === period)?.label || 'Barchasi'}
                            </span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${showPeriodDropdown ? 'rotate-180 text-primary' : ''}`} />
                        </button>

                        {showPeriodDropdown && (
                            <div className="absolute top-full right-0 mt-4 w-64 bg-white border border-gray-100 rounded-[2rem] shadow-premium z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                {PERIODS.map((p) => (
                                    <button
                                        key={p.value}
                                        onClick={() => {
                                            setPeriod(p.value as any);
                                            setShowPeriodDropdown(false);
                                        }}
                                        className={`w-full text-left px-8 py-5 text-sm font-black transition-colors border-b border-gray-50 last:border-0 uppercase tracking-widest ${period === p.value ? 'text-primary bg-primary/5' : 'text-gray-400 hover:text-gray-900 hover:bg-slate-50'}`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="overflow-hidden rounded-[2rem] border border-gray-50">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left bg-slate-50/50">
                                    <th className="py-6 pl-10 font-black text-gray-400 text-[10px] uppercase tracking-[0.25em]">№</th>
                                    <th className="py-6 px-4 font-black text-gray-400 text-[10px] uppercase tracking-[0.25em]">O'quvchi</th>
                                    <th className="py-6 pr-10 text-right font-black text-gray-400 text-[10px] uppercase tracking-[0.25em]">Ball</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {otherItems.length > 0 ? (
                                    otherItems.map((user) => {
                                        const isMe = user.user_id === ratings?.me?.user_id;
                                        return (
                                            <tr
                                                key={user.user_id}
                                                className={`hover:bg-slate-50/50 transition-colors group ${isMe ? 'bg-primary/5' : ''}`}
                                            >
                                                <td className="py-7 pl-10 text-gray-400 font-black group-hover:text-primary transition-colors text-lg tracking-tight">#{user.rank}</td>
                                                <td className="py-7 px-4">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0 transition-all group-hover:scale-110 group-hover:shadow-soft">
                                                            {user.image_url ? (
                                                                <Image src={user.image_url} alt={user.name} width={56} height={56} className="object-cover" />
                                                            ) : (
                                                                <span className="text-lg font-black text-gray-200 group-hover:text-primary">{user.name.charAt(0)}</span>
                                                            )}
                                                        </div>
                                                        <span className={`font-black text-lg tracking-tight ${isMe ? 'text-primary' : 'text-gray-900 group-hover:text-primary'} transition-colors`}>{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-7 pr-10 text-right">
                                                    <div className="flex items-center justify-end gap-2 text-primary font-black text-2xl tracking-tighter">
                                                        <Star className="w-5 h-5 fill-current" />
                                                        {formatActivity(user.activity)}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-24 text-center text-gray-300 font-bold italic">Boshqa ishtirokchilar topilmadi</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full"></div>
                            <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary relative z-10"></div>
                        </div>
                        <p className="text-gray-400 text-sm font-black tracking-[0.3em] animate-pulse uppercase">Yuklanmoqda</p>
                    </div>
                </div>
            )}
        </div>
    );
}
