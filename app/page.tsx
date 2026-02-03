'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { bannerService, subjectService, courseService } from '@/services/mobile-api';
import { BannerMobile, Subject, UserCourseMobile } from '@/types/mobile-api';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [banners, setBanners] = useState<BannerMobile[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [courses, setCourses] = useState<UserCourseMobile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bannersData, subjectsData, coursesData] = await Promise.all([
          bannerService.getAll().catch(() => ({ banners: [], total: 0 })),
          subjectService.getAll().catch(() => ({ subjects: [], total: 0 })),
          courseService.getAll().catch(() => ({ courses: [], total: 0 })),
        ]);

        setBanners(bannersData.banners || []);
        setSubjects(subjectsData.subjects || []);
        setCourses(coursesData.courses || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Banner Section */}
      {banners.length > 0 && (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
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
          {/* Background Image Overlay if available */}
          {banners[0].image_url && (
            <div className="absolute inset-0 z-0 opacity-20">
              <img src={banners[0].image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </section>
      )}

      <div className="container mx-auto px-4 py-12">
        {/* Subjects Section */}
        {subjects.length > 0 && (
          <section className="mb-16">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Subjects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
                >
                  {subject.image_url ? (
                    <div className="relative h-40 w-full bg-gray-100">
                      <img
                        src={subject.image_url}
                        alt={subject.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 w-full bg-blue-50 flex items-center justify-center">
                      <span className="text-4xl text-blue-200 font-bold">{subject.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {subject.name}
                    </h3>
                    {subject.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{subject.description}</p>
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
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Latest Courses</h2>
              <Link href="/courses" className="text-blue-600 font-medium hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-full"
                >
                  {course.image_url ? (
                    <div className="relative h-48 w-full bg-gray-200">
                      <img
                        src={course.image_url}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {course.name}
                    </h3>
                    {course.description && (
                      <p className="text-gray-600 line-clamp-3 mb-4 flex-1">
                        {course.description}
                      </p>
                    )}
                    {course.subject_name && (
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full w-fit">
                        {course.subject_name}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && banners.length === 0 && subjects.length === 0 && courses.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {isAuthenticated ? `Welcome, ${user?.name || user?.full_name || 'Student'}!` : 'Welcome to Imed Educational Platform'}
            </h2>
            <p className="text-gray-600 mb-6">
              {isAuthenticated ? 'No courses or content available at the moment.' : 'Please log in to view our content.'}
            </p>
            {!isAuthenticated && (
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
              >
                Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
