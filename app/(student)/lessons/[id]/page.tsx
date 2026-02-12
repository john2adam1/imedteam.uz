'use client';

import { useEffect, useState } from 'react';
import { lessonService, activityService } from '@/services';
import { SourceLessonMobileRes } from '@/types/mobile-api';
import { useRouter, useParams } from 'next/navigation';
import { Play, FileText, ClipboardList, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getYoutubeEmbedUrl } from '@/lib/utils';

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
            const data = await lessonService.getLessonById(id);
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

            // Navigate back
            router.back();
        } catch (err) {
            console.error('Failed to end lesson:', err);
            router.back();
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-medium">Dars yuklanmoqda...</p>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center px-6">
                <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-10 mb-8">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-primary font-black mb-2 uppercase tracking-widest text-sm">Xatolik yuz berdi</p>
                    <p className="text-gray-500 font-medium">{error || 'Dars topilmadi'}</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 text-primary font-black hover:gap-3 transition-all uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={16} /> Orqaga qaytish
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-400 font-bold hover:text-primary transition-all group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Orqaga qaytish
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full w-fit">
                            DARS {lesson.order_num < 10 ? `0${lesson.order_num}` : lesson.order_num}
                        </span>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-tight">
                            {lesson.name}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Video and Completion */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Video Player */}
                    {lesson.videos && lesson.videos.length > 0 ? (
                        <div className="space-y-6">
                            {lesson.videos.map((v, idx) => (
                                <div key={v.id} className="group">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                            <Play size={14} fill="currentColor" />
                                        </div>
                                        <h3 className="font-bold text-gray-900">
                                            {lesson.videos.length > 1 ? `${idx + 1}-video lavha` : 'Video darslik'}
                                        </h3>
                                    </div>
                                    <div className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-primary/20 transition-all duration-500">
                                        <iframe
                                            src={getYoutubeEmbedUrl(v.url)}
                                            className="w-full h-full border-none"
                                            allowFullScreen
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                            <Play size={48} className="mb-4 opacity-20" />
                            <p className="font-medium italic">Ushbu darsda video mavjud emas</p>
                        </div>
                    )}

                    {/* Completion Card */}
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-soft flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>

                        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <CheckCircle2 size={40} />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Darsni yakunladingizmi?</h3>
                            <p className="text-gray-500 font-medium">Agar mavzuni to'liq o'zlashtirgan bo'lsangiz, tugmani bosing va keyingi bosqichga o'ting.</p>
                        </div>

                        <button
                            onClick={handleEndLesson}
                            className="px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95 uppercase tracking-widest text-sm shrink-0"
                        >
                            Tugatish
                        </button>
                    </div>
                </div>

                {/* Sidebar: Documents and Tests */}
                <div className="space-y-8">
                    {/* Documents Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <FileText size={20} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Materiallar</h3>
                        </div>

                        {lesson.documents && lesson.documents.length > 0 ? (
                            <ul className="space-y-3">
                                {lesson.documents.map((doc) => (
                                    <li key={doc.id}>
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 line-clamp-1">{doc.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 font-medium italic py-4 text-center">Qo‘shimcha materiallar yo‘q.</p>
                        )}
                    </div>

                    {/* Tests Card */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                                <ClipboardList size={20} />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Testlar</h3>
                        </div>

                        {lesson.tests && lesson.tests.length > 0 ? (
                            <ul className="space-y-3">
                                {lesson.tests.map((test) => (
                                    <li key={test.id}>
                                        <a
                                            href={test.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-amber-100 hover:bg-amber-50/30 transition-all group"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                                                <ClipboardList size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 line-clamp-1">{test.name}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 font-medium italic py-4 text-center">Ushbu darsda testlar mavjud emas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

