'use client';

import { useEffect, useState } from 'react';
import { courseService, subjectService } from '@/services';
import { useRouter } from 'next/navigation';
import { Search, Filter, Sun, Play } from 'lucide-react';

export default function CoursesPage() {
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
    const [selectedSubject, setSelectedSubject] = useState<string | 'free' | null>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [allCourses, setAllCourses] = useState<any[]>([]);
    const [myCourses, setMyCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    // Fetch subjects on mount
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

    // Fetch courses when tab or subject filter changes
    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            setError('');
            try {
                if (activeTab === 'all') {
                    // Only filter by subject_id if a real subject is selected (not 'free' or null)
                    const params = (selectedSubject && selectedSubject !== 'free')
                        ? { subject_id: selectedSubject }
                        : {};
                    const data = await courseService.getCourses(params);
                    setAllCourses(data.courses || []);
                } else {
                    const data = await courseService.getUserCourses();
                    setMyCourses(data.user_courses || []);
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, [activeTab, selectedSubject]);

    // Filter courses based on selection
    const getDisplayedCourses = () => {
        if (activeTab === 'my') return myCourses;

        if (selectedSubject === 'free') {
            // ✅ FIX: Show only public/free courses
            return allCourses.filter(course => !!course.is_public);
        }

        // Show all courses (already filtered by subject_id in API call if needed)
        return allCourses;
    };

    const displayedCourses = getDisplayedCourses();

    // Count courses per subject
    const getSubjectCourseCount = (subjectId: string) => {
        return allCourses.filter(course => course.subject_id === subjectId).length;
    };

    // ✅ Helper function to check if course is free
    const isCourseFreeFn = (course: any) => !!course.is_public;

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar - Subject Filters */}
                <aside className="lg:w-72 flex-shrink-0">
                    <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-6 shadow-soft">
                        <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <Filter className="w-5 h-5 text-primary" />
                            Fanlar
                        </h2>

                        <div className="space-y-2">
                            {/* All Courses Option */}
                            <button
                                onClick={() => setSelectedSubject(null)}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 active:scale-[0.98] ${selectedSubject === null
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-gray-600 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Barcha kurslar</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedSubject === null ? 'bg-white/20 text-white' : 'bg-slate-100 text-gray-400'}`}>
                                        {allCourses.length}
                                    </span>
                                </div>
                            </button>

                            {/* Free Courses Option */}
                            <button
                                onClick={() => setSelectedSubject('free')}
                                className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 active:scale-[0.98] ${selectedSubject === 'free'
                                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                                    : 'text-gray-600 hover:bg-emerald-50/50'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-sm">🎁 Bepul kurslar</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedSubject === 'free' ? 'bg-white/20 text-white' : 'bg-emerald-100/50 text-emerald-600'}`}>
                                        {allCourses.filter(c => c.is_public === true).length}
                                    </span>
                                </div>
                            </button>

                            {/* Divider */}
                            <div className="border-t border-gray-100 my-4"></div>

                            {/* Subject List */}
                            <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {subjects.map((subject) => (
                                    <button
                                        key={subject.id}
                                        onClick={() => setSelectedSubject(subject.id)}
                                        className={`w-full text-left px-4 py-3 rounded-2xl transition-all duration-200 active:scale-[0.98] ${selectedSubject === subject.id
                                            ? 'bg-primary text-white shadow-md shadow-primary/20'
                                            : 'text-gray-600 hover:bg-slate-50 font-medium'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm line-clamp-1">{subject.name}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedSubject === subject.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-gray-400'}`}>
                                                {getSubjectCourseCount(subject.id)}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {subjects.length === 0 && !loading && (
                            <p className="text-sm text-gray-400 text-center py-6 italic">Fanlar topilmadi</p>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header with Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Kurslar</h1>

                        <div className="flex p-1.5 bg-slate-100/80 rounded-2xl w-fit">
                            <button
                                onClick={() => {
                                    setActiveTab('all');
                                    setSelectedSubject(null);
                                }}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm shadow-black/5'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Barcha kurslar
                            </button>
                            <button
                                onClick={() => setActiveTab('my')}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'my'
                                    ? 'bg-white text-gray-900 shadow-sm shadow-black/5'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Mening kurslarim
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl text-primary text-sm font-medium mb-8 flex items-center gap-3">
                            <span className="text-xl">⚠️</span> {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400 font-medium">Yuklanmoqda...</p>
                        </div>
                    ) : (
                        <>
                            {/* Course Count */}
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                                {activeTab === 'all'
                                    ? selectedSubject === 'free'
                                        ? `🎁 Bepul kurslar (${displayedCourses.length})`
                                        : selectedSubject
                                            ? `${subjects.find(s => s.id === selectedSubject)?.name || 'Barcha kurslar'} (${displayedCourses.length})`
                                            : `Jami kurslar (${displayedCourses.length})`
                                    : `Siz o'qiyotgan kurslar (${displayedCourses.length})`
                                }
                            </h2>

                            {/* Empty State */}
                            {displayedCourses.length === 0 ? (
                                <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl mb-6 opacity-50 grayscale">📚</div>
                                    <p className="text-gray-400 font-medium text-lg max-w-sm mb-8">
                                        {activeTab === 'my'
                                            ? "Siz hali hech qaysi kursga a'zo bo'lmagansiz"
                                            : selectedSubject === 'free'
                                                ? "Hozircha bepul kurslar mavjud emas"
                                                : selectedSubject
                                                    ? "Ushbu yo'nalish bo'yicha hozircha kurslar mavjud emas"
                                                    : "Hozircha kurslar mavjud emas"
                                        }
                                    </p>
                                    {activeTab === 'my' && (
                                        <button
                                            onClick={() => setActiveTab('all')}
                                            className="px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95"
                                        >
                                            Kurslarni ko'rish
                                        </button>
                                    )}
                                </div>
                            ) : (
                                /* Course Grid */
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {displayedCourses.map((course) => {
                                        // ✅ FIX: Check if course is free
                                        const isFree = isCourseFreeFn(course);

                                        return (
                                            <div
                                                key={course.id || course.course_id}
                                                className="group bg-white border border-gray-100 rounded-[2rem] p-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full hover:-translate-y-1.5 cursor-pointer"
                                                onClick={() => router.push(`/app/courses/${course.course_id || course.id}`)}
                                            >
                                                <div className="aspect-[16/10] bg-slate-50 rounded-2xl mb-6 overflow-hidden relative ring-1 ring-gray-100">
                                                    {activeTab === 'my' ? (
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <div className="relative w-24 h-24">
                                                                <svg className="w-full h-full transform -rotate-90">
                                                                    <circle
                                                                        cx="48" cy="48" r="40"
                                                                        stroke="currentColor" strokeWidth="8"
                                                                        fill="transparent"
                                                                        className="text-primary/10"
                                                                    />
                                                                    <circle
                                                                        cx="48" cy="48" r="40"
                                                                        stroke="currentColor" strokeWidth="8"
                                                                        fill="transparent"
                                                                        strokeDasharray={251.2}
                                                                        strokeDashoffset={251.2 * (1 - (course.percentage || 0) / 100)}
                                                                        className="text-primary transition-all duration-1000"
                                                                    />
                                                                </svg>
                                                                <div className="absolute inset-0 flex items-center justify-center font-black text-primary text-lg">
                                                                    {course.percentage || 0}%
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : course.image_url ? (
                                                        <img
                                                            src={course.image_url}
                                                            alt={course.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250/800000/FFFFFF?text=KURS';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-card group-hover:scale-110 transition-transform duration-500">
                                                                <Play size={32} className="text-primary/20" fill="currentColor" />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* ✅ FIX: Show free badge for free courses */}
                                                    {isFree && activeTab === 'all' && (
                                                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">
                                                            🎁 BEPUL
                                                        </div>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                    {course.course_name || course.name}
                                                </h3>

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
                                                            {/* ✅ FIX: Show different CTA for free vs paid courses */}
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
                                                        <div className="space-y-4 mb-6 flex-grow">
                                                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden ring-1 ring-white">
                                                                <div
                                                                    className="bg-primary h-full rounded-full transition-all duration-1000"
                                                                    style={{ width: `${course.percentage || 0}%` }}
                                                                />
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
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}