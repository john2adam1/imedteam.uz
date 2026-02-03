'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services/mobile-api';
import { UserCourseMobileRes } from '@/types/mobile-api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

// We need to unwrap params in Client Components if using Next.js 13+ app dir pattern with dynamics
// But simplest way in generic client component: use `useParams` hook or `props`
// Params are passed as props to page components even in client components in Next 13/14

export default function CourseDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [course, setCourse] = useState<UserCourseMobileRes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        async function fetchCourse() {
            try {
                const data = await courseService.getById(id);
                setCourse(data);
            } catch (err: any) {
                console.error('Failed to fetch course:', err);
                setError('Failed to load course details');
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !course) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <div className="text-red-500 mb-4">{error || 'Course not found'}</div>
                <Link href="/courses" className="text-blue-600 hover:scale-105 transition-transform inline-block">
                    &larr; Back to Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Link href="/courses" className="text-gray-500 hover:text-blue-600 mb-6 inline-block transition-colors">
                &larr; Back to Courses
            </Link>

            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {course.image_url ? (
                    <div className="relative h-64 w-full">
                        <img
                            src={course.image_url}
                            alt={course.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="h-64 w-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                )}
                <div className="p-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{course.name}</h1>
                    {course.subject_name && (
                        <p className="text-blue-600 font-semibold mb-4">{course.subject_name}</p>
                    )}
                    {course.description && (
                        <p className="text-gray-600 text-lg">{course.description}</p>
                    )}
                </div>
            </div>

            {/* Lessons List */}
            {course.lessons && course.lessons.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Lessons</h2>
                    <div className="space-y-4">
                        {course.lessons
                            .sort((a, b) => a.order_number - b.order_number)
                            .map((lesson) => (
                                <Link
                                    key={lesson.id}
                                    href={`/lessons/${lesson.id}`}
                                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                                                {lesson.order_number}. {lesson.name}
                                            </h3>
                                            {lesson.description && (
                                                <p className="text-gray-600 text-sm line-clamp-1">{lesson.description}</p>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <span className="inline-flex items-center justify-center p-2 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!course.lessons || course.lessons.length === 0) && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p>No lessons available for this course yet.</p>
                </div>
            )}
        </div>
    );
}
