'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MultilanguageInput } from '@/components/admin/MultilanguageInput';
import { MultilanguageTextarea } from '@/components/admin/MultilanguageTextarea';
import {
  courseAdminService,
  teacherAdminService,
  subjectAdminService,
} from '@/services/admin-api';
import { Course } from '@/types/admin';

interface EditCoursePageProps {
  params: {
    id: string;
    courseId: string;
  };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [courseData, subjectData, teachersData] = await Promise.all([
          courseAdminService.getById(params.courseId),
          subjectAdminService.getById(params.id),
          teacherAdminService.getAll(),
        ]);
        if (!courseData) {
          router.push(`/admin/subjects/${params.id}/courses`);
          return;
        }
        setCourse(courseData);
        setSubject(subjectData);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
  }, [params.id, params.courseId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    setLoading(true);

    try {
      await courseAdminService.update(params.courseId, {
        subject_id: course.subject_id,
        teacher_id: course.teacher_id,
        image_url: course.image_url,
        is_public: course.is_public,
        order_num: course.order_num,
        price: course.price,
        name: course.name,
        description: course.description,
      });
      router.push(`/admin/subjects/${params.id}/courses`);
      router.refresh();
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (!course || !subject) {
    return <div>Course not found</div>;
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
          { label: 'Edit Course' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Edit Course</CardTitle>
          <CardDescription>Update course information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={course.name}
              onChange={(name) => setCourse({ ...course, name })}
              placeholder="Course name"
              required
            />

            <MultilanguageTextarea
              label="Description"
              value={course.description}
              onChange={(description) => setCourse({ ...course, description })}
              placeholder="Course description"
              rows={4}
            />

            <div className="space-y-2">
              <Label>
                Teacher
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={course.teacher_id}
                onValueChange={(value) =>
                  setCourse({ ...course, teacher_id: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Image URL
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                type="url"
                value={course.image_url}
                onChange={(e) =>
                  setCourse({ ...course, image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <MultilanguageInput
              label="Price"
              value={course.price}
              onChange={(price) => setCourse({ ...course, price })}
              placeholder="0"
              required
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={course.is_public}
                onCheckedChange={(checked) =>
                  setCourse({ ...course, is_public: checked })
                }
              />
              <Label htmlFor="is_public">Public Course</Label>
            </div>

            <div className="space-y-2">
              <Label>
                Order Number
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                type="number"
                value={course.order_num}
                onChange={(e) =>
                  setCourse({ ...course, order_num: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Course'}
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

