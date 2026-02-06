'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services';
import { useRouter } from 'next/navigation';

export default function CoursesPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [myCourses, setMyCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchInitialData() {
            setLoading(true);
            setError('');
            try {
                if (activeTab === 'all') {
                    const data = await courseService.getCourses();
                    if (Array.isArray(data)) {
                        setAllCourses(data);
                    } else if (data && data.courses) {
                        setAllCourses(data.courses);
                    } else {
                        setAllCourses([]);
                    }
                } else {
                    const data = await courseService.getUserCourses();
                    if (Array.isArray(data)) {
                        setMyCourses(data);
                    } else if (data && data.user_courses) {
                        setMyCourses(data.user_courses);
                    } else {
                        setMyCourses([]);
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        }

        fetchInitialData();
    }, [activeTab]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900">Kurslar</h1>

                <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Barcha kurslar
                    </button>
                    <button
                        onClick={() => setActiveTab('my')}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'my'
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Mening kurslarim
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            {activeTab === 'all' ? (
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Barcha kurslar ({allCourses.length})</h2>
                    {allCourses.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Hozircha kurslar mavjud emas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allCourses.map((course) => (
                                <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex flex-col h-full">
                                    <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                        {course.image_url ? (
                                            <img src={course.image_url} alt={course.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                <span className="text-sm">Rasm yo'q</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{course.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{course.description}</p>

                                    <div className="pt-4 border-t border-gray-100 mt-auto">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                                                    <div className="w-full h-full bg-gray-200" />
                                                </div>
                                                <span className="text-xs text-gray-600 font-medium">{course.teacher_name}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => router.push(`/app/courses/${course.id}`)}
                                            className="w-full py-2.5 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                                        >
                                            Batafsil
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Mening kurslarim ({myCourses.length})</h2>
                    {myCourses.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">Siz hali hech qaysi kursga a'zo bo'lmagansiz</p>
                            <button
                                onClick={() => setActiveTab('all')}
                                className="mt-4 text-primary-600 font-medium hover:underline"
                            >
                                Kurslarni ko'rish
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myCourses.map((course) => (
                                <div key={course.id} className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex flex-col h-full">
                                    <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-primary-600 font-bold bg-primary-50">
                                            {course.percentage || 0}%
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">{course.course_name || course.name}</h3>

                                    <div className="space-y-3 mb-6 flex-grow">
                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-primary-500 h-full rounded-full transition-all duration-300"
                                                style={{ width: `${course.percentage || 0}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            {course.completed_lessons || 0} / {course.total_lessons || 0} darslar yakunlandi
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/app/courses/${course.course_id || course.id}`)}
                                        className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors mt-auto shadow-sm shadow-primary-600/30"
                                    >
                                        Davom ettirish
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
