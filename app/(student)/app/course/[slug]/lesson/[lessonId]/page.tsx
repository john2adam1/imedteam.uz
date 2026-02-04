import { courseService, lessonService } from '@/services/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface LessonPageProps {
  params: {
    slug: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const course = await courseService.getBySlug(params.slug);
  
  if (!course) {
    notFound();
  }

  // Find the lesson in the course
  let lesson = null;
  let module = null;
  
  for (const mod of course.modules) {
    const foundLesson = mod.lessons.find(l => l.id === params.lessonId);
    if (foundLesson) {
      lesson = foundLesson;
      module = mod;
      break;
    }
  }

  if (!lesson || !module) {
    notFound();
  }

  // Find previous and next lessons
  const allLessons = course.modules.flatMap(mod => mod.lessons);
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/course/${course.slug}`} className="hover:text-blue-600">{course.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{lesson.title}</span>
        </nav>

        {/* Lesson Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{lesson.title}</h1>
              <p className="text-gray-600 mb-2">
                Module: {module.title} • Lesson {lesson.order}
              </p>
              {lesson.duration && (
                <p className="text-gray-500 text-sm">Duration: {lesson.duration} minutes</p>
              )}
            </div>
            {lesson.isFree ? (
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">
                Free
              </span>
            ) : (
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                Paid
              </span>
            )}
          </div>
          
          {lesson.description && (
            <p className="text-gray-700">{lesson.description}</p>
          )}
        </div>

        {/* Video Section */}
        {lesson.videoUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Video Lesson</h2>
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center">
                <p className="mb-2">Video Player</p>
                <p className="text-sm text-gray-400">URL: {lesson.videoUrl}</p>
                <p className="text-xs text-gray-500 mt-2">Replace with actual video player component</p>
              </div>
            </div>
          </div>
        )}

        {/* PDF Section */}
        {lesson.pdfUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lesson Materials</h2>
            <a
              href={lesson.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              <span>📄</span>
              <span>Download PDF</span>
            </a>
          </div>
        )}

        {/* Test PDF Section */}
        {lesson.testPdfUrl && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Test Materials</h2>
            <a
              href={lesson.testPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              <span>📝</span>
              <span>Download Test PDF</span>
            </a>
          </div>
        )}

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            {previousLesson ? (
              <Link
                href={`/course/${course.slug}/lesson/${previousLesson.id}`}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                ← Previous: {previousLesson.title}
              </Link>
            ) : (
              <div></div>
            )}
            
            <Link
              href={`/course/${course.slug}`}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Back to Course
            </Link>

            {nextLesson ? (
              <Link
                href={`/course/${course.slug}/lesson/${nextLesson.id}`}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Next: {nextLesson.title} →
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

