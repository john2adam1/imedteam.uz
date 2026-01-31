import Link from 'next/link';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link href={`/course/${course.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {course.imageUrl && (
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Course Image</span>
          </div>
        )}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
            {course.isFree ? (
              <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                Free
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                ${course.price}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>
          {course.instructor && (
            <p className="text-gray-500 text-xs">By {course.instructor}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

