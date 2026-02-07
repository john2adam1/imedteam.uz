'use client';

import { useEffect, useState } from 'react';
import { courseService, subjectService } from '@/services';
import { useRouter } from 'next/navigation';
import { Search, Filter } from 'lucide-react';

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
            // Show only public courses
            return allCourses.filter(course => course.is_public === true);
        }

        // Show all courses (already filtered by subject_id in API call if needed)
        return allCourses;
    };

    const displayedCourses = getDisplayedCourses();

    // Count courses per subject
    const getSubjectCourseCount = (subjectId: string) => {
        return allCourses.filter(course => course.subject_id === subjectId).length;
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar - Subject Filters */}
                <aside className="lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-gray-200 p-4 sticky top-6">
                        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Filter className="w-5 h-5" />
                            Fanlar
                        </h2>

                        {/* All Courses Option */}
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl mb-2 transition-all ${selectedSubject === null
                                ? 'bg-primary-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Barcha kurslar</span>
                                <span className={`text-sm ${selectedSubject === null ? 'text-white/80' : 'text-gray-500'}`}>
                                    {allCourses.length}
                                </span>
                            </div>
                        </button>

                        {/* Free Courses Option */}
                        <button
                            onClick={() => setSelectedSubject('free')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl mb-2 transition-all ${selectedSubject === 'free'
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'text-gray-700 hover:bg-green-50'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-medium">🎁 Bepul kurslar</span>
                                <span className={`text-sm ${selectedSubject === 'free' ? 'text-white/80' : 'text-gray-500'}`}>
                                    {allCourses.filter(c => c.is_public === true).length}
                                </span>
                            </div>
                        </button>

                        {/* Divider */}
                        <div className="border-t border-gray-200 my-2"></div>

                        {/* Subject List */}
                        <div className="space-y-1">
                            {subjects.map((subject) => (
                                <button
                                    key={subject.id}
                                    onClick={() => setSelectedSubject(subject.id)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl transition-all ${selectedSubject === subject.id
                                        ? 'bg-primary-600 text-white shadow-sm'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm line-clamp-1">{subject.name}</span>
                                        <span className={`text-xs ${selectedSubject === subject.id ? 'text-white/80' : 'text-gray-500'}`}>
                                            {getSubjectCourseCount(subject.id)}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {subjects.length === 0 && !loading && (
                            <p className="text-sm text-gray-500 text-center py-4">Fanlar topilmadi</p>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header with Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">Kurslar</h1>

                        <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                            <button
                                onClick={() => {
                                    setActiveTab('all');
                                    setSelectedSubject(null);
                                }}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Barcha kurslar
                            </button>
                            <button
                                onClick={() => setActiveTab('my')}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'my'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Mening kurslarim
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm mb-6">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Yuklanmoqda...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Course Count */}
                            <h2 className="text-lg font-bold text-gray-900 mb-6">
                                {activeTab === 'all'
                                    ? selectedSubject === 'free'
                                        ? `🎁 Bepul kurslar (${displayedCourses.length})`
                                        : selectedSubject
                                            ? `${subjects.find(s => s.id === selectedSubject)?.name || 'Barcha kurslar'} (${displayedCourses.length})`
                                            : `Barcha kurslar (${displayedCourses.length})`
                                    : `Mening kurslarim (${displayedCourses.length})`
                                }
                            </h2>

                            {/* Empty State */}
                            {displayedCourses.length === 0 ? (
                                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">
                                        {activeTab === 'my'
                                            ? "Siz hali hech qaysi kursga a'zo bo'lmagansiz"
                                            : selectedSubject === 'free'
                                                ? "Hozircha bepul kurslar mavjud emas"
                                                : selectedSubject
                                                    ? "Bu fan bo'yicha kurslar topilmadi"
                                                    : "Hozircha kurslar mavjud emas"
                                        }
                                    </p>
                                    {activeTab === 'my' && (
                                        <button
                                            onClick={() => setActiveTab('all')}
                                            className="mt-4 text-primary-600 font-medium hover:underline"
                                        >
                                            Kurslarni ko'rish
                                        </button>
                                    )}
                                </div>
                            ) : (
                                /* Course Grid */
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedCourses.map((course) => (
                                        <div
                                            key={course.id || course.course_id}
                                            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow flex flex-col h-full"
                                        >
                                            <div className="aspect-video bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                                {activeTab === 'my' ? (
                                                    <div className="absolute inset-0 flex items-center justify-center text-primary-600 font-bold bg-primary-50">
                                                        {course.percentage || 0}%
                                                    </div>
                                                ) : course.image_url ? (
                                                    <img src={course.image_url} alt={course.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                                                        <span className="text-sm">Rasm yo'q</span>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-1">
                                                {course.course_name || course.name}
                                            </h3>

                                            {activeTab === 'all' ? (
                                                <>
                                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                                                        {course.description}
                                                    </p>
                                                    <div className="pt-4 border-t border-gray-100 mt-auto">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                                                                    <div className="w-full h-full bg-gray-200" />
                                                                </div>
                                                                <span className="text-xs text-gray-600 font-medium">
                                                                    {course.teacher_name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => router.push(`/app/courses/${course.id}`)}
                                                            className="w-full py-2.5 bg-primary-50 text-primary-600 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                                                        >
                                                            Batafsil
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="space-y-3 mb-6 flex-grow">
                                                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                                            <div
                                                                className="bg-primary-500 h-full rounded-full transition-all duration-300"
                                                                style={{ width: `${course.percentage || 0}%` }}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {course.completed_lessons || 0} / {course.total_lessons || 0} darslar yakunlandi
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => router.push(`/app/courses/${course.course_id || course.id}`)}
                                                        className="w-full py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors mt-auto shadow-sm shadow-primary-600/30"
                                                    >
                                                        Davom ettirish
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
