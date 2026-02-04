import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import {
  subjectAdminService,
  courseAdminService,
  moduleAdminService,
  lessonAdminService,
} from '@/services/admin-api';
import { Plus } from 'lucide-react';
import { notFound } from 'next/navigation';

interface LessonsPageProps {
  params: {
    id: string;
    courseId: string;
    moduleId: string;
  };
}

export default async function LessonsPage({ params }: LessonsPageProps) {
  const [subject, course, module] = await Promise.all([
    subjectAdminService.getById(params.id),
    courseAdminService.getById(params.courseId),
    moduleAdminService.getById(params.moduleId),
  ]);

  if (!subject || !course || !module) {
    notFound();
  }

  const lessons = await lessonAdminService.getByModule(params.moduleId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBreadcrumb
            items={[
              { label: 'Subjects', href: '/admin/subjects' },
              { label: subject.name.uz || subject.name.en || subject.name.ru },
              {
                label: 'Courses',
                href: `/admin/subjects/${params.id}/courses`,
              },
              {
                label: course.name.uz || course.name.en || course.name.ru,
                href: `/admin/subjects/${params.id}/courses/${params.courseId}/modules`,
              },
              {
                label: module.name.uz || module.name.en || module.name.ru,
              },
              { label: 'Lessons' },
            ]}
          />
          <h2 className="text-3xl font-bold tracking-tight mt-2">Lessons</h2>
          <p className="text-muted-foreground">Manage lessons for this module</p>
        </div>
        <Link
          href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/new`}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Lesson
          </Button>
        </Link>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No lessons found</p>
            <Link
              href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/new`}
            >
              <Button>Create First Lesson</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => (
            <Card key={lesson.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {lesson.name.uz || lesson.name.en || lesson.name.ru}
                    </CardTitle>
                    <CardDescription>
                      Order: {lesson.order_num} • Duration: {lesson.duration} min
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary">{lesson.type}</Badge>
                    <Badge variant="outline">{lesson.order_num}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${lesson.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">Edit</Button>
                  </Link>
                  <Link
                    href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${lesson.id}/sources`}
                    className="flex-1"
                  >
                    <Button className="w-full">Sources</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

