import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  User,
  Eye,
  Tag,
  CheckCircle2,
  XCircle,
  Star,
  ExternalLink,
} from 'lucide-react';

interface Berita {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  gallery: string[] | null;
  category: string | null;
  tags: string[] | null;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  views: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    email: string;
  };
}

interface BeritaShowProps {
  berita: Berita;
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Berita', href: '/admin/berita' },
  { title: 'Detail Berita', href: '#' },
];

export default function AdminBeritaShow({ berita }: BeritaShowProps) {
  const handleDelete = () => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      router.delete(`/admin/berita/${berita.id}`);
    }
  };

  const handleTogglePublish = () => {
    router.patch(`/admin/berita/${berita.id}/toggle-publish`);
  };

  const handleToggleFeatured = () => {
    router.patch(`/admin/berita/${berita.id}/toggle-featured`);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={berita.title} />

      <div className="p-6 max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/berita">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Detail Berita</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/berita/${berita.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Lihat di Web
              </Button>
            </Link>
            <Link href={`/admin/berita/${berita.id}/edit`}>
                <Button size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Article Info */}
            <Card className='bg-white text-black'>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{berita.title}</CardTitle>
                    {berita.excerpt && (
                      <p className="text-gray-600 text-lg">{berita.excerpt}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {berita.is_published ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700">
                        <XCircle className="w-3 h-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                    {berita.is_featured && (
                      <Badge className="bg-purple-100 text-purple-700">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{berita.user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(berita.published_at)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{berita.views} views</span>
                  </div>
                </div>

                {/* Featured Image */}
                {berita.featured_image && (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={`/storage/${berita.featured_image}`}
                      alt={berita.title}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Content */}
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: berita.content }}
                />

                {/* Gallery */}
                {berita.gallery && berita.gallery.length > 0 && (
                  <div className="pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Galeri</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {berita.gallery.map((image, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <img
                            src={`/storage/${image}`}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {berita.tags && berita.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t">
                    <Tag className="w-5 h-5 text-gray-400" />
                    {berita.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SEO Info */}
            {(berita.meta_title || berita.meta_description || berita.meta_keywords) && (
              <Card className='bg-white text-black'>
                <CardHeader>
                  <CardTitle>Informasi SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {berita.meta_title && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Meta Title</p>
                      <p className="text-gray-900">{berita.meta_title}</p>
                    </div>
                  )}
                  {berita.meta_description && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Meta Description</p>
                      <p className="text-gray-900">{berita.meta_description}</p>
                    </div>
                  )}
                  {berita.meta_keywords && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Meta Keywords</p>
                      <p className="text-gray-900">{berita.meta_keywords}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card className='bg-white text-black'>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={handleTogglePublish}
                  variant="outline"
                  className="w-full justify-start bg-white"
                >
                  {berita.is_published ? (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Publish
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleToggleFeatured}
                  variant="outline"
                  className="w-full justify-start bg-white"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {berita.is_featured ? 'Unfeature' : 'Feature'}
                </Button>
              </CardContent>
            </Card>

            {/* Details */}
            <Card className='bg-white text-black'>
              <CardHeader>
                <CardTitle>Detail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Penulis</p>
                  <p className="font-medium">{berita.user.name}</p>
                  <p className="text-gray-500">{berita.user.email}</p>
                </div>

                {berita.category && (
                  <div>
                    <p className="text-gray-600 mb-1">Kategori</p>
                    <Badge>{berita.category}</Badge>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 mb-1">Slug</p>
                  <code className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {berita.slug}
                  </code>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Tanggal Dibuat</p>
                  <p className="font-medium">{formatDate(berita.created_at)}</p>
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Terakhir Diupdate</p>
                  <p className="font-medium">{formatDate(berita.updated_at)}</p>
                </div>

                {berita.published_at && (
                  <div>
                    <p className="text-gray-600 mb-1">Tanggal Publish</p>
                    <p className="font-medium">{formatDate(berita.published_at)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card className='bg-white text-black'>
              <CardHeader>
                <CardTitle>Statistik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{berita.views}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}