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
import { courseAdminService, teacherAdminService, subjectAdminService } from '@/services/admin-api';
import { MultilanguageText } from '@/types/admin';

interface NewCoursePageProps {
  params: {
    id: string;
  };
}

export default function NewCoursePage({ params }: NewCoursePageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    subject_id: params.id,
    teacher_id: '',
    image_url: '',
    is_public: false,
    order_num: 0,
    price: { uz: '', ru: '', en: '' } as MultilanguageText,
    name: { uz: '', ru: '', en: '' } as MultilanguageText,
    description: { uz: '', ru: '', en: '' } as MultilanguageText,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [subjectData, teachersData] = await Promise.all([
          subjectAdminService.getById(params.id),
          teacherAdminService.getAll(),
        ]);
        setSubject(subjectData);
        setTeachers(teachersData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await courseAdminService.create(formData);
      router.push(`/admin/subjects/${params.id}/courses`);
      router.refresh();
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (!subject) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Subjects', href: '/admin/subjects' },
          { label: subject.name.uz || subject.name.en || subject.name.ru },
          { label: 'Courses', href: `/admin/subjects/${params.id}/courses` },
          { label: 'New Course' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
          <CardDescription>Add a new course to this subject</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={formData.name}
              onChange={(name) => setFormData({ ...formData, name })}
              placeholder="Course name"
              required
            />

            <MultilanguageTextarea
              label="Description"
              value={formData.description}
              onChange={(description) => setFormData({ ...formData, description })}
              placeholder="Course description"
              rows={4}
            />

            <div className="space-y-2">
              <Label>
                Teacher
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Select
                value={formData.teacher_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, teacher_id: value })
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
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <MultilanguageInput
              label="Price"
              value={formData.price}
              onChange={(price) => setFormData({ ...formData, price })}
              placeholder="0"
              required
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={formData.is_public}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_public: checked })
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
                {loading ? 'Creating...' : 'Create Course'}
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

