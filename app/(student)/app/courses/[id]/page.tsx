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
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <Link href="/app/courses" style={{ marginBottom: '20px', display: 'inline-block' }}>
                &larr; Kurslarga qaytish
            </Link>

            {/* Course Header */}
            <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 300px' }}>
                        <img
                            src={course.image_url || '/course-placeholder.jpg'}
                            alt={course.name}
                            style={{ width: '100%', borderRadius: '8px' }}
                        />
                    </div>
                    <div style={{ flex: '1 1 300px' }}>
                        <h1>{course.name}</h1>
                        <p style={{ fontStyle: 'italic', color: '#666' }}>{course.description}</p>

                        <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
                            <div>
                                <p style={{ fontSize: '10px', margin: 0 }}>Darslar</p>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{course.lessons}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '10px', margin: 0 }}>Muddati</p>
                                <p style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{course.duration} kun</p>
                            </div>
                        </div>

                        <div style={{ padding: '10px', backgroundColor: course.has_access ? '#d4edda' : '#f8d7da', borderRadius: '4px', marginBottom: '20px' }}>
                            {course.has_access ? 'Sizda ruxsat bor ✅' : 'Ruxsat yo‘q 🔒'}
                        </div>

                        {!course.has_access && (
                            <Link href="/app/tariffs" style={{ display: 'block', padding: '10px', backgroundColor: '#007bff', color: 'white', textAlign: 'center', textDecoration: 'none', borderRadius: '4px' }}>
                                Kursni sotib olish
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Modules & Lessons List */}
            <div>
                <h2>Kurs rejasi</h2>

                {course.modules && course.modules.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {course.modules
                            .sort((a, b) => a.order_num - b.order_num)
                            .map((module) => (
                                <div key={module.id} style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
                                    <div style={{ padding: '10px', backgroundColor: '#eee', borderBottom: '1px solid #ccc' }}>
                                        <h3 style={{ margin: 0 }}>{module.name}</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {module.lessons
                                            .sort((a, b) => a.order_num - b.order_num)
                                            .map((lesson) => (
                                                <div key={lesson.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span>{lesson.order_num}. {lesson.name}</span>
                                                    <div>
                                                        {course.has_access || lesson.is_public ? (
                                                            <Link
                                                                href={`/app/lessons/${lesson.id}`}
                                                                style={{ padding: '5px 15px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px', fontSize: '12px' }}
                                                            >
                                                                {lesson.is_completed ? 'Ko‘rilgan' : 'Boshlash'}
                                                            </Link>
                                                        ) : (
                                                            <span style={{ color: '#ccc', fontSize: '12px' }}>🔒 Yopiq</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: '#999' }}>Tez kunda yangi darslar yuklanadi.</p>
                )}
            </div>
        </div>
    );
}
