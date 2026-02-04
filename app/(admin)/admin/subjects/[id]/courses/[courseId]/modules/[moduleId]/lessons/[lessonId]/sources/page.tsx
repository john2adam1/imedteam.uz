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
  sourceAdminService,
} from '@/services/admin-api';
import { Plus } from 'lucide-react';
import { notFound } from 'next/navigation';

interface SourcesPageProps {
  params: {
    id: string;
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

export default async function SourcesPage({ params }: SourcesPageProps) {
  const [subject, course, module, lesson] = await Promise.all([
    subjectAdminService.getById(params.id),
    courseAdminService.getById(params.courseId),
    moduleAdminService.getById(params.moduleId),
    lessonAdminService.getById(params.lessonId),
  ]);

  if (!subject || !course || !module || !lesson) {
    notFound();
  }

  const sources = await sourceAdminService.getByLesson(params.lessonId);

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
                href: `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons`,
              },
              {
                label: lesson.name.uz || lesson.name.en || lesson.name.ru,
              },
              { label: 'Sources' },
            ]}
          />
          <h2 className="text-3xl font-bold tracking-tight mt-2">Sources</h2>
          <p className="text-muted-foreground">Manage sources for this lesson</p>
        </div>
        <Link
          href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}/sources/new`}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Source
          </Button>
        </Link>
      </div>

      {sources.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No sources found</p>
            <Link
              href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}/sources/new`}
            >
              <Button>Create First Source</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {source.name.uz || source.name.en || source.name.ru}
                    </CardTitle>
                    <CardDescription>Order: {source.order_num}</CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary">{source.type}</Badge>
                    <Badge variant="outline">{source.order_num}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}/sources/${source.id}`}
                  className="w-full"
                >
                  <Button variant="outline" className="w-full">Edit</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

