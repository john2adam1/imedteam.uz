'use client';

import { useEffect, useState } from 'react';
import { lessonService, activityService } from '@/services';
import { SourceLessonMobileRes, SourceMobile } from '@/types/mobile-api';
import { useRouter, useParams } from 'next/navigation';
import { Play, FileText, ClipboardList, ArrowLeft, CheckCircle2, Youtube, AlertCircle } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import PDFViewer from '@/components/ui/PDFViewer';
import confetti from 'canvas-confetti';
import dynamic from 'next/dynamic';
import 'plyr-react/plyr.css';
import { useAuth } from '@/lib/auth-context';
import VideoEditModal from '@/components/student/VideoEditModal';
import { Settings, Edit3 } from 'lucide-react';

const Plyr = dynamic<any>(() => import('plyr-react').then((mod) => mod.Plyr as any), { ssr: false });

const getYoutubeId = (url: string = '') => {
    if (!url) return '';
    try {
        const urlObj = new URL(url.includes('://') ? url : `https://${url}`);
        if (urlObj.hostname === 'youtu.be') return urlObj.pathname.slice(1).split(/[?#]/)[0];
        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.pathname.includes('/watch')) return urlObj.searchParams.get('v') || '';
            if (urlObj.pathname.includes('/shorts/')) return urlObj.pathname.split('/shorts/')[1].split(/[?#]/)[0];
            if (urlObj.pathname.includes('/embed/')) return urlObj.pathname.split('/embed/')[1].split(/[?#]/)[0];
        }
    } catch (e) {
        // Fallback for non-standard formats
        if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split(/[?#]/)[0];
        if (url.includes('v=')) return url.split('v=')[1].split(/[&?#]/)[0];
    }
    return '';
};

// Static Plyr options to prevent re-initialization on every render
const YOUTUBE_OPTIONS = {
    youtube: { noCookie: false, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
    settings: ['quality', 'speed'],
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen']
};

const SERVER_OPTIONS = {
    controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
    settings: ['quality', 'speed'],
};

// Separate components to isolate lifecycle and prevent provider switching crashes
const YoutubePlayer = ({ v, onFallback }: { v: SourceMobile, onFallback: () => void }) => {
    const ytid = getYoutubeId(v.url);
    if (!ytid) return null;

    return (
        <Plyr
            source={{
                type: 'video',
                sources: [{ src: ytid, provider: 'youtube' }],
            }}
            options={YOUTUBE_OPTIONS}
            onReady={(plyr: any) => {
                plyr.on('error', () => {
                    console.log("YouTube error detected, triggering fallback...");
                    onFallback();
                });
            }}
        />
    );
};

const ServerPlayer = ({ v }: { v: SourceMobile }) => {
    if (!v.video_url) return null;

    return (
        <Plyr
            source={{
                type: 'video',
                sources: [{ src: getMediaUrl(v.video_url), type: 'video/mp4' }],
            }}
            options={SERVER_OPTIONS}
        />
    );
};

export default function LessonPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const { user: authUser } = useAuth();
    const [lesson, setLesson] = useState<SourceLessonMobileRes | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [startTime] = useState(Date.now());
    const [viewPdf, setViewPdf] = useState<{ url: string; name: string } | null>(null);
    const [editingVideo, setEditingVideo] = useState<SourceMobile | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [videoFallbackMap, setVideoFallbackMap] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!id) return;
        fetchLesson();
    }, [id]);

    // Automatic YouTube accessibility check
    useEffect(() => {
        if (lesson?.videos) {
            const img = new Image();
            img.src = `https://www.youtube.com/favicon.ico?t=${Date.now()}`;
            img.onerror = () => {
                console.log("YouTube potentially blocked, triggering fallbacks");
                const fallbacks: Record<string, boolean> = {};
                lesson.videos?.forEach(v => {
                    if (v.video_url) fallbacks[v.id] = true;
                });
                setVideoFallbackMap(prev => ({ ...prev, ...fallbacks }));
            };
        }
    }, [lesson]);

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
            // Trigger Joy Animation (Dice)
            const duration = 3 * 1000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#800000', '#FFD700']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#800000', '#FFD700']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Calculate duration in seconds
            const studyDuration = Math.floor((Date.now() - startTime) / 1000);

            // Track activity
            await activityService.create({
                activity: studyDuration,
            });

            // Mark lesson as ended
            await lessonService.endLesson(lesson.id);

            // Short delay for animation to be seen
            setTimeout(() => {
                router.back();
            }, 1500);
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

            {/* PDF Viewer Modal */}
            {viewPdf && (
                <PDFViewer
                    url={viewPdf.url}
                    name={viewPdf.name}
                    onClose={() => setViewPdf(null)}
                />
            )}

            {/* Video Edit Modal */}
            {editingVideo && (
                <VideoEditModal
                    isOpen={!!editingVideo}
                    onClose={() => setEditingVideo(null)}
                    video={editingVideo}
                    onSuccess={fetchLesson}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Main Content: Video and Completion */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Video Player */}
                    {lesson.videos && lesson.videos.length > 0 ? (
                        <div className="space-y-6">
                            {lesson.videos.map((v, idx) => {
                                const useYoutube = v.url && !videoFallbackMap[v.id];
                                const hasServerFallback = !!v.video_url;

                                return (
                                    <div key={v.id} className="group">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                                    <Play size={14} fill="currentColor" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <h3 className="font-bold text-gray-900">
                                                        {lesson.videos.length > 1 ? `${idx + 1}-video lavha` : 'Video darslik'}
                                                    </h3>
                                                    {useYoutube ? (
                                                        <span className="text-[10px] text-red-600 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                            <Youtube size={10} /> YouTube orqali yuklanmoqda
                                                        </span>
                                                    ) : hasServerFallback ? (
                                                        <span className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                            <CheckCircle2 size={10} /> Server orqali yuklandi (Fallback)
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                            <AlertCircle size={10} /> Video manbasi topilmadi
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingVideo(v)}
                                                    className="p-2.5 rounded-xl bg-slate-50 text-gray-400 hover:text-primary hover:bg-primary/5 transition-all group/edit"
                                                    title="Videoni tahrirlash"
                                                >
                                                    <Edit3 size={18} className="group-hover/edit:rotate-12 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                        <div
                                            className="aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 group-hover:ring-primary/20 transition-all duration-500 relative [&_.plyr]:h-full [&_.plyr]:w-full [&_.plyr__video-wrapper]:h-full"
                                            onContextMenu={(e) => e.preventDefault()}
                                        >
                                            {isMounted && (
                                                <div key={`${v.id}-${useYoutube ? 'yt' : 'srv'}`} className="w-full h-full">
                                                    {useYoutube ? (
                                                        <YoutubePlayer v={v} onFallback={() => setVideoFallbackMap(prev => ({ ...prev, [v.id]: true }))} />
                                                    ) : (
                                                        <ServerPlayer v={v} />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="aspect-video bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
                            <Play size={48} className="mb-4 opacity-20" />
                            <p className="font-medium italic">Ushbu darsda video mavjud emas</p>
                        </div>
                    )}
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
                                        <button
                                            onClick={() => setViewPdf({ url: getMediaUrl(doc.url), name: doc.name })}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                                                <FileText size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 line-clamp-1">{doc.name}</span>
                                        </button>
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
                                        <button
                                            onClick={() => setViewPdf({ url: getMediaUrl(test.url), name: test.name })}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-amber-100 hover:bg-amber-50/30 transition-all group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                                                <ClipboardList size={16} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 line-clamp-1">{test.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400 font-medium italic py-4 text-center">Ushbu darsda testlar mavjud emas.</p>
                        )}
                    </div>



                    {/* Completion Card (Relocated to Sidebar) */}
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                                <CheckCircle2 size={32} />
                            </div>

                            <h3 className="text-lg font-black text-gray-900 tracking-tight leading-tight">Darsni yakunladingizmi?</h3>
                            <p className="text-xs text-gray-500 font-medium">Mavzuni to'liq o'zlashtirgan bo'lsangiz, tugmani bosing.</p>

                            <button
                                onClick={handleEndLesson}
                                className="w-full py-4 bg-primary text-white rounded-xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95 uppercase tracking-widest text-xs"
                            >
                                Tugatish
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

