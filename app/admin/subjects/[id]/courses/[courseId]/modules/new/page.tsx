'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MultilanguageInput } from '@/components/admin/MultilanguageInput';
import {
  subjectAdminService,
  courseAdminService,
  moduleAdminService,
} from '@/services/admin-api';
import { MultilanguageText } from '@/types/admin';

interface NewModulePageProps {
  params: {
    id: string;
    courseId: string;
  };
}

export default function NewModulePage({ params }: NewModulePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [formData, setFormData] = useState({
    course_id: params.courseId,
    order_num: 0,
    name: { uz: '', ru: '', en: '' } as MultilanguageText,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectData, courseData] = await Promise.all([
          subjectAdminService.getById(params.id),
          courseAdminService.getById(params.courseId),
        ]);
        setSubject(subjectData);
        setCourse(courseData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [params.id, params.courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await moduleAdminService.create(formData);
      router.push(
        `/admin/subjects/${params.id}/courses/${params.courseId}/modules`
      );
      router.refresh();
    } catch (error) {
      console.error('Error creating module:', error);
      alert('Failed to create module');
    } finally {
      setLoading(false);
    }
  };

  if (!subject || !course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
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
          { label: 'New Module' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Create New Module</CardTitle>
          <CardDescription>Add a new module to this course</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={formData.name}
              onChange={(name) => setFormData({ ...formData, name })}
              placeholder="Module name"
              required
            />

            <div className="space-y-2">
              <Label>
                Order Number
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                type="number"
                value={formData.order_num}
                onChange={(e) =>
                  setFormData({ ...formData, order_num: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Module'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

