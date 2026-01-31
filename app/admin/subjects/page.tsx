import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { subjectAdminService } from '@/services/admin-api';
import { Plus } from 'lucide-react';

export default async function SubjectsPage() {
  const subjects = await subjectAdminService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBreadcrumb items={[{ label: 'Subjects' }]} />
          <h2 className="text-3xl font-bold tracking-tight mt-2">Subjects</h2>
          <p className="text-muted-foreground">Manage categories and subjects</p>
        </div>
        <Link href="/admin/subjects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Subject
          </Button>
        </Link>
      </div>

      {subjects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No subjects found</p>
            <Link href="/admin/subjects/new">
              <Button>Create First Subject</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {subject.name.uz || subject.name.en || subject.name.ru}
                    </CardTitle>
                    <CardDescription>
                      Order: {subject.order_num}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{subject.order_num}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Link href={`/admin/subjects/${subject.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">Edit</Button>
                  </Link>
                  <Link href={`/admin/subjects/${subject.id}/courses`} className="flex-1">
                    <Button className="w-full">Courses</Button>
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

