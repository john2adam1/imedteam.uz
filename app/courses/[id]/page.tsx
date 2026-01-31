import { courseService } from '@/services/mobile-api';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
    let course;

    try {
        course = await courseService.getById(params.id);
    } catch (error) {
        console.error('Failed to fetch course:', error);
        notFound();
    }

    if (!course) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                {course.image_url && (
                    <div className="relative h-64 w-full">
                        <Image
                            src={course.image_url}
                            alt={course.name}
                            fill
                            className="object-cover"
                        />
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
                                    className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {lesson.order_number}. {lesson.name}
                                            </h3>
                                            {lesson.description && (
                                                <p className="text-gray-600 text-sm">{lesson.description}</p>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <svg
                                                className="w-6 h-6 text-blue-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!course.lessons || course.lessons.length === 0) && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600">No lessons available for this course yet.</p>
                </div>
            )}
        </div>
    );
}
