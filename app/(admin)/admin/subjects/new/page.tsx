'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MultilanguageInput } from '@/components/admin/MultilanguageInput';
import { subjectAdminService } from '@/services/admin-api';
import { MultilanguageText } from '@/types/admin';

export default function NewSubjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image_url: '',
    order_num: 0,
    name: { uz: '', ru: '', en: '' } as MultilanguageText,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await subjectAdminService.create(formData);
      router.push('/admin/subjects');
      router.refresh();
    } catch (error) {
      console.error('Error creating subject:', error);
      alert('Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Subjects', href: '/admin/subjects' },
          { label: 'New Subject' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Create New Subject</CardTitle>
          <CardDescription>Add a new category/subject to the platform</CardDescription>
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
                {loading ? 'Creating...' : 'Create Subject'}
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

