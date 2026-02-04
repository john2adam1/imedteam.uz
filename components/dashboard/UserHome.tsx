'use client';

import { useEffect, useState } from 'react';
import { bannerService, courseService, subjectService } from '@/services/mobile-api';
import { BannerMobile, UserCourseMobile, Subject } from '@/types/mobile-api';
import Link from 'next/link';

export default function UserHome() {
    const [banners, setBanners] = useState<BannerMobile[]>([]);
    const [courses, setCourses] = useState<UserCourseMobile[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [bannerData, courseData, subjectData] = await Promise.all([
                    bannerService.getAll(),
                    courseService.getAll(),
                    subjectService.getAll()
                ]);
                setBanners(bannerData.banners || []);
                setCourses(courseData.courses || []);
                setSubjects(subjectData.subjects || []);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Banners */}
            {banners.length > 0 && (
                <section>
                    <div className="grid gap-6">
                        {banners.map((banner) => (
                            <div key={banner.id} className="relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[3/1] bg-slate-200 group">
                                <img
                                    src={banner.image_url}
                                    alt={banner.title}
                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8">
                                    <div className="text-white max-w-xl">
                                        <h3 className="text-2xl md:text-3xl font-bold mb-2">{banner.title}</h3>
                                        <p className="text-white/80 line-clamp-2">{banner.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Subjects/Categories */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Yo‘nalishlar</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    {subjects.map((subject) => (
                        <button key={subject.id} className="flex-shrink-0 px-8 py-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-primary-500 hover:shadow-md transition-all active:scale-95">
                            <span className="font-semibold text-slate-700">{subject.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Popular Courses */}
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Ommabop kurslar</h2>
                    <Link href="/app/courses" className="text-primary-600 font-semibold hover:text-primary-700 transition">
                        Barchasini ko‘rish
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <Link key={course.id} href={`/app/course/${course.id}`} className="group">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group-hover:-translate-y-1">
                                <div className="aspect-video relative bg-slate-200">
                                    <img
                                        src={course.image_url || '/course-placeholder.jpg'}
                                        alt={course.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-primary-600/90 backdrop-blur px-2 py-1 rounded-md">
                                            {course.subject_name}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                                        {course.name}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Holati</span>
                                            <span className="font-bold text-slate-900">
                                                {course.is_active ? 'Faol' : 'Nofaol'}
                                            </span>
                                        </div>
                                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                            →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
