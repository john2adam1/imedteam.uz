'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MultilanguageInput } from '@/components/admin/MultilanguageInput';
import {
  subjectAdminService,
  courseAdminService,
  moduleAdminService,
  lessonAdminService,
} from '@/services/admin-api';
import { MultilanguageText, LessonType } from '@/types/admin';

interface NewLessonPageProps {
  params: {
    id: string;
    courseId: string;
    moduleId: string;
  };
}

export default function NewLessonPage({ params }: NewLessonPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [formData, setFormData] = useState({
    module_id: params.moduleId,
    duration: 0,
    order_num: 0,
    type: 'video' as LessonType,
    name: { uz: '', ru: '', en: '' } as MultilanguageText,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectData, courseData, moduleData] = await Promise.all([
          subjectAdminService.getById(params.id),
          courseAdminService.getById(params.courseId),
          moduleAdminService.getById(params.moduleId),
        ]);
        setSubject(subjectData);
        setCourse(courseData);
        setModule(moduleData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [params.id, params.courseId, params.moduleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await lessonAdminService.create(formData);
      router.push(
        `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons`
      );
      router.refresh();
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  if (!subject || !course || !module) {
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
          {
            label: module.name.uz || module.name.en || module.name.ru,
            href: `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons`,
          },
          { label: 'New Lesson' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Create New Lesson</CardTitle>
          <CardDescription>Add a new lesson to this module</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={formData.name}
              onChange={(name) => setFormData({ ...formData, name })}
              placeholder="Lesson name"
              required
            />

            <div className="space-y-2">
              <Label>
                Type
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as LessonType })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lesson type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Duration (minutes)
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
            </div>

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
                {loading ? 'Creating...' : 'Create Lesson'}
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

