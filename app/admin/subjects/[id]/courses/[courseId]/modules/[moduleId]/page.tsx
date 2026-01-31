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
import { Module } from '@/types/admin';

interface EditModulePageProps {
  params: {
    id: string;
    courseId: string;
    moduleId: string;
  };
}

export default function EditModulePage({ params }: EditModulePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [module, setModule] = useState<Module | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [moduleData, subjectData, courseData] = await Promise.all([
          moduleAdminService.getById(params.moduleId),
          subjectAdminService.getById(params.id),
          courseAdminService.getById(params.courseId),
        ]);
        if (!moduleData) {
          router.push(
            `/admin/subjects/${params.id}/courses/${params.courseId}/modules`
          );
          return;
        }
        setModule(moduleData);
        setSubject(subjectData);
        setCourse(courseData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [params.id, params.courseId, params.moduleId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!module) return;

    setLoading(true);

    try {
      await moduleAdminService.update(params.moduleId, {
        course_id: module.course_id,
        order_num: module.order_num,
        name: module.name,
      });
      router.push(
        `/admin/subjects/${params.id}/courses/${params.courseId}/modules`
      );
      router.refresh();
    } catch (error) {
      console.error('Error updating module:', error);
      alert('Failed to update module');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (!module || !subject || !course) {
    return <div>Module not found</div>;
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
          { label: 'Edit Module' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Edit Module</CardTitle>
          <CardDescription>Update module information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={module.name}
              onChange={(name) => setModule({ ...module, name })}
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
                value={module.order_num}
                onChange={(e) =>
                  setModule({ ...module, order_num: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Module'}
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

