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
                // Load all data in parallel
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
                setCourses(coursesData);
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
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="mt-4 text-slate-600">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-slate-900">iMed Team</h1>
                            <span className="text-sm text-slate-500">Asosiy sahifa</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 rounded-lg hover:bg-slate-100">
                                <span className="text-xl">🔔</span>
                                {notifications?.notifications?.filter((n: any) => !n.is_read).length > 0 && (
                                    <span className="absolute -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {notifications.notifications.filter((n: any) => !n.is_read).length}
                                    </span>
                                )}
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Xush kelibsiz, {user?.name}! 👋
                    </h2>
                    <p className="text-slate-600">
                        Tibbiyot bo'yicha o'qishni davom ettiring
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <span className="text-2xl">📚</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Kurslar</p>
                                <p className="text-2xl font-bold text-slate-900">{courses?.count || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <span className="text-2xl">✅</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Tamomlangan darslar</p>
                                <p className="text-2xl font-bold text-slate-900">{activity?.completed_lessons || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <span className="text-2xl">🔥</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Seriyali kunlar</p>
                                <p className="text-2xl font-bold text-slate-900">{activity?.streak || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-slate-600">Reyting</p>
                                <p className="text-2xl font-bold text-slate-900">{rating?.rating || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banners */}
                {banners?.banners?.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">E'lonlar</h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {banners.banners.map((banner: any) => (
                                <div key={banner.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                                    <img 
                                        src={banner.image_url} 
                                        alt={banner.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="font-bold text-slate-900 mb-2">{banner.title}</h4>
                                        <p className="text-slate-600 text-sm mb-3">{banner.description}</p>
                                        <button className="text-primary font-medium text-sm hover:text-primary/80">
                                            Batafsil →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Courses */}
                {courses?.courses?.length > 0 && (
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Oxirgi kurslar</h3>
                            <button 
                                onClick={() => router.push('/app/courses')}
                                className="text-primary font-medium text-sm hover:text-primary/80"
                            >
                                Barchasini ko'rish →
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.courses.slice(0, 6).map((course: any) => (
                                <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
                                    <img 
                                        src={course.image_url} 
                                        alt={course.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h4 className="font-bold text-slate-900 mb-2">{course.name}</h4>
                                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-500">{course.teacher_name}</span>
                                            <button className="text-primary font-medium text-sm hover:text-primary/80">
                                                Boshlash →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Notifications */}
                {notifications?.notifications?.length > 0 && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Bildirishnomalar</h3>
                            <button 
                                onClick={() => router.push('/app/notifications')}
                                className="text-primary font-medium text-sm hover:text-primary/80"
                            >
                                Barchasini ko'rish →
                            </button>
                        </div>
                        <div className="space-y-3">
                            {notifications.notifications.slice(0, 5).map((notification: any) => (
                                <div 
                                    key={notification.id} 
                                    className={`bg-white rounded-lg p-4 border ${
                                        notification.is_read 
                                            ? 'border-slate-200' 
                                            : 'border-primary/20 bg-primary/5'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 mb-1">{notification.title}</h4>
                                            <p className="text-slate-600 text-sm">{notification.description}</p>
                                        </div>
                                        {!notification.is_read && (
                                            <span className="w-2 h-2 bg-primary rounded-full mt-1"></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
