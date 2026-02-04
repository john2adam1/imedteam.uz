'use client';

import { useState, useEffect } from 'react';
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
import { Banner } from '@/types/admin';

interface EditBannerPageProps {
  params: {
    id: string;
  };
}

export default function EditBannerPage({ params }: EditBannerPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        const bannerData = await bannerAdminService.getById(params.id);
        if (!bannerData) {
          router.push('/admin/banners');
          return;
        }
        setBanner(bannerData);
      } catch (error) {
        console.error('Error loading banner:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadBanner();
  }, [params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!banner) return;

    setLoading(true);

    try {
      await bannerAdminService.update(params.id, {
        image_url: banner.image_url,
        title: banner.title,
        description: banner.description,
        link_url: banner.link_url,
        order_num: banner.order_num,
      });
      router.push('/admin/banners');
      router.refresh();
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Failed to update banner');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  if (!banner) {
    return <div>Banner not found</div>;
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: 'Banners', href: '/admin/banners' },
          { label: 'Edit Banner' },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Edit Banner</CardTitle>
          <CardDescription>Update banner information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <MultilanguageInput
              label="Title"
              value={banner.title}
              onChange={(title) => setBanner({ ...banner, title })}
              placeholder="Banner title"
              required
            />

            <MultilanguageTextarea
              label="Description"
              value={banner.description}
              onChange={(description) => setBanner({ ...banner, description })}
              placeholder="Banner description"
              rows={4}
            />

            <MultilanguageUrlInput
              label="Image URL"
              value={banner.image_url}
              onChange={(image_url) => setBanner({ ...banner, image_url })}
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
                value={banner.link_url}
                onChange={(e) =>
                  setBanner({ ...banner, link_url: e.target.value })
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
                value={banner.order_num}
                onChange={(e) =>
                  setBanner({ ...banner, order_num: parseInt(e.target.value) || 0 })
                }
                required
                min="0"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Banner'}
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

