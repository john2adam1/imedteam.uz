'use client';

import { useEffect, useState } from 'react';
import { courseService, subjectService } from '@/services/mobile-api';
import { UserCourseMobile, Subject } from '@/types/mobile-api';
import Link from 'next/link';

export default function CoursesSection() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [courses, setCourses] = useState<UserCourseMobile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [subjectsData, coursesData] = await Promise.all([
                    subjectService.getAll().catch(() => ({ subjects: [], count: 0 })),
                    courseService.getAll().catch(() => ({ courses: [], count: 0 })),
                ]);
                setSubjects(subjectsData.subjects || []);
                setCourses(coursesData.courses || []);
            } catch (error) {
                console.error('Failed to load course data', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Group courses by subject
    const getCoursesBySubject = (subjectId: string) => {
        return courses.filter(course => course.subject_id === subjectId);
    };

    if (loading) {
        return <div className="py-20 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 rounded-full border-t-transparent"></div></div>;
    }

    return (
        <section id="courses" className="py-16">
            <div className="max-w-4xl mx-auto px-4">
                <div className="reveal text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-extrabold">Kurs yo‘nalishlari</h2>
                    <p className="text-slate-600 mt-2">Klinik, Fundamental va Preklinik fanlar bo‘yicha modullar.</p>
                </div>

                <div className="mt-8 grid gap-4">
                    {subjects.length === 0 && (
                        <div className="text-center text-slate-500">Hozircha kurslar mavjud emas.</div>
                    )}

                    {subjects.map((subject) => {
                        const subjectCourses = getCoursesBySubject(subject.id);
                        if (subjectCourses.length === 0) return null; // Hide empty subjects or show them? Old site showed categories. Let's hide empty to keep it clean, or show.

                        return (
                            <details key={subject.id} className="reveal group rounded-xl border border-slate-200 bg-white p-4 open:shadow-soft transition-all duration-300">
                                <summary className="flex cursor-pointer items-center justify-between gap-4 select-none">
                                    <div className="flex items-center gap-3">
                                        {/* Optional: <img src={subject.image_url} alt="" className="w-8 h-8 rounded object-cover" /> */}
                                        <span className="font-semibold text-lg text-slate-800">{subject.name}</span>
                                    </div>
                                    <span className="text-slate-500 group-open:rotate-45 transition transform duration-300 text-2xl">+</span>
                                </summary>
                                <div className="pt-4 text-slate-700 text-sm grid md:grid-cols-2 gap-3 border-t border-slate-100 mt-3 animation-fade-in">
                                    {subjectCourses.map(course => (
                                        <Link href={`/app/courses/${course.id}`} key={course.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition group/course">
                                            <span className="w-2 h-2 rounded-full bg-primary-400 group-hover/course:bg-primary-600 transition"></span>
                                            <span className="font-medium">{course.name}</span>
                                            {/* <span className="text-xs text-slate-400 ml-auto">Duration?</span> */}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
