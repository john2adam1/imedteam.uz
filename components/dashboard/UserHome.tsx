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
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center gap-2">
                                <img src="/imedteamlogo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                                <span className="font-bold text-xl text-gray-900">iMed Team</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/my-courses" className="text-gray-600 hover:text-primary-600 font-medium text-sm">My Courses</Link>
                            <Link href="/profile" className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                                {/* Placeholder for Profile Image */}
                                <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Banners */}
                {banners.length > 0 && (
                    <section>
                        <div className="grid gap-4">
                            {banners.map((banner) => (
                                <div key={banner.id} className="relative rounded-2xl overflow-hidden aspect-[21/9] md:aspect-[3/1] bg-gray-200">
                                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                        <div className="text-white">
                                            <h3 className="text-2xl font-bold">{banner.title}</h3>
                                            <p className="opacity-90">{banner.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Subjects */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {subjects.map((subject) => (
                            <button key={subject.id} className="flex-shrink-0 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-primary-500 hover:shadow-md transition">
                                <span className="font-medium text-gray-700">{subject.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Courses */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Popular Courses</h2>
                        <Link href="/courses" className="text-primary-600 text-sm font-semibold hover:underline">See All</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <Link key={course.id} href={`/courses/${course.id}`} className="group">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all h-full flex flex-col">
                                    <div className="aspect-video relative bg-gray-200">
                                        <img src={course.image_url || '/course-placeholder.jpg'} alt={course.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">{course.subject_name}</span>
                                            <div className="flex items-center text-yellow-400 text-xs font-bold">
                                                <span>★ 4.9</span>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">{course.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{course.description}</p>
                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="font-bold text-lg text-gray-900">{course.price === 0 ? 'Free' : `${course.price?.toLocaleString()} UZS`}</span>
                                            <span className="text-xs text-gray-400">{course.video_count || 0} lessons</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
