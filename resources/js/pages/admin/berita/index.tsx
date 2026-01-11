import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import berita from '@/routes/berita';

interface Berita {
  id: number;
  title: string;
  slug: string;
  category: string;
  is_published: boolean;
  is_featured: boolean;
  published_at: string;
  views: number;
  user: {
    name: string;
  };
}

interface BeritaIndexProps {
  beritas: {
    data: Berita[];
    links: any[];
    current_page: number;
  };
  filters: {
    search?: string;
    status?: string;
    category?: string;
  };
  categories: Record<string, string>;
  statistics: {
    total: number;
    published: number;
    draft: number;
    featured: number;
    total_views: number;
  };
}

const breadcrumbs = [
  { title: 'Dashboard', href: '/admin/dashboard' },
  { title: 'Berita', href: '/admin/berita' },
];

export default function AdminBeritaIndex({ beritas, filters, categories, statistics }: BeritaIndexProps) {
  const [search, setSearch] = useState(filters.search || '');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get('/admin/berita', { search, status: filters.status, category: filters.category }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleStatusFilter = (status: string) => {
    router.get('/admin/berita', { search, status, category: filters.category }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleCategoryFilter = (category: string) => {
    router.get('/admin/berita', { search, status: filters.status, category }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
      router.delete(`/admin/berita/${id}`);
    }
  };

  const handleTogglePublish = (id: number) => {
    router.patch(`/admin/berita/${id}/toggle-publish`);
  };

  const handleToggleFeatured = (id: number) => {
    router.patch(`/admin/berita/${id}/toggle-featured`);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      alert('Pilih berita yang ingin dihapus');
      return;
    }
    if (confirm(`Hapus ${selectedIds.length} berita?`)) {
      router.post('/admin/berita/bulk-destroy', { ids: selectedIds });
      setSelectedIds([]);
    }
  };

  const handleBulkPublish = () => {
    if (selectedIds.length === 0) {
      alert('Pilih berita yang ingin dipublikasikan');
      return;
    }
    router.post('/admin/berita/bulk-update-status', { ids: selectedIds, status: true });
    setSelectedIds([]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === beritas.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(beritas.data.map(b => b.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Berita Management" />

      <div className="p-6 space-y-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className='bg-white'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                  <p className="text-sm text-gray-600">Total Berita</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{statistics.published}</p>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{statistics.draft}</p>
                  <p className="text-sm text-gray-600">Draft</p>
                </div>
                <XCircle className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-600">{statistics.featured}</p>
                  <p className="text-sm text-gray-600">Featured</p>
                </div>
                <Star className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className='bg-white'>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{statistics.total_views}</p>
                  <p className="text-sm text-gray-600">Total Views</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className='bg-white'>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-black">Daftar Berita</CardTitle>
              <Link href="/admin/berita/create">
                <Button className='bg-gray-200'>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Berita
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Cari berita..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} variant="outline" className='bg-white text-black'>
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm text-black"
                >
                  <option value="">Semua Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={filters.category || ''}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="text-black px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Semua Kategori</option>
                  {Object.entries(categories).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  {selectedIds.length} berita dipilih
                </span>
                <Button onClick={handleBulkPublish} size="sm" variant="outline">
                  Publish
                </Button>
                <Button onClick={handleBulkDelete} size="sm" variant="destructive">
                  Hapus
                </Button>
              </div>
            )}

            {/* Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white w-12">
                      <Checkbox
                        checked={selectedIds.length === beritas.data.length}
                        onCheckedChange ={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className='text-black text-center'>Judul</TableHead>
                    <TableHead className='text-black'>Kategori</TableHead>
                    <TableHead className='text-black'>Penulis</TableHead>
                    <TableHead className='text-black text-center'>Status</TableHead>
                    <TableHead className='text-black'>Views</TableHead>
                    <TableHead className='text-black'>Tanggal</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beritas.data.length > 0 ? (
                    beritas.data.map((berita) => (
                      <TableRow key={berita.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.includes(berita.id)}
                          onCheckedChange={() => toggleSelect(berita.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium text-gray-900">{berita.title}</p>
                            {berita.is_featured && (
                              <Badge variant="secondary" className="mt-1">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {berita.category ? (
                          <Badge>{categories[berita.category]}</Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {berita.user.name}
                      </TableCell>
                      <TableCell>
                        {berita.is_published ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-700">
                            Draft
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {berita.views}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(berita.published_at)}
                      </TableCell>
                      <TableCell className="text-right text-black">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className='bg-white text-black' align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/berita/${berita.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Lihat
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/berita/${berita.id}/edit`}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTogglePublish(berita.id)}>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              {berita.is_published ? 'Unpublish' : 'Publish'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleFeatured(berita.id)}>
                              <Star className="w-4 h-4 mr-2" />
                              {berita.is_featured ? 'Unfeature' : 'Feature'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(berita.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                   ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                Tidak ada Berita ditemukan
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {beritas.links.length > 3 && (
              <div className="flex justify-center gap-1">
                {beritas.links.map((link, index) => (
                  <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}