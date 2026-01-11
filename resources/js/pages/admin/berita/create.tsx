import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Upload, X, Save, Eye } from 'lucide-react';

interface BeritaCreateProps {
  categories: Record<string, string>;
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Berita', href: '/admin/berita' },
  { title: 'Tambah Berita', href: '/admin/berita/create' },
];

export default function AdminBeritaCreate({ categories }: BeritaCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    excerpt: '',
    content: '',
    featured_image: null as File | null,
    gallery: [] as File[],
    category: '',
    tags: [] as string[],
    is_published: false,
    is_featured: false,
    published_at: '',
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('featured_image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFeaturedImage = () => {
    setData('featured_image', null);
    setFeaturedPreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setData('gallery', [...data.gallery, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setData('gallery', data.gallery.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
      setData('tags', [...data.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setData('tags', data.tags.filter(t => t !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/admin/berita', {
      forceFormData: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Berita" />

      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/berita">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Berita Baru</h1>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <ul className="list-disc list-inside">
                {Object.values(errors).map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Informasi Berita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Judul Berita *</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    placeholder="Masukkan judul berita"
                    className="mt-1"
                  />
                  {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="excerpt">Ringkasan</Label>
                  <Textarea
                    id="excerpt"
                    value={data.excerpt}
                    onChange={e => setData('excerpt', e.target.value)}
                    placeholder="Ringkasan singkat berita (opsional)"
                    rows={3}
                    className="mt-1"
                  />
                  {errors.excerpt && <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>}
                </div>

                <div>
                  <Label htmlFor="content">Konten Berita *</Label>
                  <Textarea
                    id="content"
                    value={data.content}
                    onChange={e => setData('content', e.target.value)}
                    placeholder="Tulis konten berita di sini..."
                    rows={15}
                    className="mt-1 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gunakan HTML untuk formatting (contoh: &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, dll)
                  </p>
                  {errors.content && <p className="text-sm text-red-600 mt-1">{errors.content}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Gambar Utama</CardTitle>
              </CardHeader>
              <CardContent>
                {featuredPreview ? (
                  <div className="relative">
                    <img
                      src={featuredPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeFeaturedImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">Upload gambar utama</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFeaturedImageChange}
                      className="hidden"
                      id="featured-image"
                    />
                    <label htmlFor="featured-image">
                      <Button type="button" className='bg-white' variant="outline" size="sm" asChild>
                        <span>Pilih Gambar</span>
                      </Button>
                    </label>
                  </div>
                )}
                {errors.featured_image && (
                  <p className="text-sm text-red-600 mt-2">{errors.featured_image}</p>
                )}
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Galeri (Opsional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGalleryChange}
                  className="hidden"
                  id="gallery"
                />
                <label htmlFor="gallery">
                  <Button type="button" className='bg-white' variant="outline" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      Tambah Gambar
                    </span>
                  </Button>
                </label>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>SEO (Opsional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={data.meta_title}
                    onChange={e => setData('meta_title', e.target.value)}
                    placeholder="Judul untuk SEO"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={data.meta_description}
                    onChange={e => setData('meta_description', e.target.value)}
                    placeholder="Deskripsi untuk SEO"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="meta_keywords">Meta Keywords</Label>
                  <Input
                    id="meta_keywords"
                    value={data.meta_keywords}
                    onChange={e => setData('meta_keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Publish Settings */}
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Pengaturan Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="is_published">Publish Sekarang</Label>
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={data.is_published}
                    onChange={e => setData('is_published', e.target.checked)}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="is_featured">Featured</Label>
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={data.is_featured}
                    onChange={e => setData('is_featured', e.target.checked)}
                    className="rounded"
                  />
                </div>

                <div>
                  <Label htmlFor="published_at">Tanggal Publish</Label>
                  <Input
                    type="datetime-local"
                    id="published_at"
                    value={data.published_at}
                    onChange={e => setData('published_at', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card className="bg-white text-black">
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={data.category}
                  onChange={e => setData('category', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Pilih Kategori</option>
                  {Object.entries(categories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className='bg-white text-black'>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Tambah tag"
                  />
                  <Button className='bg-white' type="button" onClick={addTag} variant="outline">
                    +
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className='bg-white text-black'>
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={processing}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {processing ? 'Menyimpan...' : 'Simpan Berita'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}