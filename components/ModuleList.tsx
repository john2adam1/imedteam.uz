import Link from 'next/link';
import { Module, Course } from '@/types';

interface ModuleListProps {
  course: Course;
}

export default function ModuleList({ course }: ModuleListProps) {
  return (
    <div className="space-y-4">
      {course.modules.map((module) => (
        <div key={module.id} className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {module.order}. {module.title}
          </h3>
          {module.description && (
            <p className="text-gray-600 text-sm mb-3">{module.description}</p>
          )}
          <div className="space-y-2">
            {module.lessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/course/${course.slug}/lesson/${lesson.id}`}
                className="block p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 text-sm">{lesson.order}.</span>
                    <span className="text-gray-800">{lesson.title}</span>
                    {lesson.isFree && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">
                        Free
                      </span>
                    )}
                  </div>
                  {lesson.duration && (
                    <span className="text-gray-500 text-sm">{lesson.duration} min</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

