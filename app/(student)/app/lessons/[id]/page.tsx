'use client';

import { useEffect, useState } from 'react';
import { lessonService, activityService } from '@/services/mobile-api';
import { SourceLessonMobileRes } from '@/types/mobile-api';
import { useRouter, useParams } from 'next/navigation';

export default function LessonPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const [lesson, setLesson] = useState<SourceLessonMobileRes | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [startTime] = useState(Date.now());

    useEffect(() => {
        if (!id) return;
        fetchLesson();
    }, [id]);

    const fetchLesson = async () => {
        try {
            setIsLoading(true);
            const data = await lessonService.getById(id);
            setLesson(data);
        } catch (err: any) {
            setError(err.message || 'Dars ma’lumotlarini yuklashda xatolik yuz berdi');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEndLesson = async () => {
        if (!lesson) return;

        try {
            // Calculate duration in seconds
            const duration = Math.floor((Date.now() - startTime) / 1000);

            // Track activity
            await activityService.create({
                activity: duration,
            });

            // Mark lesson as ended
            await lessonService.endLesson(lesson.id);

            // Navigate back (or to next dars)
            router.back();
        } catch (err) {
            console.error('Failed to end lesson:', err);
            router.back();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500 font-medium">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center">
                <div className="bg-red-50 border border-red-100 rounded-3xl p-8 mb-8">
                    <p className="text-red-600 font-bold mb-2">Xatolik!</p>
                    <p className="text-red-500">{error || 'Dars topilmadi'}</p>
                </div>
                <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
                    <span>&larr;</span> <span>Orqaga qaytish</span>
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button onClick={() => router.back()} className="text-slate-400 hover:text-primary-600 font-bold mb-4 transition-colors flex items-center gap-2">
                        <span>&larr;</span> <span>Orqaga</span>
                    </button>
                    <h1 className="text-3xl font-black text-slate-800 leading-tight">{lesson.name}</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Dars #{lesson.order_num}
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    {/* Video Player Section */}
                    {lesson.videos && lesson.videos.length > 0 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-black text-slate-800">Videolar</h2>
                            <div className="grid gap-6">
                                {lesson.videos.map((v) => (
                                    <div key={v.id} className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
                                        <iframe
                                            src={v.url}
                                            className="w-full h-full"
                                            allowFullScreen
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Completion Action */}
                    <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[2.5rem] p-10 text-white shadow-xl shadow-primary-200">
                        <h3 className="text-2xl font-black mb-4">Darsni yakunladingizmi?</h3>
                        <p className="opacity-80 mb-8 max-w-md">Agar darsni ko‘rib bo‘lgan bo‘lsangiz, tugmani bosing. Bu sizning balingiz va reytingingizga ta’sir qiladi.</p>
                        <button
                            onClick={handleEndLesson}
                            className="px-10 py-4 bg-white text-primary-600 rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg"
                        >
                            Tugatish
                        </button>
                    </div>
                </div>

                <div className="space-y-10">
                    {/* Documents */}
                    <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-800 mb-6">Materiallar</h3>
                        {lesson.documents && lesson.documents.length > 0 ? (
                            <div className="grid gap-4">
                                {lesson.documents.map((doc) => (
                                    <a
                                        key={doc.id}
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all border border-transparent hover:border-primary-100 group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                            📄
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{doc.name}</p>
                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Yuklab olish</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm italic">Qo‘shimcha materiallar yo‘q.</p>
                        )}
                    </div>

                    {/* Tests */}
                    {lesson.tests && lesson.tests.length > 0 && (
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                            <h3 className="text-lg font-black text-slate-800 mb-6">Testlar</h3>
                            <div className="grid gap-4">
                                {lesson.tests.map((test) => (
                                    <a
                                        key={test.id}
                                        href={test.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-4 p-4 bg-indigo-50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm text-indigo-600">
                                            📝
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate">{test.name}</p>
                                            <p className="text-[10px] opacity-60 uppercase tracking-widest">Testni boshlash</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

