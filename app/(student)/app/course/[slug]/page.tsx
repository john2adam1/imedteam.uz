import { courseService } from '@/services/api';
import { notFound } from 'next/navigation';
import ModuleList from '@/components/ModuleList';
import Link from 'next/link';

interface CoursePageProps {
  params: {
    slug: string;
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await courseService.getBySlug(params.slug);
  
  if (!course) {
    notFound();
  }

  // Count total lessons
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const freeLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(lesson => lesson.isFree).length,
    0
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
              {course.instructor && (
                <p className="text-gray-600 mb-2">Instructor: {course.instructor}</p>
              )}
            </div>
            <div className="text-right">
              {course.isFree ? (
                <span className="bg-green-100 text-green-800 text-lg font-semibold px-4 py-2 rounded">
                  Free
                </span>
              ) : (
                <div>
                  <span className="bg-blue-100 text-blue-800 text-lg font-semibold px-4 py-2 rounded">
                    ${course.price}
                  </span>
                  {freeLessons > 0 && (
                    <p className="text-sm text-gray-600 mt-1">{freeLessons} free lessons</p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{course.description}</p>
          
          <div className="flex gap-4 text-sm text-gray-600">
            <span>{course.modules.length} Modules</span>
            <span>•</span>
            <span>{totalLessons} Lessons</span>
          </div>
        </div>

        {/* Modules and Lessons */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Content</h2>
          <ModuleList course={course} />
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {course.isFree ? (
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Enroll for Free
            </button>
          ) : (
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Purchase Course (${course.price})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

