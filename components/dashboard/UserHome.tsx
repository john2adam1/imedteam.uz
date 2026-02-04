'use client';

import { useEffect, useState } from 'react';
import { bannerService, courseService, subjectService, notificationService } from '@/services/mobile-api';
import { BannerMobile, CourseMobileRes, Subject, UserNotification } from '@/types/mobile-api';
import Link from 'next/link';

export default function UserHome() {
    const [banners, setBanners] = useState<BannerMobile[]>([]);
    const [courses, setCourses] = useState<CourseMobileRes[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [notifications, setNotifications] = useState<UserNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);
                const [bannerData, courseData, subjectData, notificationData] = await Promise.all([
                    bannerService.getAll(),
                    courseService.getAll(),
                    subjectService.getAll(),
                    notificationService.getAll({ limit: 3 } as any)
                ]);
                setBanners(bannerData.banners || []);
                setCourses((courseData.courses || []).slice(0, 6));
                setSubjects(subjectData.subjects || []);
                setNotifications(notificationData.notifications || []);
            } catch (error: any) {
                console.error('Failed to load dashboard data:', error);
                setError(error.message || 'Ma’lumotlarni yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20 min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center my-10">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                >
                    Qayta urinish
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            {/* Banners */}
            {banners.length > 0 && (
                <section>
                    <div className="grid gap-6">
                        {banners.map((banner) => (
                            <div key={banner.id} className="relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[3/1] bg-slate-200 group">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                                    <div className="text-white max-w-xl">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h3>
                                        <p className="text-white/80 line-clamp-2">{banner.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Subjects/Categories */}
            {subjects.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Yo‘nalishlar</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {subjects.map((subject) => (
                            <button key={subject.id} className="flex-shrink-0 px-8 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary-500 hover:shadow-md transition-all active:scale-95">
                                <span className="font-semibold text-slate-700">{subject.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Notifications Preview */}
            {notifications.length > 0 && (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Bildirishnomalar</h2>
                        <Link href="/app/notifications" className="text-primary-600 font-semibold hover:text-primary-700 transition">
                            Hammasi
                        </Link>
                    </div>
                    <div className="grid gap-4">
                        {notifications.map((notif) => (
                            <Link key={notif.id} href="/app/notifications" className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notif.is_read ? 'bg-slate-200' : 'bg-primary-600 animate-pulse'}`} />
                                <div>
                                    <h4 className={`font-bold text-slate-800 ${notif.is_read ? 'font-medium' : ''}`}>{notif.title}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-1">{notif.message}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Popular Courses */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Ommabop kurslar</h2>
                    <Link href="/app/courses" className="text-primary-600 font-semibold hover:text-primary-700 transition">
                        Barchasini ko‘rish
                    </Link>
                </div>

                {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <Link key={course.id} href={`/app/courses/${course.id}`} className="group">
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group-hover:-translate-y-1">
                                    <div className="aspect-video relative bg-slate-200">
                                        <img
                                            src={course.image_url || '/course-placeholder.jpg'}
                                            alt={course.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-primary-600/90 backdrop-blur px-2 py-1 rounded-md">
                                                {course.teacher_name || 'Kurs'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                            {course.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                                            {course.description}
                                        </p>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Holati</span>
                                                <span className="font-bold text-slate-900">
                                                    {course.is_public ? 'Ochiq' : 'Yopiq'}
                                                </span>
                                            </div>
                                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-12 text-center">
                        <p className="text-slate-500">Hozircha kurslar mavjud emas.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
