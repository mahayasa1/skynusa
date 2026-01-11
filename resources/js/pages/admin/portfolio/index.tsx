// resources/js/pages/admin/portfolio/index.tsx
import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search,
    MoreVertical,
    Edit,
    Trash,
    Eye,
    Plus,
    Star,
    Image as ImageIcon,
    Filter
} from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface Service {
    id: number;
    title: string;
}

interface Company {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Portfolio {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    image: string;
    location: string;
    project_date: string;
    is_active: boolean;
    is_featured: boolean;
    order: number;
    created_at: string;
    service: Service;
    company: Company;
    category: Category;
}

interface Statistics {
    total: number;
    active: number;
    inactive: number;
    featured: number;
}

interface PortfolioIndexProps {
    portfolios: {
        data: Portfolio[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    services: Service[];
    filters: {
        search?: string;
        status?: string;
        service_id?: string;
        per_page?: number;
    };
    statistics: Statistics;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Portfolio', href: '/admin/portfolio' },
];

export default function PortfolioIndex({
    portfolios,
    services,
    filters,
    statistics
}: PortfolioIndexProps) {
    const [selectedPortfolios, setSelectedPortfolios] = useState<number[]>([]);
    const { data, setData } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
        service_id: filters.service_id || 'all',
        per_page: filters.per_page || 15,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchData = {
            ...data,
            status: data.status === 'all' ? '' : data.status,
            service_id: data.service_id === 'all' ? '' : data.service_id,
        };
        router.get('/admin/portfolio', searchData, { preserveState: true });
    };

    const handleBulkDelete = () => {
        if (selectedPortfolios.length === 0) return;
        if (confirm(`Hapus ${selectedPortfolios.length} portfolio?`)) {
            router.post('/admin/portfolio/bulk-destroy', {
                ids: selectedPortfolios,
            }, {
                onSuccess: () => setSelectedPortfolios([]),
            });
        }
    };

    const handleBulkUpdateStatus = (status: boolean) => {
        if (selectedPortfolios.length === 0) return;
        const statusText = status ? 'aktifkan' : 'nonaktifkan';
        if (confirm(`${statusText} ${selectedPortfolios.length} portfolio?`)) {
            router.post('/admin/portfolio/bulk-update-status', {
                ids: selectedPortfolios,
                status: status,
            }, {
                onSuccess: () => setSelectedPortfolios([]),
            });
        }
    };

    const toggleSelectAll = () => {
        if (selectedPortfolios.length === portfolios.data.length) {
            setSelectedPortfolios([]);
        } else {
            setSelectedPortfolios(portfolios.data.map((p) => p.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedPortfolios((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const statCards = [
        {
            title: 'Total Portfolio',
            value: statistics.total,
            icon: ImageIcon,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Aktif',
            value: statistics.active,
            icon: Eye,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'Tidak Aktif',
            value: statistics.inactive,
            icon: Eye,
            color: 'text-gray-600',
            bg: 'bg-gray-100',
        },
        {
            title: 'Featured',
            value: statistics.featured,
            icon: Star,
            color: 'text-yellow-600',
            bg: 'bg-yellow-100',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Portfolio" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Portfolio</h1>
                        <p className="text-gray-600 mt-1">Kelola portfolio proyek</p>
                    </div>
                    <Link href="/admin/portfolio/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Portfolio
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card, i) => (
                        <Card key={i} className="bg-white border-0 shadow-md">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                                        <p className="text-gray-600 text-sm mt-1">{card.title}</p>
                                    </div>
                                    <div className={`${card.bg} p-3 rounded-xl`}>
                                        <card.icon className={`w-6 h-6 ${card.color}`} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Filters */}
                <Card className="border-0 bg-white text-black shadow-md">
                    <CardContent className="p-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <h3 className="text-lg font-semibold">Filter Portfolio</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari judul, lokasi..."
                                        value={data.search}
                                        onChange={(e) => setData('search', e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Status</SelectItem>
                                        <SelectItem value="active">Aktif</SelectItem>
                                        <SelectItem value="inactive">Tidak Aktif</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={data.service_id}
                                    onValueChange={(value) => setData('service_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Layanan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Layanan</SelectItem>
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id.toString()}>
                                                {service.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button type="submit" className="w-full">
                                    Terapkan Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedPortfolios.length > 0 && (
                    <Card className="border-0 shadow-md bg-blue-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedPortfolios.length} portfolio dipilih
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleBulkUpdateStatus(true)}
                                    >
                                        Aktifkan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleBulkUpdateStatus(false)}
                                    >
                                        Nonaktifkan
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleBulkDelete}
                                    >
                                        <Trash className="mr-2 h-4 w-4" />
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Table */}
                <Card className="border-0 bg-white text-black shadow-md">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-300 hover:bg-gray-50">
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedPortfolios.length === portfolios.data.length && portfolios.data.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="text-black">Gambar</TableHead>
                                        <TableHead className="text-black">Judul</TableHead>
                                        <TableHead className="text-black">Layanan</TableHead>
                                        <TableHead className="text-black">Klien</TableHead>
                                        <TableHead className="text-black">Kategori</TableHead>
                                        <TableHead className="text-black">Lokasi</TableHead>
                                        <TableHead className="text-black">Status</TableHead>
                                        <TableHead className="text-black text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {portfolios.data.length > 0 ? (
                                        portfolios.data.map((portfolio) => (
                                            <TableRow key={portfolio.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedPortfolios.includes(portfolio.id)}
                                                        onCheckedChange={() => toggleSelect(portfolio.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {portfolio.image ? (
                                                        <img
                                                            src={`/storage/${portfolio.image}`}
                                                            alt={portfolio.title}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                                                            <ImageIcon className="h-6 w-6 text-gray-400" />
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">{portfolio.title}</p>
                                                        <p className="text-xs text-gray-500">{portfolio.short_description?.substring(0, 50)}...</p>
                                                        {portfolio.is_featured && (
                                                            <Badge className="mt-1 bg-yellow-100 text-yellow-800">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                Featured
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{portfolio.service.title}</TableCell>
                                                <TableCell>{portfolio.company.name}</TableCell>
                                                <TableCell>{portfolio.category.name}</TableCell>
                                                <TableCell>{portfolio.location || '-'}</TableCell>
                                                <TableCell>
                                                    <Badge className={portfolio.is_active ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'}>
                                                        {portfolio.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button className="bg-blue-200 hover:bg-blue-500" variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white text-gray-600">
                                                            <DropdownMenuItem asChild className="hover:bg-yellow-300">
                                                                <Link href={`/admin/portfolio/${portfolio.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/portfolio/${portfolio.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    router.patch(`/admin/portfolio/${portfolio.id}/toggle-status`);
                                                                }}
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                {portfolio.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    router.patch(`/admin/portfolio/${portfolio.id}/toggle-featured`);
                                                                }}
                                                            >
                                                                <Star className="mr-2 h-4 w-4" />
                                                                {portfolio.is_featured ? 'Unfeature' : 'Feature'}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => {
                                                                    if (confirm('Hapus portfolio ini?')) {
                                                                        router.delete(`/admin/portfolio/${portfolio.id}`);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Hapus
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                                Tidak ada portfolio ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {portfolios.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Menampilkan {portfolios.data.length} dari {portfolios.total} portfolio
                        </p>
                        <div className="flex gap-2">
                            {portfolios.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}