import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb';
import { bannerAdminService } from '@/services/admin-api';
import { Plus } from 'lucide-react';

export default async function BannersPage() {
  const banners = await bannerAdminService.getAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <AdminBreadcrumb items={[{ label: 'Banners' }]} />
          <h2 className="text-3xl font-bold tracking-tight mt-2">Banners</h2>
          <p className="text-muted-foreground">Manage homepage banners</p>
        </div>
        <Link href="/admin/banners/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Banner
          </Button>
        </Link>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No banners found</p>
            <Link href="/admin/banners/new">
              <Button>Create First Banner</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <Card key={banner.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {banner.title.uz || banner.title.en || banner.title.ru}
                    </CardTitle>
                    <CardDescription>
                      Order: {banner.order_num}
                    </CardDescription>
                  </div>
                  <Badge variant="outline">{banner.order_num}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={`/admin/banners/${banner.id}`} className="w-full">
                  <Button variant="outline" className="w-full">Edit</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

