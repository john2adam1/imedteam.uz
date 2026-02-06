'use client';

import { useState, useEffect } from 'react';
import {
    courseService,
    bannerService,
    notificationService,
    profileService,
    activityService,
    ratingService
} from '@/services';
import { useRouter } from 'next/navigation';
import { Bell, Sun } from 'lucide-react';

export default function AppHome() {
    const [user, setUser] = useState<any>(null);
    const [courses, setCourses] = useState<any>(null);
    const [banners, setBanners] = useState<any>(null);
    const [notifications, setNotifications] = useState<any>(null);
    const [activity, setActivity] = useState<any>(null);
    const [rating, setRating] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [
                    userProfile,
                    coursesData,
                    bannersData,
                    notificationsData,
                    activityData,
                    ratingData
                ] = await Promise.all([
                    profileService.getUserProfile(),
                    courseService.getCourses(),
                    bannerService.getBanners(),
                    notificationService.getNotifications(),
                    activityService.getStats(),
                    ratingService.getRating()
                ]);

                setUser(userProfile);

                if (Array.isArray(coursesData)) {
                    setCourses({ courses: coursesData, count: coursesData.length });
                } else if (coursesData && coursesData.courses) {
                    setCourses(coursesData);
                } else {
                    setCourses({ courses: [], count: 0 });
                }

                setBanners(bannersData);
                setNotifications(notificationsData);
                setActivity(activityData);
                setRating(ratingData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">iMed Team Dashboard</h1>
                    <p className="text-gray-500 mt-1">Xush kelibsiz, {user?.name || 'Foydalanuvchi'}!</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                        <Sun size={20} />
                    </button>
                    <button
                        onClick={() => router.push('/app/notifications')}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors relative"
                    >
                        <Bell size={20} />
                        {notifications?.notifications?.some((n: any) => !n.is_read) && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Kurslar</p>
                    <p className="text-2xl font-bold text-gray-900">{courses?.count || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-green-600 font-medium uppercase tracking-wider mb-1">Tugatilgan</p>
                    <p className="text-2xl font-bold text-gray-900">{activity?.completed_lessons || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                    <p className="text-xs text-yellow-500 font-medium uppercase tracking-wider mb-1">Reyting</p>
                    <div className="flex items-center gap-1">
                        <span className="text-2xl font-bold text-gray-900">{rating?.rating || 0}</span>
                        <span className="text-yellow-500">★</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="space-y-8">
                {/* Banners */}
                {banners?.banners?.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900">Yangiliklar</h2>
                        <div className="grid gap-4">
                            {banners.banners.map((banner: any) => (
                                <div key={banner.id} className="relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg">
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-bold mb-2">{banner.title}</h3>
                                        <p className="text-primary-100 text-sm">{banner.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Courses */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">So'nggi kurslar</h2>
                        <button
                            onClick={() => router.push('/app/courses')}
                            className="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                            Barchasini ko'rish
                        </button>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {courses?.courses?.slice(0, 4).map((course: any) => (
                            <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push(`/app/courses/${course.id}`)}>
                                <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden">
                                    {course.image_url ? (
                                        <img src={course.image_url} alt={course.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{course.name}</h3>
                                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description}</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                                            {/* Placeholder for teacher avatar */}
                                            <div className="w-full h-full bg-gray-200" />
                                        </div>
                                        <span className="text-xs text-gray-600 font-medium">{course.teacher_name}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!courses?.courses || courses.courses.length === 0) && (
                            <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                Kurslar topilmadi
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
