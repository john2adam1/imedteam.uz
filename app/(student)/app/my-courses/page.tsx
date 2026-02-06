'use client';

import { useEffect, useState } from 'react';
import { courseService } from '@/services';
import { useRouter } from 'next/navigation';

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function fetchUserCourses() {
            try {
                setLoading(true);
                const data = await courseService.getUserCourses();
                console.log('My courses data received:', data);
                // Handle various potential response formats
                if (Array.isArray(data)) {
                    setCourses(data);
                } else if (data && typeof data === 'object') {
                    setCourses((data as any).user_courses || (data as any).items || []);
                } else {
                    setCourses([]);
                }
            } catch (err: any) {
                console.error('Failed to fetch user courses:', err);
                setError(err.message || 'Failed to load courses');
            } finally {
                setLoading(false);
            }
        }

        fetchUserCourses();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>My Courses</h1>
            
            {error && (
                <div style={{ color: 'red', marginBottom: '20px', padding: '10px', border: '1px solid red' }}>
                    {error}
                </div>
            )}

            {courses.length === 0 ? (
                <div>
                    <p>You haven't enrolled in any courses yet.</p>
                    <button onClick={() => router.push('/app/courses')}>
                        Browse Courses
                    </button>
                </div>
            ) : (
                <div>
                    <h2>Enrolled Courses ({courses.length})</h2>
                    {courses.map((course) => (
                        <div key={course.id} style={{ border: '1px solid #ccc', margin: '10px', padding: '15px' }}>
                            <h3>{course.course_name || course.name}</h3>
                            <p>Progress: {course.percentage || 0}%</p>
                            <p>Completed: {course.completed_lessons || 0} / {course.total_lessons || 0} lessons</p>
                            <p>Tariff: {course.tariff_name || 'Basic'}</p>
                            <button onClick={() => router.push(`/app/courses/${course.course_id || course.id}`)}>
                                Continue Learning
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

