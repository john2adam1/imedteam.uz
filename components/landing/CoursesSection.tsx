'use client';

import { useEffect, useState } from 'react';
import { courseService, subjectService } from '@/services/mobile-api';
import { CourseMobileRes, Subject } from '@/types/mobile-api';
import Link from 'next/link';
import { Grid } from 'lucide-react';

export default function CoursesSection() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [courses, setCourses] = useState<CourseMobileRes[]>([]);
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

    // Group courses by subject - searching for subject in name or using any available field
    // If the API doesn't return subject_id directly in the list, we might need to handle it differently
    // For now, let's use a looser type to avoid TS errors on subject_id
    const getCoursesBySubject = (subjectId: string) => {
        return courses.filter((course: any) => course.subject_id === subjectId);
    };

    if (loading) {
        return <div className="py-20 text-center"><div className="animate-spin inline-block w-8 h-8 border-4 border-primary-500 rounded-full border-t-transparent"></div></div>;
    }

    return (
        <section id="courses" className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="reveal text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                        Kurs yo‘nalishlari
                    </h2>
                    <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
                        Klinik, Fundamental va Preklinik fanlar bo‘yicha eng sara modullar to’plami.
                        Professional shifokorlar bilan birga o’rganing.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subjects.length === 0 && !loading && (
                        <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-slate-100 italic text-slate-400">
                            Hozircha kurslar mavjud emas.
                        </div>
                    )}

                    {subjects.map((subject, idx) => {
                        const subjectCourses = getCoursesBySubject(subject.id);
                        if (subjectCourses.length === 0) return null;

                        return (
                            <div
                                key={subject.id}
                                className="reveal group bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                                style={{ transitionDelay: `${idx * 100}ms` }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                    <Grid className="w-8 h-8" />
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                                    {subject.name}
                                </h3>

                                <p className="text-slate-500 text-sm font-medium mb-8 flex-1">
                                    Ushbu yo‘nalishda {subjectCourses.length} ta professional kurslar mavjud.
                                </p>

                                <div className="space-y-3">
                                    {subjectCourses.slice(0, 3).map(course => (
                                        <Link
                                            href={`/app/courses/${course.id}`}
                                            key={course.id}
                                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all hover:border-primary/20 hover:text-primary"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-primary/40 group-hover:bg-primary"></div>
                                            <span className="font-bold text-sm truncate">{course.name}</span>
                                        </Link>
                                    ))}
                                    {subjectCourses.length > 3 && (
                                        <Link
                                            href="/app/courses"
                                            className="block text-center pt-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                                        >
                                            Yana {subjectCourses.length - 3} ta kurs...
                                        </Link>
                                    )}
                                </div>

                                <Link
                                    href="/app/courses"
                                    className="mt-8 py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold text-center group-hover:bg-primary transition-all shadow-lg shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    Ko‘rish
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
