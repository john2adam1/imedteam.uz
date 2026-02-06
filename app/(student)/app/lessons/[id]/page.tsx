'use client';

import { useEffect, useState } from 'react';
import { lessonService, activityService } from '@/services';
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
        <div style={{ padding: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <button onClick={() => router.back()} style={{ marginBottom: '10px' }}>&larr; Orqaga</button>
                    <h1>{lesson.name}</h1>
                </div>
                <div style={{ padding: '5px 10px', backgroundColor: '#eee', borderRadius: '4px', fontSize: '12px' }}>
                    Dars #{lesson.order_num}
                </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                <div style={{ flex: '2 1 500px' }}>
                    {/* Video Player Section */}
                    {lesson.videos && lesson.videos.length > 0 && (
                        <div style={{ marginBottom: '30px' }}>
                            <h3>Videolar</h3>
                            {lesson.videos.map((v) => (
                                <div key={v.id} style={{ marginBottom: '20px', backgroundColor: 'black', aspectRatio: '16/9' }}>
                                    <iframe
                                        src={v.url}
                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                        allowFullScreen
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Completion Action */}
                    <div style={{ padding: '30px', backgroundColor: '#007bff', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
                        <h3>Darsni yakunladingizmi?</h3>
                        <p>Agar darsni ko‘rib bo‘lgan bo‘lsangiz, tugmani bosing.</p>
                        <button
                            onClick={handleEndLesson}
                            style={{ padding: '10px 30px', backgroundColor: 'white', color: '#007bff', border: 'none', fontWeight: 'bold' }}
                        >
                            Tugatish
                        </button>
                    </div>
                </div>

                <div style={{ flex: '1 1 250px' }}>
                    {/* Documents */}
                    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                        <h3>Materiallar</h3>
                        {lesson.documents && lesson.documents.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {lesson.documents.map((doc) => (
                                    <li key={doc.id} style={{ marginBottom: '10px' }}>
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ccc', textDecoration: 'none', color: 'black' }}>
                                            📄 {doc.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ color: '#999', fontStyle: 'italic' }}>Qo‘shimcha materiallar yo‘q.</p>
                        )}
                    </div>

                    {/* Tests */}
                    {lesson.tests && lesson.tests.length > 0 && (
                        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                            <h3>Testlar</h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {lesson.tests.map((test) => (
                                    <li key={test.id} style={{ marginBottom: '10px' }}>
                                        <a href={test.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '10px', backgroundColor: '#e9ecef', border: '1px solid #ccc', textDecoration: 'none', color: 'black' }}>
                                            📝 {test.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

