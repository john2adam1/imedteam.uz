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
import { MultilanguageUrlInput } from '@/components/admin/MultilanguageUrlInput';
import {
  subjectAdminService,
  courseAdminService,
  moduleAdminService,
  lessonAdminService,
  sourceAdminService,
} from '@/services/admin-api';
import { MultilanguageText, MultilanguageUrl, SourceType } from '@/types/admin';

interface NewSourcePageProps {
  params: {
    id: string;
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

export default function NewSourcePage({ params }: NewSourcePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [formData, setFormData] = useState({
    lesson_id: params.lessonId,
    order_num: 0,
    type: 'video' as SourceType,
    name: { uz: '', ru: '', en: '' } as MultilanguageText,
    url: { uz: '', ru: '', en: '' } as MultilanguageUrl,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectData, courseData, moduleData, lessonData] = await Promise.all([
          subjectAdminService.getById(params.id),
          courseAdminService.getById(params.courseId),
          moduleAdminService.getById(params.moduleId),
          lessonAdminService.getById(params.lessonId),
        ]);
        setSubject(subjectData);
        setCourse(courseData);
        setModule(moduleData);
        setLesson(lessonData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [params.id, params.courseId, params.moduleId, params.lessonId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sourceAdminService.create(formData);
      router.push(
        `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}/sources`
      );
      router.refresh();
    } catch (error) {
      console.error('Error creating source:', error);
      alert('Failed to create source');
    } finally {
      setLoading(false);
    }
  };

  if (!subject || !course || !module || !lesson) {
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
          {
            label: lesson.name.uz || lesson.name.en || lesson.name.ru,
            href: `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}/sources`,
          },
          { label: 'New Source' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Create New Source</CardTitle>
          <CardDescription>Add a new source to this lesson</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={formData.name}
              onChange={(name) => setFormData({ ...formData, name })}
              placeholder="Source name"
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
                  setFormData({ ...formData, type: value as SourceType })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="test">Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <MultilanguageUrlInput
              label="URL"
              value={formData.url}
              onChange={(url) => setFormData({ ...formData, url })}
              placeholder="https://example.com/resource"
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
                {loading ? 'Creating...' : 'Create Source'}
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

