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
import { Source, SourceType } from '@/types/admin';

interface EditSourcePageProps {
  params: {
    id: string;
    courseId: string;
    moduleId: string;
    lessonId: string;
    sourceId: string;
  };
}

export default function EditSourcePage({ params }: EditSourcePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [source, setSource] = useState<Source | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sourceData, subjectData, courseData, moduleData, lessonData] = await Promise.all([
          sourceAdminService.getById(params.sourceId),
          subjectAdminService.getById(params.id),
          courseAdminService.getById(params.courseId),
          moduleAdminService.getById(params.moduleId),
          lessonAdminService.getById(params.lessonId),
        ]);
        if (!sourceData) {
          router.push(
            `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}/sources`
          );
          return;
        }
        setSource(sourceData);
        setSubject(subjectData);
        setCourse(courseData);
        setModule(moduleData);
        setLesson(lessonData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [params.id, params.courseId, params.moduleId, params.lessonId, params.sourceId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source) return;

    setLoading(true);

    try {
      await sourceAdminService.update(params.sourceId, {
        lesson_id: source.lesson_id,
        order_num: source.order_num,
        type: source.type,
        name: source.name,
        url: source.url,
      });
      router.push(
        `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons/${params.lessonId}/sources`
      );
      router.refresh();
    } catch (error) {
      console.error('Error updating source:', error);
      alert('Failed to update source');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (!source || !subject || !course || !module || !lesson) {
    return <div>Source not found</div>;
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
          { label: 'Edit Source' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Edit Source</CardTitle>
          <CardDescription>Update source information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={source.name}
              onChange={(name) => setSource({ ...source, name })}
              placeholder="Source name"
              required
            />

            <div className="space-y-2">
              <Label>
                Type
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={source.type}
                onValueChange={(value) =>
                  setSource({ ...source, type: value as SourceType })
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
              value={source.url}
              onChange={(url) => setSource({ ...source, url })}
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
                value={source.order_num}
                onChange={(e) =>
                  setSource({ ...source, order_num: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Source'}
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

