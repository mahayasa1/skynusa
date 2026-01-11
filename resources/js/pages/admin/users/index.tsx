// resources/js/pages/admin/users/index.tsx
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
import { Plus, Search, MoreVertical, Edit, Trash, Eye } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    role: string;
    foto: string;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
        links: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        role?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    head: 'bg-purple-100 text-purple-800',
    staff: 'bg-green-100 text-green-800',
};

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const { data, setData, get } = useForm({
        search: filters.search || '',
        role: filters.role || 'all',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/users', { preserveState: true });
    };

    const handleBulkDelete = () => {
        if (selectedUsers.length === 0) return;
        if (confirm(`Delete ${selectedUsers.length} users?`)) {
            router.post('/admin/users/bulk-destroy', {
                ids: selectedUsers,
            }, {
                onSuccess: () => setSelectedUsers([]),
            });
        }
    };

    const toggleSelectAll = () => {
        if (selectedUsers.length === users.data.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(users.data.map((u) => u.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />

            <div className="space-y-6 p-6 bg-white text-black">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Users Management</h1>
                        <p className="text-gray-600">Manage system users</p>
                    </div>
                    <Link href="/admin/users/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search users..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={data.role} onValueChange={(value) => setData('role', value)} >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="head">Head</SelectItem>
                                <SelectItem value="staff">Staff</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit">Search</Button>
                    </form>
                </div>

                {/* Bulk Actions */}
                {selectedUsers.length > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3">
                        <span className="text-sm font-medium">
                            {selectedUsers.length} selected
                        </span>
                        <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Selected
                        </Button>
                    </div>
                )}

                {/* Table */}
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader className='bg-blue-300 '>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedUsers.length === users.data.length}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className='text-black'>Name</TableHead>
                                <TableHead className='text-black'>Username</TableHead>
                                <TableHead className='text-black'>Email</TableHead>
                                <TableHead className='text-black'>Role</TableHead>
                                <TableHead className='text-black'>Created</TableHead>
                                <TableHead className="text-black text-right">Actions</TableHead>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow className='hover:bg-blue-100' key={user.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedUsers.includes(user.id)}
                                            onCheckedChange={() => toggleSelect(user.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge className={roleColors[user.role]}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className='hover:bg-blue-400'>
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className='bg-white text-black' align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/users/${user.id}`}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/users/${user.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        if (confirm('Delete this user?')) {
                                                            router.delete(`/admin/users/${user.id}`);
                                                        }
                                                    }}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {users.data.length} of {users.total} users
                        </p>
                        <div className="flex gap-2">
                            {users.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => router.get(link.url)}
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