'use client';

import { useEffect, useState } from 'react';
import { bannerService, courseService, subjectService, notificationService } from '@/services';
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
                    bannerService.getBanners(),
                    courseService.getCourses(),
                    subjectService.getAll(),
                    notificationService.getNotifications({ limit: 3 } as any)
                ]);

                // Helper to extract array from various potential formats
                const getArray = (data: any, key: string) => {
                    if (Array.isArray(data)) return data;
                    if (data && typeof data === 'object') return data[key] || data.items || [];
                    return [];
                };

                setBanners(getArray(bannerData, 'banners'));
                setCourses(getArray(courseData, 'courses').slice(0, 6));
                setSubjects(getArray(subjectData, 'subjects'));
                setNotifications(getArray(notificationData, 'notifications'));
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', paddingBottom: '40px' }}>
            {/* Banners */}
            {banners.length > 0 && (
                <section>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {banners.map((banner) => (
                            <div key={banner.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#eee' }}>
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    style={{ width: '100%', display: 'block' }}
                                />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'rgba(0,0,0,0.6)', color: 'white' }}>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{banner.title}</h3>
                                    <p style={{ margin: 0, fontSize: '14px' }}>{banner.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Subjects/Categories */}
            {subjects.length > 0 && (
                <section>
                    <h2 style={{ marginBottom: '15px' }}>Yo‘nalishlar</h2>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                        {subjects.map((subject) => (
                            <button key={subject.id} style={{ whiteSpace: 'nowrap', padding: '10px 20px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer' }}>
                                {subject.name}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            {/* Notifications Preview */}
            {notifications.length > 0 && (
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h2>Bildirishnomalar</h2>
                        <Link href="/app/notifications">Hammasi</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {notifications.map((notif) => (
                            <Link key={notif.id} href="/app/notifications" style={{ textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: notif.is_read ? '#ccc' : '#007bff' }} />
                                <div>
                                    <h4 style={{ margin: 0 }}>{notif.title}</h4>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{notif.message}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Popular Courses */}
            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h2>Ommabop kurslar</h2>
                    <Link href="/app/courses">Barchasini ko‘rish</Link>
                </div>

                {courses.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {courses.map((course) => (
                            <Link key={course.id} href={`/app/courses/${course.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ position: 'relative' }}>
                                        <img
                                            src={course.image_url || '/course-placeholder.jpg'}
                                            alt={course.name}
                                            style={{ width: '100%', display: 'block' }}
                                        />
                                        <span style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(0,123,255,0.8)', color: 'white', padding: '2px 8px', fontSize: '10px', borderRadius: '4px' }}>
                                            {course.teacher_name || 'Kurs'}
                                        </span>
                                    </div>
                                    <div style={{ padding: '15px' }}>
                                        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{course.name}</h3>
                                        <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666' }}>{course.description}</p>
                                        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ fontSize: '12px' }}>Holati: <b>{course.is_public ? 'Ochiq' : 'Yopiq'}</b></span>
                                            <span>&rarr;</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', border: '1px solid #ccc', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                        <p>Hozircha kurslar mavjud emas.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
