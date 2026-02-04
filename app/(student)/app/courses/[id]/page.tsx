'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services/mobile-api';
import { MobileCourseRes } from '@/types/mobile-api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

export default function CourseDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [course, setCourse] = useState<MobileCourseRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        async function fetchCourse() {
            try {
                setLoading(true);
                const data = await courseService.getById(id);
                setCourse(data);
            } catch (err: any) {
                console.error('Failed to fetch course:', err);
                setError(err.message || 'Kurs ma’lumotlarini yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <div className="bg-red-50 border border-red-100 rounded-3xl p-8 mb-8">
                    <p className="text-red-600 font-bold mb-2">Xatolik!</p>
                    <p className="text-red-500">{error || 'Kurs topilmadi'}</p>
                </div>
                <Link href="/app/courses" className="inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
                    <span>&larr;</span> <span>Kurslarga qaytish</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20">
            <Link href="/app/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold transition-all">
                <span>&larr;</span> <span>Kurslarga qaytish</span>
            </Link>

            {/* Course Header */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative aspect-video lg:aspect-square bg-slate-100">
                        <img
                            src={course.image_url || '/course-placeholder.jpg'}
                            alt={course.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 left-6">
                            <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest backdrop-blur-md ${course.has_access ? 'bg-green-600/90 text-white' : 'bg-primary-600/90 text-white'}`}>
                                {course.has_access ? 'Sizda ruxsat bor' : 'Ruxsat yo‘q'}
                            </span>
                        </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-6 leading-tight">{course.name}</h1>
                        <p className="text-slate-500 text-lg mb-8 leading-relaxed italic">{course.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Darslar</p>
                                <p className="text-xl font-black text-slate-800">{course.lessons}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Muddati</p>
                                <p className="text-xl font-black text-slate-800">{course.duration} kun</p>
                            </div>
                        </div>

                        {!course.has_access && (
                            <Link href="/app/tariffs" className="w-full py-4 bg-primary-600 text-white text-center rounded-2xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 hover:-translate-y-1 transition-all">
                                Kursni sotib olish
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Modules & Lessons List */}
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-slate-800">Kurs rejasi</h2>

                {course.modules && course.modules.length > 0 ? (
                    <div className="grid gap-6">
                        {course.modules
                            .sort((a, b) => a.order_num - b.order_num)
                            .map((module) => (
                                <div key={module.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                                        <h3 className="font-black text-slate-800">{module.name}</h3>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {module.lessons
                                            .sort((a, b) => a.order_num - b.order_num)
                                            .map((lesson) => (
                                                <div key={lesson.id} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                                                            {lesson.order_num}. {lesson.name}
                                                        </h4>
                                                    </div>
                                                    <div>
                                                        {course.has_access || lesson.is_public ? (
                                                            <Link
                                                                href={`/app/lessons/${lesson.id}`}
                                                                className="px-6 py-2 bg-primary-50 text-primary-600 rounded-xl text-sm font-bold shadow-sm hover:bg-primary-600 hover:text-white transition-all active:scale-95"
                                                            >
                                                                {lesson.is_completed ? 'Ko‘rilgan' : 'Boshlash'}
                                                            </Link>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-300 opacity-60">
                                                                <span className="text-xs font-bold uppercase tracking-widest">Yopiq</span>
                                                                <span>🔒</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="bg-slate-50 rounded-3xl p-12 text-center border border-slate-100">
                        <p className="text-slate-400">Tez kunda yangi darslar yuklanadi.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

