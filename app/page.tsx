import { bannerService, subjectService, courseService } from '@/services/mobile-api';
import Image from 'next/image';
import Link from 'next/link';

export default async function HomePage() {
  // Fetch data from API
  let banners = [];
  let subjects = [];
  let courses = [];

  try {
    const [bannersData, subjectsData, coursesData] = await Promise.all([
      bannerService.getAll(),
      subjectService.getAll({ is_active: 'true' }),
      courseService.getAll({ is_active: 'true' }),
    ]);

    banners = bannersData.banners || [];
    subjects = subjectsData.subjects || [];
    courses = coursesData.courses || [];
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  return (
    <div>
      {/* Banner Section */}
      {banners.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {banners[0].title}
              </h1>
              {banners[0].description && (
                <p className="text-xl mb-8">{banners[0].description}</p>
              )}
              {banners[0].link_url && (
                <Link
                  href={banners[0].link_url}
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Learn More
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Subjects Section */}
        {subjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {subject.image_url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={subject.image_url}
                        alt={subject.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {subject.name}
                    </h3>
                    {subject.description && (
                      <p className="text-gray-600">{subject.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Courses Section */}
        {courses.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {course.image_url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={course.image_url}
                        alt={course.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {course.name}
                    </h3>
                    {course.description && (
                      <p className="text-gray-600 line-clamp-3">
                        {course.description}
                      </p>
                    )}
                    {course.subject_name && (
                      <p className="text-sm text-blue-600 mt-2">
                        {course.subject_name}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {banners.length === 0 && subjects.length === 0 && courses.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome to Imed Educational Platform
            </h2>
            <p className="text-gray-600">
              Content will be available soon. Please check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
