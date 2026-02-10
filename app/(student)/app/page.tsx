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
import { Bell, Sun, Trophy, BookOpen, Clock, ChevronRight, Play, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AppHome() {
    const { user: authUser } = useAuth();
    const [userCourses, setUserCourses] = useState<{ user_courses: any[], count: number }>({ user_courses: [], count: 0 });
    const [banners, setBanners] = useState<{ banners: any[], count: number }>({ banners: [], count: 0 });
    const [notifications, setNotifications] = useState<{ notifications: any[], count: number }>({ notifications: [], count: 0 });
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
                fetchData(() => notificationService.getNotifications(), setNotifications, 'notifications'),
                fetchData(() => activityService.getStats(), setActivity, 'activity'),
                fetchData(() => ratingService.getRating(), setRating, 'rating')
            ]);

            setLoading(false);
        };

        loadDashboardData();
    }, []);

    // Memoize the hasUnread check
    const hasUnread = useMemo(() => {
        return notifications?.notifications?.some((n: any) => !n.is_read);
    }, [notifications]);

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
                    <button className="p-4 rounded-[1.5rem] bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 hover:shadow-premium transition-all active:scale-95 group">
                        <Sun size={22} className="group-hover:rotate-45 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={() => router.push('/app/notifications')}
                        className="p-4 rounded-[1.5rem] bg-white border border-gray-100 text-gray-400 hover:text-primary hover:border-primary/20 hover:shadow-premium transition-all relative active:scale-95 group"
                    >
                        <Bell size={22} className="group-hover:ring-offset-2 group-hover:ring-2 ring-primary/20 rounded-full transition-all" />
                        {hasUnread && (
                            <span className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full border-2 border-white animate-pulse" />
                        )}
                    </button>
                </div>
            </div>

            {/* Banners Section - Prominent & Visual */}
            {(banners?.banners && banners.banners.length > 0) ? (
                <div className="grid gap-8 overflow-hidden animate-in fade-in zoom-in duration-700">
                    {banners.banners.map((banner: any) => (
                        <div
                            key={banner.id}
                            className="relative min-h-[300px] rounded-[3rem] overflow-hidden group shadow-premium hover:shadow-2xl transition-all duration-700 cursor-pointer"
                            onClick={() => banner.link_url && window.open(banner.link_url, '_blank')}
                        >
                            {/* Background Image with Fallback */}
                            {banner.image_url ? (
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400/800000/FFFFFF?text=IMED+PLATFORMA';
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
                            )}

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 lg:p-14">
                                <div className="max-w-3xl space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                                        Yangi e'lon
                                    </div>
                                    <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                                        {banner.title}
                                    </h2>
                                    <p className="text-white/80 text-lg font-medium leading-relaxed line-clamp-2">
                                        {banner.description}
                                    </p>
                                    {banner.link_url && (
                                        <div className="pt-4">
                                            <span className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm group/btn hover:gap-4 transition-all">
                                                Batafsil bilish <ChevronRight size={18} />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Diagnostic Placeholder when no banners found but no error thrown */
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
                        <p className="text-5xl font-black text-gray-900 tracking-tighter">{userCourses?.count || 0}</p>
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
                        <p className="text-5xl font-black text-gray-900 tracking-tighter">{activity?.completed_lessons || 0}</p>
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
                            <p className="text-5xl font-black text-gray-900 tracking-tighter">{rating?.rating || 0}</p>
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
                        onClick={() => router.push('/app/courses')}
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
                                onClick={() => router.push(`/app/courses/${course.course_id}`)}
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

                                    {/* Progress Circle Top Right */}
                                    <div className="absolute top-4 right-4 w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-md shadow-card flex items-center justify-center border border-white/20">
                                        <span className="text-xs font-black text-primary">{Math.round(course.percentage || 0)}%</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black text-gray-900 mb-3 line-clamp-1 group-hover:text-primary transition-colors tracking-tight">
                                    {course.course_name}
                                </h3>

                                <div className="space-y-4 mt-auto">
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                                        <div
                                            className="bg-primary h-full rounded-full transition-all duration-1000 shadow-lg shadow-primary/20"
                                            style={{ width: `${course.percentage || 0}%` }}
                                        />
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
                    <div className="py-32 flex flex-col items-center justify-center bg-slate-50/20 rounded-[3rem] border-2 border-dashed border-gray-100 text-center animate-in fade-in duration-1000">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-card text-4xl grayscale opacity-30">
                            📚
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3">Kurslar topilmadi</h3>
                        <p className="text-gray-400 font-medium max-w-sm mb-10 leading-relaxed px-6">
                            Siz hali hech qaysi kursga a'zo bo'lmagansiz. Hozirgi kurslarni ko'rib chiqing va o'rganishni boshlang!
                        </p>
                        <button
                            onClick={() => router.push('/app/courses')}
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
