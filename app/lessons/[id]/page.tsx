'use client';

import { useEffect, useState } from 'react';
import { lessonService, activityService } from '@/services/mobile-api';
import { SourceLessonMobileRes } from '@/types/mobile-api';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

function LessonContent({ params }: { params: { id: string } }) {
    const [lesson, setLesson] = useState<SourceLessonMobileRes | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [startTime] = useState(Date.now());
    const router = useRouter();

    useEffect(() => {
        fetchLesson();
    }, [params.id]);

    const fetchLesson = async () => {
        try {
            const data = await lessonService.getById(params.id);
            setLesson(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load lesson');
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
                course_id: lesson.course_id,
                lesson_id: lesson.id,
                duration,
            });

            // Mark lesson as ended
            await lessonService.endLesson(lesson.id);

            // Navigate back to course
            router.push(`/courses/${lesson.course_id}`);
        } catch (err) {
            console.error('Failed to end lesson:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading lesson...</p>
                </div>
            </div>
        );
    }

    if (error || !lesson) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
                    <p className="text-red-700">{error || 'Lesson not found'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Lesson Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.name}</h1>
                    {lesson.course_name && (
                        <p className="text-blue-600 font-semibold">{lesson.course_name}</p>
                    )}
                    {lesson.description && (
                        <p className="text-gray-600 mt-4">{lesson.description}</p>
                    )}
                </div>

                {/* Video Player */}
                {lesson.video_url && (
                    <div className="bg-black rounded-lg overflow-hidden mb-6">
                        <video
                            controls
                            className="w-full"
                            src={lesson.video_url}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                )}

                {/* PDF Viewer */}
                {lesson.pdf_url && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Course Materials</h2>
                        <a
                            href={lesson.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Download PDF
                        </a>
                    </div>
                )}

                {/* Complete Lesson Button */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={() => router.push(`/courses/${lesson.course_id}`)}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Back to Course
                    </button>
                    <button
                        onClick={handleEndLesson}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Complete Lesson
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function LessonPage({ params }: { params: { id: string } }) {
    return (
        <ProtectedRoute>
            <LessonContent params={params} />
        </ProtectedRoute>
    );
}
