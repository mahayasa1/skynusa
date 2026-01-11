// resources/js/pages/admin/services/index.tsx
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
    Package,
    CheckCircle,
    XCircle,
    Star,
    Copy,
} from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    icon: string;
    image: string;
    features: string[];
    order: number;
    is_active: boolean;
    created_at: string;
}

interface Statistics {
    total: number;
    active: number;
    inactive: number;
    featured: number;
}

interface ServicesIndexProps {
    services: {
        data: Service[];
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
    { title: 'Layanan', href: '/admin/layanan' },
];

export default function ServicesIndex({
    services = {
        data: [],
        links: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    },
    filters = {},
    statistics = {
        total: 0,
        active: 0,
        inactive: 0,
        featured: 0,
    },
}: ServicesIndexProps) {
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
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
        router.get('/admin/layanan', searchData, { preserveState: true });
    };

    const handleBulkDelete = () => {
        if (selectedServices.length === 0) return;
        if (confirm(`Hapus ${selectedServices.length} layanan?`)) {
            router.post(
                '/admin/layanan/bulk-destroy',
                { ids: selectedServices },
                { onSuccess: () => setSelectedServices([]) }
            );
        }
    };

    const handleBulkUpdateStatus = (status: boolean) => {
        if (selectedServices.length === 0) return;
        if (confirm(`Update status ${selectedServices.length} layanan?`)) {
            router.post(
                '/admin/layanan/bulk-update-status',
                {
                    ids: selectedServices,
                    status: status,
                },
                { onSuccess: () => setSelectedServices([]) }
            );
        }
    };

    const toggleSelectAll = () => {
        if (selectedServices.length === services.data.length) {
            setSelectedServices([]);
        } else {
            setSelectedServices(services.data.map((s) => s.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedServices((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const statCards = [
        {
            title: 'Total Layanan',
            value: statistics.total,
            icon: Package,
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
            <Head title="Manajemen Layanan" />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Manajemen Layanan
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola semua layanan perusahaan
                        </p>
                    </div>
                    <Link href="/admin/layanan/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Layanan
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statCards.map((card, i) => (
                        <Card key={i} className="bg-white border-0 shadow-md">
                            <CardContent className="p-5">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {card.value}
                                        </p>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {card.title}
                                        </p>
                                    </div>
                                    <div className={`${card.bg} p-3 rounded-xl`}>
                                        <card.icon
                                            className={`w-6 h-6 ${card.color}`}
                                        />
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
                                <h3 className="text-lg font-semibold">
                                    Filter Layanan
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Cari judul, deskripsi..."
                                        value={data.search}
                                        onChange={(e) =>
                                            setData('search', e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>

                                <Select
                                    value={data.status}
                                    onValueChange={(value) =>
                                        setData('status', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="active">
                                            Aktif
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Tidak Aktif
                                        </SelectItem>
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
                {selectedServices.length > 0 && (
                    <Card className="border-0 shadow-md bg-blue-100">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">
                                    {selectedServices.length} layanan dipilih
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleBulkUpdateStatus(true)
                                        }
                                    >
                                        Aktifkan
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleBulkUpdateStatus(false)
                                        }
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
                                                checked={
                                                    selectedServices.length ===
                                                        services.data.length &&
                                                    services.data.length > 0
                                                }
                                                onCheckedChange={
                                                    toggleSelectAll
                                                }
                                            />
                                        </TableHead>
                                        <TableHead className="text-black">
                                            Layanan
                                        </TableHead>
                                        <TableHead className="text-black">
                                            Deskripsi
                                        </TableHead>
                                        <TableHead className="text-black">
                                            Status
                                        </TableHead>
                                        <TableHead className="text-black text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {services.data.length > 0 ? (
                                        services.data.map((service) => {
                                            // INI KUNCI UTAMANYA
                                            console.log(service);
                                            console.log(service.is_active, typeof service.is_active);
                                            const isActive = Boolean(Number(service.is_active));
                                            return (
                                                <TableRow
                                                    key={service.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedServices.includes(
                                                                service.id
                                                            )}
                                                            onCheckedChange={() =>
                                                                toggleSelect(
                                                                    service.id
                                                                )
                                                            }
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium">
                                                                {service.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {service.slug}
                                                            </p>
                                                        </div>
                                                    </TableCell>

                                                    <TableCell>
                                                        <p className="text-sm text-gray-600 line-clamp-2">
                                                            {service.short_description ||
                                                                service.description.substring(
                                                                    0,
                                                                    100
                                                                ) + '...'}
                                                        </p>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Badge
                                                            className={
                                                                isActive
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-red-500 text-white'
                                                            }
                                                        >
                                                            {isActive
                                                                ? 'Aktif'
                                                                : 'Nonaktif'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    className="bg-blue-200 hover:bg-blue-500"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="bg-white text-gray-600"
                                                            >
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/admin/layanan/${service.id}`}
                                                                    >
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Lihat
                                                                        Detail
                                                                    </Link>
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={`/admin/layanan/${service.id}/edit`}
                                                                    >
                                                                        <Edit className="mr-2 h-4 w-4" />
                                                                        Edit
                                                                    </Link>
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        router.patch(
                                                                            `/admin/layanan/${service.id}/toggle-status`
                                                                        )
                                                                    }
                                                                >
                                                                    {isActive ? (
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
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                'Duplikat layanan ini?'
                                                                            )
                                                                        ) {
                                                                            router.post(
                                                                                `/admin/layanan/${service.id}/duplicate`
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <Copy className="mr-2 h-4 w-4" />
                                                                    Duplikat
                                                                </DropdownMenuItem>

                                                                <DropdownMenuItem
                                                                    className="text-red-600"
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                'Hapus layanan ini?'
                                                                            )
                                                                        ) {
                                                                            router.delete(
                                                                                `/admin/layanan/${service.id}`
                                                                            );
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
                                            );
                                        })
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Tidak ada layanan ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
