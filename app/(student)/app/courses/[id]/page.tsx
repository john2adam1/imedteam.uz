'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services';
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
                const data = await courseService.getCourseById(id);
                setCourse(data);
            } catch (err: any) {
                console.error('Failed to fetch course:', err);
                setError(err.message || 'Kurs malumotlarini yuklashda xatolik yuz berdi');
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

    // ✅ CRITICAL FIX: Robust check for free course
    const isFree = !!course.is_public;
    const hasAccess = !!(course.has_access || isFree);

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Back Link */}
            <Link
                href="/app/courses"
                className="inline-flex items-center gap-2 text-gray-500 font-bold hover:text-primary transition-all mb-8 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Kurslarga qaytish
            </Link>

            {/* Course Header Card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-soft mb-12">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 aspect-[4/3] md:aspect-auto">
                        <img
                            src={course.image_url || 'https://via.placeholder.com/800x600/800000/FFFFFF?text=IMED+KURS'}
                            alt={course.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600/800000/FFFFFF?text=IMED+KURS';
                            }}
                        />
                    </div>
                    <div className="md:w-3/5 p-8 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-4">
                            {/* ✅ FIX: Show proper badge based on course type */}
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${isFree
                                ? 'bg-emerald-50 text-emerald-600'
                                : course.has_access
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-slate-50 text-slate-600'
                                }`}>
                                {isFree ? '🎁 BEPUL KURS' : course.has_access ? 'Sotib olingan' : 'Pullik kurs'}
                            </span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                            {course.name}
                        </h1>
                        <p className="text-gray-500 font-medium italic mb-8 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Darslar</span>
                                <span className="text-2xl font-black text-gray-900">{course.lessons} ta</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Muddati</span>
                                <span className="text-2xl font-black text-gray-900">{course.duration} kun</span>
                            </div>
                        </div>

                        {/* ✅ FIX: Show purchase button ONLY for paid courses without access */}
                        {!hasAccess ? (
                            <Link
                                href={`/app/tariffs?courseId=${id}`}
                                className="w-full py-5 bg-primary text-white rounded-2xl font-black text-center shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-[0.98] tracking-widest uppercase text-sm"
                            >
                                Kursni sotib olish
                            </Link>
                        ) : (
                            <div className={`flex items-center gap-3 py-4 px-6 rounded-2xl font-bold border ${isFree
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50'
                                : 'bg-primary/5 text-primary border-primary/10'
                                }`}>
                                <span className="text-xl">{isFree ? '🎁' : '✅'}</span>
                                {isFree ? 'Bepul – darhol boshlang' : 'Kirish huquqi mavjud'}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modules & Lessons List */}
            <div className="space-y-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    Kurs rejasi
                </h2>

                {course.modules && course.modules.length > 0 ? (
                    <div className="space-y-6">
                        {course.modules
                            .sort((a, b) => a.order_num - b.order_num)
                            .map((module) => (
                                <div key={module.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-soft">
                                    <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-900">{module.name}</h3>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {module.lessons.length} DARS
                                        </span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {module.lessons
                                            .sort((a, b) => a.order_num - b.order_num)
                                            .map((lesson) => {
                                                // ✅ FIX: Lesson is ALWAYS accessible if course is free
                                                const lessonAccessible = !!(hasAccess || lesson.is_public || isFree);

                                                return (
                                                    <div key={lesson.id} className="p-5 flex items-center justify-between transition-colors hover:bg-slate-50/50 group">
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs font-black text-gray-300 group-hover:text-primary/40 transition-colors">
                                                                {lesson.order_num < 10 ? `0${lesson.order_num}` : lesson.order_num}
                                                            </span>
                                                            <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">
                                                                {lesson.name}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            {lessonAccessible ? (
                                                                <Link
                                                                    href={`/app/lessons/${lesson.id}`}
                                                                    className={`px-5 py-2 rounded-xl border-2 transition-all font-bold text-xs uppercase tracking-widest ${lesson.is_completed
                                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'
                                                                        : 'bg-primary/5 text-primary border-primary/10 hover:bg-primary hover:text-white hover:border-primary'
                                                                        }`}
                                                                >
                                                                    {lesson.is_completed ? 'Korilgan' : 'Boshlash'}
                                                                </Link>
                                                            ) : (
                                                                <span className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                                    🔒 Yopiq
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                        <p className="text-gray-400 font-medium italic">Tez kunda yangi darslar yuklanadi.</p>
                    </div>
                )}
            </div>
        </div>
    );
}