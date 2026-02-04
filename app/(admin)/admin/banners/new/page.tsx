'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { MultilanguageInput } from '@/components/admin/MultilanguageInput';
import { MultilanguageTextarea } from '@/components/admin/MultilanguageTextarea';
import { MultilanguageUrlInput } from '@/components/admin/MultilanguageUrlInput';
import { bannerAdminService } from '@/services/admin-api';
import { MultilanguageText, MultilanguageUrl } from '@/types/admin';

export default function NewBannerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image_url: { uz: '', ru: '', en: '' } as MultilanguageUrl,
    title: { uz: '', ru: '', en: '' } as MultilanguageText,
    description: { uz: '', ru: '', en: '' } as MultilanguageText,
    link_url: '',
    order_num: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bannerAdminService.create(formData);
      router.push('/admin/banners');
      router.refresh();
    } catch (error) {
      console.error('Error creating banner:', error);
      alert('Failed to create banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Banners', href: '/admin/banners' },
          { label: 'New Banner' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Create New Banner</CardTitle>
          <CardDescription>Add a new homepage banner</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Title"
              value={formData.title}
              onChange={(title) => setFormData({ ...formData, title })}
              placeholder="Banner title"
              required
            />

            <MultilanguageTextarea
              label="Description"
              value={formData.description}
              onChange={(description) => setFormData({ ...formData, description })}
              placeholder="Banner description"
              rows={4}
            />

            <MultilanguageUrlInput
              label="Image URL"
              value={formData.image_url}
              onChange={(image_url) => setFormData({ ...formData, image_url })}
              placeholder="https://example.com/image.jpg"
              required
            />

            <div className="space-y-2">
              <Label>
                Link URL
                <span className="text-destructive ml-1">*</span>
              </Label>
              <Input
                type="url"
                value={formData.link_url}
                onChange={(e) =>
                  setFormData({ ...formData, link_url: e.target.value })
                }
                placeholder="https://example.com"
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
                {loading ? 'Creating...' : 'Create Banner'}
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

