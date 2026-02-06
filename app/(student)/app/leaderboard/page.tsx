'use client';

import { useEffect, useState } from 'react';
import { ratingService } from '@/services';
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
        <div style={{ padding: '20px' }}>
            <h1>Liderlar jadvali</h1>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', overflowX: 'auto', padding: '10px 0' }}>
                {periods.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setPeriod(p.id as any)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: period === p.id ? '#007bff' : '#f8f9fa',
                            color: period === p.id ? 'white' : 'black',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Current User Rank */}
            {ratings?.me && (
                <div style={{
                    border: '2px solid #007bff',
                    padding: '20px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    backgroundColor: '#e7f1ff'
                }}>
                    <h3>Your Rank: #{ratings.me.rank}</h3>
                    <p>Name: {ratings.me.name}</p>
                    <p>Points: {ratings.me.activity}</p>
                </div>
            )}

            {/* Top Users List */}
            <div style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                {ratings?.items && ratings.items.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc', textAlign: 'left' }}>
                                <th style={{ padding: '10px' }}>Rank</th>
                                <th style={{ padding: '10px' }}>Name</th>
                                <th style={{ padding: '10px' }}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ratings.items.map((learner) => (
                                <tr
                                    key={learner.user_id}
                                    style={{
                                        borderBottom: '1px solid #eee',
                                        backgroundColor: learner.user_id === ratings.me?.user_id ? '#f0f7ff' : 'transparent'
                                    }}
                                >
                                    <td style={{ padding: '10px' }}>#{learner.rank}</td>
                                    <td style={{ padding: '10px' }}>
                                        {learner.name}
                                        {learner.user_id === ratings.me?.user_id && <span style={{ marginLeft: '10px', fontSize: '10px', color: '#007bff' }}>(You)</span>}
                                    </td>
                                    <td style={{ padding: '10px' }}>{learner.activity} ball</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <p>Ushbu davr uchun ma'lumotlar mavjud emas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

