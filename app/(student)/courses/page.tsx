'use client';

import { useEffect, useState } from 'react';
import { courseService, subjectService } from '@/services';
import { useRouter } from 'next/navigation';
import { Filter, Play } from 'lucide-react';
import { Subject } from '@/types/mobile-api';
import { cn } from '@/lib/utils';

export default function CoursesPage() {
    // ===== SIMPLIFIED STATE (5 variables instead of 7+) =====
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
    const [selectedSubject, setSelectedSubject] = useState<string | 'free' | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [courses, setCourses] = useState<any[]>([]);  // Single source of truth
    const [totalCount, setTotalCount] = useState(0);  // From API response
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    // ===== SIMPLE FREE COURSE DETECTION =====
    // Trust the API: is_public is the source of truth
    const isFree = (course: any) => course.is_public === true;

    // ===== FETCH SUBJECTS (once on mount) =====
    useEffect(() => {
        async function fetchSubjects() {
            try {
                const data = await subjectService.getAll();
                setSubjects(data.subjects || []);
            } catch (err) {
                console.error('Failed to load subjects:', err);
            }
        }
        fetchSubjects();
    }, []);

    // ===== FETCH COURSES (when tab or filter changes) =====
    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                if (activeTab === 'all') {
                    // Determine API params based on filter
                    let params: any = {};

                    if (selectedSubject && selectedSubject !== 'free') {
                        // Filter by subject via API
                        params.subject_id = selectedSubject;
                    }

                    // Fetch from API
                    const data = await courseService.getCourses(params);
                    let fetchedCourses = data.courses || [];

                    // If "free" filter is active, filter client-side
                    if (selectedSubject === 'free') {
                        fetchedCourses = fetchedCourses.filter(c => isFree(c));
                    }

                    setCourses(fetchedCourses);
                    setTotalCount(selectedSubject === 'free' ? fetchedCourses.length : (data.count || fetchedCourses.length));

                } else {
                    // My courses tab
                    const data = await courseService.getUserCourses();
                    const userCourses = data.user_courses || [];
                    setCourses(userCourses);
                    // Update total count to reflect both API and local courses
                    setTotalCount(userCourses.length);
                }
            } catch (err: any) {
                console.error('Failed to load courses:', err);
                setCourses([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, [activeTab, selectedSubject]);

    // ===== COMPUTE COUNTS FOR SIDEBAR =====
    const getAllCoursesCount = () => {
        // We'll fetch this once separately for the sidebar
        return totalCount;
    };

    const getFreeCoursesCount = () => {
        // Count free courses from all courses
        // For simplicity, we show this from current view
        // In production, you might want to fetch all courses once for accurate count
        return courses.filter(c => isFree(c)).length;
    };

    // ===== RENDER =====
    return (
        <div className="">
            <div className="space-y-10">
                {/* ===== HEADER & PRIMARY TABS ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Kurslar</h1>
                        <p className="text-gray-400 font-medium italic">Siz uchun tanlangan eng yaxshi kurslar</p>
                    </div>

                    <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-fit">
                        <button
                            onClick={() => {
                                setActiveTab('all');
                                setSelectedSubject(null);
                            }}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'all'
                                ? 'bg-white text-gray-900 shadow-premium'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Barcha kurslar
                        </button>
                        <button
                            onClick={() => setActiveTab('my')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'my'
                                ? 'bg-white text-gray-900 shadow-premium'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Mening kurslarim
                        </button>
                    </div>
                </div>

                {/* ===== HORIZONTAL SUBJECT FILTERS ===== */}
                <div className="relative group">
                    <div className="flex items-center gap-3 overflow-x-auto pb-4 custom-scrollbar no-scrollbar">
                        {/* All Courses Pill */}
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 active:scale-95 flex items-center gap-2 ${selectedSubject === null
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                                }`}
                        >
                            Barchasi
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedSubject === null ? 'bg-white/20' : 'bg-slate-100 text-gray-400'}`}>
                                {totalCount}
                            </span>
                        </button>

                        {/* Free Courses Pill */}
                        <button
                            onClick={() => setSelectedSubject('free')}
                            className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 active:scale-95 flex items-center gap-2 ${selectedSubject === 'free'
                                ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                : 'bg-white border-gray-100 text-gray-600 hover:border-emerald-100 hover:text-emerald-600'
                                }`}
                        >
                            🎁 Bepul
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedSubject === 'free' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600'}`}>
                                {selectedSubject === 'free' ? courses.length : getFreeCoursesCount()}
                            </span>
                        </button>

                        <div className="h-8 w-[1px] bg-gray-100 mx-2 flex-shrink-0" />

                        {/* Subject Pills */}
                        {subjects.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => setSelectedSubject(subject.id)}
                                className={`whitespace-nowrap px-6 py-3 rounded-2xl font-bold text-sm transition-all border-2 active:scale-95 ${selectedSubject === subject.id
                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                                    : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200 hover:text-primary'
                                    }`}
                            >
                                {subject.name}
                            </button>
                        ))}
                    </div>
                    {/* Subtle fade effect for scrolling */}
                    <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* ===== MAIN CONTENT GRID ===== */}
                <main>
                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-50 shadow-soft">
                            <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-6"></div>
                            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Kurslar yuklanmoqda...</p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Title with Count */}
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                    {activeTab === 'all'
                                        ? selectedSubject === 'free'
                                            ? `Bepul kurslar`
                                            : selectedSubject
                                                ? subjects.find(s => s.id === selectedSubject)?.name
                                                : `Jami kurslar`
                                        : `Mening kurslarim`
                                    }
                                    <span className="ml-3 text-primary/30 text-3xl tabular-nums">/ {totalCount}</span>
                                </h2>
                            </div>

                            {/* Empty State */}
                            {courses.length === 0 ? (
                                <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-50 flex flex-col items-center">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-8 shadow-inner">
                                        📚
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-4 px-6 text-center">
                                        {activeTab === 'my'
                                            ? "Siz hali hech qaysi kursga a'zo bo'lmagansiz"
                                            : selectedSubject === 'free'
                                                ? "Hozircha bepul kurslar mavjud emas"
                                                : "Ushbu yo'nalish bo'yicha hozircha kurslar mavjud emas"
                                        }
                                    </h3>
                                    {activeTab === 'my' && (
                                        <button
                                            onClick={() => setActiveTab('all')}
                                            className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary-600 hover:-translate-y-1 transition-all active:scale-95"
                                        >
                                            Kurslarni ko'rish
                                        </button>
                                    )}
                                </div>
                            ) : (
                                /* Expanded Course Grid */
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-10">
                                    {courses.map((course) => (
                                        <CourseCard
                                            key={course.id || course.course_id}
                                            course={course}
                                            activeTab={activeTab}
                                            isFree={isFree(course)}
                                            onClick={() => router.push(`/courses/${course.course_id || course.id}`)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}


// ===== COURSE CARD COMPONENT =====
function CourseCard({ course, activeTab, isFree, onClick }: { course: any; activeTab: 'all' | 'my'; isFree: boolean; onClick: () => void }) {
    return (
        <div
            className="group bg-white border border-gray-100 rounded-[2rem] p-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full hover:-translate-y-1.5 cursor-pointer"
            onClick={onClick}
        >
            {/* Course Image/Thumbnail */}
            <div className="aspect-[16/10] bg-slate-50 rounded-2xl mb-6 overflow-hidden relative ring-1 ring-gray-100">
                {(course.image_url || course.course_image_url) ? (
                    <img
                        src={course.image_url || course.course_image_url}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250/800000/FFFFFF?text=TIBBIYOT';
                        }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-card group-hover:scale-110 transition-transform duration-500">
                            <Play size={32} className="text-primary/20" fill="currentColor" />
                        </div>
                    </div>
                )}

                {/* Free Badge */}
                {isFree && activeTab === 'all' && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">
                        🎁 BEPUL
                    </div>
                )}
            </div>

            {/* Course Title */}
            <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {course.course_name || course.name}
            </h3>

            {/* Content Based on Tab */}
            {activeTab === 'all' ? (
                <>
                    <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-grow leading-relaxed font-medium">
                        {course.description}
                    </p>
                    <div className="pt-6 border-t border-gray-50 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                {course.teacher_name?.[0] || 'T'}
                            </div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]">
                                {course.teacher_name || 'Ustoz'}
                            </span>
                        </div>
                        <div className={`px-4 py-2 text-xs font-black rounded-xl transition-all ${isFree
                            ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                            : 'bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white'
                            }`}>
                            {isFree ? "KO'RISH" : 'BATAFSIL'}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="space-y-3 mb-6 flex-grow">
                        <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden relative ring-1 ring-white shadow-inner">
                            <div
                                className="bg-primary h-full rounded-full transition-all duration-1000"
                                style={{ width: `${course.percentage || 0}%` }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-widest",
                                    (course.percentage || 0) > 55 ? "text-white" : "text-primary"
                                )}>
                                    {Math.round(course.percentage || 0)}%
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <span>{course.completed_lessons || 0} DARS YAKUNLANDI</span>
                            <span>{course.total_lessons || 0} JAMI</span>
                        </div>
                    </div>
                    <button
                        className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-600 transition-all shadow-md shadow-primary/20 active:scale-95"
                    >
                        DAVOM ETTIRISH
                    </button>
                </>
            )}
        </div>
    );
}