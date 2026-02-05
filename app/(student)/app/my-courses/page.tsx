'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services';
import { UserCourseMobileRes } from '@/types/mobile-api';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<UserCourseMobileRes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        async function fetchUserCourses() {
            try {
                setLoading(true);
                const data = await courseService.getUserCourses();
                setCourses(data.user_courses || []);
            } catch (err: any) {
                setError(err.message || 'Kurslarni yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        }

        if (user) {
            fetchUserCourses();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mening kurslarim</h1>

            {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            )}

            {!error && (
                <>
                    {courses.length === 0 ? (
                        <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                            <p className="text-slate-500 text-lg mb-4">Sizda hali kurslar mavjud emas.</p>
                            <Link
                                href="/app/courses"
                                className="inline-flex px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition"
                            >
                                Kurs tanlash
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((uc) => (
                                <Link key={uc.id} href={`/app/courses/${uc.course_id}`} className="group">
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group-hover:-translate-y-1">
                                        <div className="aspect-video relative bg-slate-200">
                                            <img
                                                src={uc.course_image_url || '/course-placeholder.jpg'}
                                                alt={uc.course_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-green-600/90 backdrop-blur px-2 py-1 rounded-md">
                                                    Sotib olingan
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                                {uc.course_name}
                                            </h3>

                                            <div className="mt-4 mb-6">
                                                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                                                    <span>Progress</span>
                                                    <span>{uc.percentage}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary-600 transition-all duration-500"
                                                        style={{ width: `${uc.percentage}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    {uc.completed_lessons} / {uc.total_lessons} dars tugatildi
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tarif</span>
                                                    <span className="font-bold text-slate-900">
                                                        {uc.tariff_name}
                                                    </span>
                                                </div>
                                                <span className="inline-flex items-center justify-center w-24 h-10 rounded-xl bg-primary-50 text-primary-600 text-sm font-bold group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                    Davom etish
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

