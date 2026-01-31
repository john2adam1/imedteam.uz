import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import {
  subjectAdminService,
  courseAdminService,
  moduleAdminService,
} from '@/services/admin-api';
import { Plus } from 'lucide-react';
import { notFound } from 'next/navigation';

interface ModulesPageProps {
  params: {
    id: string;
    courseId: string;
  };
}

export default async function ModulesPage({ params }: ModulesPageProps) {
  const [subject, course] = await Promise.all([
    subjectAdminService.getById(params.id),
    courseAdminService.getById(params.courseId),
  ]);

  if (!subject || !course) {
    notFound();
  }

  const modules = await moduleAdminService.getByCourse(params.courseId);

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
              },
              { label: 'Modules' },
            ]}
          />
          <h2 className="text-3xl font-bold tracking-tight mt-2">Modules</h2>
          <p className="text-muted-foreground">Manage modules for this course</p>
        </div>
        <Link
          href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/new`}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Module
          </Button>
        </Link>
      </div>

      {modules.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No modules found</p>
            <Link
              href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/new`}
            >
              <Button>Create First Module</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {module.name.uz || module.name.en || module.name.ru}
                    </CardTitle>
                    <CardDescription>Order: {module.order_num}</CardDescription>
                  </div>
                  <Badge variant="outline">{module.order_num}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${module.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">Edit</Button>
                  </Link>
                  <Link
                    href={`/admin/subjects/${params.id}/courses/${params.courseId}/modules/${module.id}/lessons`}
                    className="flex-1"
                  >
                    <Button className="w-full">Lessons</Button>
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

