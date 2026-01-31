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
import { Lesson, LessonType } from '@/types/admin';

interface EditLessonPageProps {
  params: {
    id: string;
    courseId: string;
    moduleId: string;
    lessonId: string;
  };
}

export default function EditLessonPage({ params }: EditLessonPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [lessonData, subjectData, courseData, moduleData] = await Promise.all([
          lessonAdminService.getById(params.lessonId),
          subjectAdminService.getById(params.id),
          courseAdminService.getById(params.courseId),
          moduleAdminService.getById(params.moduleId),
        ]);
        if (!lessonData) {
          router.push(
            `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons`
          );
          return;
        }
        setLesson(lessonData);
        setSubject(subjectData);
        setCourse(courseData);
        setModule(moduleData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [params.id, params.courseId, params.moduleId, params.lessonId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lesson) return;

    setLoading(true);

    try {
      await lessonAdminService.update(params.lessonId, {
        module_id: lesson.module_id,
        duration: lesson.duration,
        order_num: lesson.order_num,
        type: lesson.type,
        name: lesson.name,
      });
      router.push(
        `/admin/subjects/${params.id}/courses/${params.courseId}/modules/${params.moduleId}/lessons`
      );
      router.refresh();
    } catch (error) {
      console.error('Error updating lesson:', error);
      alert('Failed to update lesson');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (!lesson || !subject || !course || !module) {
    return <div>Lesson not found</div>;
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
          { label: 'Edit Lesson' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Edit Lesson</CardTitle>
          <CardDescription>Update lesson information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={lesson.name}
              onChange={(name) => setLesson({ ...lesson, name })}
              placeholder="Lesson name"
              required
            />

            <div className="space-y-2">
              <Label>
                Type
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={lesson.type}
                onValueChange={(value) =>
                  setLesson({ ...lesson, type: value as LessonType })
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
                value={lesson.duration}
                onChange={(e) =>
                  setLesson({ ...lesson, duration: parseInt(e.target.value) || 0 })
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
                value={lesson.order_num}
                onChange={(e) =>
                  setLesson({ ...lesson, order_num: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Lesson'}
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

