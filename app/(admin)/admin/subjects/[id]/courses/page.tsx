import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { subjectAdminService, courseAdminService } from '@/services/admin-api';
import { Plus } from 'lucide-react';
import { notFound } from 'next/navigation';

interface CoursesPageProps {
  params: {
    id: string;
  };
}

export default async function CoursesPage({ params }: CoursesPageProps) {
  const subject = await subjectAdminService.getById(params.id);
  if (!subject) {
    notFound();
  }

  const courses = await courseAdminService.getBySubject(params.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBreadcrumb
            items={[
              { label: 'Subjects', href: '/admin/subjects' },
              { label: subject.name.uz || subject.name.en || subject.name.ru },
              { label: 'Courses' },
            ]}
          />
          <h2 className="text-3xl font-bold tracking-tight mt-2">Courses</h2>
          <p className="text-muted-foreground">
            Manage courses for this subject
          </p>
        </div>
        <Link href={`/admin/subjects/${params.id}/courses/new`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No courses found</p>
            <Link href={`/admin/subjects/${params.id}/courses/new`}>
              <Button>Create First Course</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {course.name.uz || course.name.en || course.name.ru}
                    </CardTitle>
                    <CardDescription>
                      Order: {course.order_num}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={course.is_public ? 'default' : 'secondary'}>
                      {course.is_public ? 'Public' : 'Private'}
                    </Badge>
                    <Badge variant="outline">{course.order_num}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/subjects/${params.id}/courses/${course.id}`}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">Edit</Button>
                  </Link>
                  <Link
                    href={`/admin/subjects/${params.id}/courses/${course.id}/modules`}
                    className="flex-1"
                  >
                    <Button className="w-full">Modules</Button>
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

