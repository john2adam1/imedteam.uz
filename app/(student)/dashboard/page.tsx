'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    courseService,
    bannerService,
    notificationService,
    activityService,
    ratingService
} from '@/services';
import { useRouter } from 'next/navigation';
import { Bell, Sun, Trophy, BookOpen, Clock, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import BannerSlider from '@/components/student/BannerSlider';
import { cn } from '@/lib/utils';

export default function AppHome() {
    const { user: authUser } = useAuth();
    const [userCourses, setUserCourses] = useState<{ user_courses: any[], count: number }>({ user_courses: [], count: 0 });
    const [banners, setBanners] = useState<{ banners: any[], count: number }>({ banners: [], count: 0 });
    const [activity, setActivity] = useState<any>(null);
    const [rating, setRating] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);

            // Fetch data individually to avoid total failure if one endpoint is down
            const fetchData = async (serviceMethod: () => Promise<any>, stateSetter: (data: any) => void, label: string) => {
                try {
                    const data = await serviceMethod();
                    if (data) stateSetter(data);
                } catch (error) {
                    console.error(`Failed to load ${label}:`, error);
                }
            };

            // Using allSettled to ensure we try to load everything even if some fail
            await Promise.allSettled([
                fetchData(() => courseService.getUserCourses(), setUserCourses, 'user courses'),
                fetchData(() => bannerService.getBanners(), setBanners, 'banners'),
                fetchData(() => activityService.getStats({ type: 'year' }), setActivity, 'activity'),
                fetchData(() => ratingService.getRating(), setRating, 'rating')
            ]);

            setLoading(false);
        };

        loadDashboardData();
    }, []);

    // Memoize the derived statistics
    const stats = useMemo(() => {
        if (!userCourses?.user_courses) return { enrolled: 0, completed: 0 };
        const courses = userCourses.user_courses;
        return {
            enrolled: userCourses.count || courses.length,
            completed: courses.reduce((acc: number, c: any) => acc + (c.completed_lessons || 0), 0)
        };
    }, [userCourses]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse text-sm uppercase tracking-widest">Ma'lumotlar yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="animate-in fade-in slide-in-from-left duration-700">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        {authUser?.name ? `Assalomu alaykum, ${authUser.name}!` : 'Xush kelibsiz!'}
                    </h1>
                    <p className="text-lg text-gray-500 mt-2 font-medium italic">Bugun yangi bilimlar olish uchun ajoyib kun!</p>
                </div>
                <div className="flex items-center gap-4">
                </div>
            </div>

            {/* Banners Section - Prominent & Visual */}
            {(banners?.banners && banners.banners.length > 0) ? (
                <div className="animate-in fade-in zoom-in duration-700">
                    <BannerSlider banners={banners.banners} />
                </div>
            ) : (
                <div className="hidden">No banners available in the data</div>
            )}

            {/* Statistics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft hover:shadow-premium transition-all duration-500 group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner shadow-primary/5">
                            <BookOpen size={24} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">O'qilayotgan kurslar</p>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-black text-gray-900 tracking-tighter">{stats.enrolled}</p>
                        <p className="text-xs font-bold text-gray-400 mb-2">ta kurs</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft hover:shadow-premium transition-all duration-500 group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform shadow-inner shadow-emerald-500/5">
                            <Clock size={24} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Tugatilgan darslar</p>
                    </div>
                    <div className="flex items-end justify-between">
                        <p className="text-5xl font-black text-gray-900 tracking-tighter">{stats.completed}</p>
                        <p className="text-xs font-bold text-gray-400 mb-2">ta dars</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-soft hover:shadow-premium transition-all duration-500 group">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform shadow-inner shadow-yellow-500/5">
                            <Trophy size={24} />
                        </div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Platforma reytingi</p>
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-5xl font-black text-gray-900 tracking-tighter">
                                {rating?.me?.activity || 0}
                            </p>
                            <span className="text-3xl text-yellow-500 drop-shadow-sm">★</span>
                        </div>
                        <p className="text-xs font-bold text-gray-400 mb-2">ball</p>
                    </div>
                </div>
            </div>

            {/* My Courses Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <span className="w-2 h-8 bg-primary rounded-full"></span>
                        Mening kurslarim
                    </h2>
                    <button
                        onClick={() => router.push('/courses')}
                        className="group flex items-center gap-2 text-sm font-black text-primary hover:gap-3 transition-all uppercase tracking-widest"
                    >
                        Barchasini ko'rish <ChevronRight size={18} />
                    </button>
                </div>

                {userCourses?.user_courses?.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {userCourses.user_courses.slice(0, 4).map((course: any) => (
                            <div
                                key={course.id}
                                className="group bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-soft hover:shadow-premium transition-all duration-500 cursor-pointer hover:-translate-y-2 flex flex-col"
                                onClick={() => router.push(`/courses/${course.course_id}`)}
                            >
                                <div className="aspect-[16/10] bg-slate-50 rounded-3xl mb-6 overflow-hidden relative ring-1 ring-gray-100">
                                    {course.course_image_url ? (
                                        <img
                                            src={course.course_image_url}
                                            alt={course.course_name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250/800000/FFFFFF?text=KURS';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-card group-hover:scale-110 transition-transform duration-500">
                                                <Play size={32} className="text-primary/20" fill="currentColor" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-black text-gray-900 mb-3 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                                    {course.course_name}
                                </h3>

                                <div className="space-y-4 mt-auto">
                                    <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden shadow-inner relative">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-1000 shadow-lg shadow-primary/20"
                                            style={{ width: `${course.percentage || 0}%` }}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest",
                                                (course.percentage || 0) > 55 ? "text-white" : "text-primary"
                                            )}>
                                                {Math.round(course.percentage || 0)}% TUGATILDI
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        <span>{course.completed_lessons || 0} DARS</span>
                                        <span>{course.total_lessons || 0} JAMI</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-center animate-in fade-in duration-1000">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-card text-4xl grayscale opacity-30">
                            📚
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">Kurslar topilmadi</h3>
                        <p className="text-gray-400 font-medium max-w-sm mb-10 leading-relaxed px-6">
                            Siz hali hech qaysi kursga a'zo bo'lmagansiz. Hozirgi kurslarni ko'rib chiqing va o'rganishni boshlang!
                        </p>
                        <button
                            onClick={() => router.push('/courses')}
                            className="px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
                        >
                            Kurslarni ko'rish
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
