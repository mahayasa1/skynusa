// resources/js/pages/admin/company/index.tsx
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
    Filter,
    Building2,
    CheckCircle,
    XCircle
} from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface Company {
    id: number;
    name: string;
    slug: string;
    logo: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    is_active: boolean;
    created_at: string;
}

interface Statistics {
    total: number;
    active: number;
    inactive: number;
}

interface CompanyIndexProps {
    companies: {
        data: Company[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
        per_page?: number;
    };
    statistics: Statistics;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Companies', href: '/admin/companies' },
];

export default function CompanyIndex({ 
    companies, 
    filters, 
    statistics 
}: CompanyIndexProps) {
    const [selectedCompanies, setSelectedCompanies] = useState<number[]>([]);
    const { data, setData } = useForm({
        search: filters.search || '',
        status: filters.status || 'all',
        per_page: filters.per_page || 15,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const searchData = {
            ...data,
            status: data.status === 'all' ? '' : data.status,
        };
        router.get('/admin/companies', searchData, { preserveState: true });
    };

    const handleBulkDelete = () => {
        if (selectedCompanies.length === 0) return;
        if (confirm(`Hapus ${selectedCompanies.length} perusahaan?`)) {
            router.post('/admin/companies/bulk-destroy', {
                ids: selectedCompanies,
            }, {
                onSuccess: () => setSelectedCompanies([]),
            });
        }
    };

    const handleBulkUpdateStatus = (status: boolean) => {
        if (selectedCompanies.length === 0) return;
        if (confirm(`Update status ${selectedCompanies.length} perusahaan?`)) {
            router.post('/admin/companies/bulk-update-status', {
                ids: selectedCompanies,
                status: status,
            }, {
                onSuccess: () => setSelectedCompanies([]),
            });
        }
    };

    const toggleSelectAll = () => {
        if (selectedCompanies.length === companies.data.length) {
            setSelectedCompanies([]);
        } else {
            setSelectedCompanies(companies.data.map((c) => c.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedCompanies((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const statCards = [
        {
            title: 'Total Perusahaan',
            value: statistics.total,
            icon: Building2,
            color: 'text-blue-600',
            bg: 'bg-blue-100',
        },
        {
            title: 'Aktif',
            value: statistics.active,
            icon: CheckCircle,
            color: 'text-green-600',
            bg: 'bg-green-100',
        },
        {
            title: 'Tidak Aktif',
            value: statistics.inactive,
            icon: XCircle,
            color: 'text-red-600',
            bg: 'bg-red-100',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manajemen Perusahaan" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Perusahaan</h1>
                        <p className="text-gray-600 mt-1">Kelola semua data perusahaan klien</p>
                    </div>
                    <Link href="/admin/companies/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Perusahaan
                        </Button>
                    </Link>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                <h3 className="text-lg font-semibold">Filter Perusahaan</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari nama, email, telepon..."
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

                                <Button type="submit" className="w-full">
                                    Terapkan Filter
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedCompanies.length > 0 && (
                    <Card className="border-0 shadow-md bg-blue-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedCompanies.length} perusahaan dipilih
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
                                                checked={selectedCompanies.length === companies.data.length && companies.data.length > 0}
                                                onCheckedChange={toggleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="text-black">Perusahaan</TableHead>
                                        <TableHead className="text-black">Kontak</TableHead>
                                        <TableHead className="text-black">Website</TableHead>
                                        <TableHead className="text-black">Status</TableHead>
                                        <TableHead className="text-black text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {companies.data.length > 0 ? (
                                        companies.data.map((company) => (
                                            <TableRow key={company.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedCompanies.includes(company.id)}
                                                        onCheckedChange={() => toggleSelect(company.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        {company.logo ? (
                                                            <img 
                                                                src={company.logo}
                                                                alt={company.name}
                                                                className="w-10 h-10 object-contain rounded"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                                                <Building2 className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium">{company.name}</p>
                                                            <p className="text-xs text-gray-500">{company.slug}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        {company.email && (
                                                            <p className="text-gray-900">{company.email}</p>
                                                        )}
                                                        {company.phone && (
                                                            <p className="text-gray-500">{company.phone}</p>
                                                        )}
                                                        {!company.email && !company.phone && (
                                                            <p className="text-gray-400">-</p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {company.website ? (
                                                        <a 
                                                            href={company.website}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:underline text-sm"
                                                        >
                                                            {company.website}
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={company.is_active ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}>
                                                        {company.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button className='bg-blue-200 hover:bg-blue-500' variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className='bg-white text-gray-600'>
                                                            <DropdownMenuItem asChild className='hover:bg-yellow-300'>
                                                                <Link href={`/admin/companies/${company.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Lihat Detail
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/companies/${company.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    router.patch(`/admin/companies/${company.id}/toggle-status`);
                                                                }}
                                                            >
                                                                {company.is_active ? (
                                                                    <>
                                                                        <XCircle className="mr-2 h-4 w-4" />
                                                                        Nonaktifkan
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                                        Aktifkan
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600"
                                                                onClick={() => {
                                                                    if (confirm('Hapus perusahaan ini?')) {
                                                                        router.delete(`/admin/companies/${company.id}`);
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
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                Tidak ada perusahaan ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {companies.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Menampilkan {companies.data.length} dari {companies.total} perusahaan
                        </p>
                        <div className="flex gap-2">
                            {companies.links.map((link, index) => (
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