'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MultilanguageInput } from '@/components/admin/MultilanguageInput';
import { subjectAdminService } from '@/services/admin-api';
import { Subject, MultilanguageText } from '@/types/admin';

interface EditSubjectPageProps {
  params: {
    id: string;
  };
}

export default function EditSubjectPage({ params }: EditSubjectPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState<Subject | null>(null);

  useEffect(() => {
    const loadSubject = async () => {
      try {
        const subject = await subjectAdminService.getById(params.id);
        if (!subject) {
          router.push('/admin/subjects');
          return;
        }
        setFormData(subject);
      } catch (error) {
        console.error('Error loading subject:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadSubject();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setLoading(true);

    try {
      await subjectAdminService.update(params.id, {
        image_url: formData.image_url,
        order_num: formData.order_num,
        name: formData.name,
      });
      router.push('/admin/subjects');
      router.refresh();
    } catch (error) {
      console.error('Error updating subject:', error);
      alert('Failed to update subject');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (!formData) {
    return <div>Subject not found</div>;
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Subjects', href: '/admin/subjects' },
          { label: 'Edit Subject' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Edit Subject</CardTitle>
          <CardDescription>Update subject information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Name"
              value={formData.name}
              onChange={(name) => setFormData({ ...formData, name })}
              placeholder="Subject name"
              required
            />

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
                {loading ? 'Updating...' : 'Update Subject'}
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

