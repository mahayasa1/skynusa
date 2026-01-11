// resources/js/pages/admin/users/show.tsx
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ArrowLeft,
    Edit,
    Trash,
    Mail,
    Phone,
    User,
    Shield,
    Calendar,
} from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import { Input } from '@headlessui/react';

interface UserShowProps {
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
        telp: string;
        role: string;
        foto: string;
        created_at: string;
        updated_at: string;
    };
}

const roleColors: Record<string, string> = {
    admin: 'bg-red-100 text-red-800 border-red-200',
    manager: 'bg-blue-100 text-blue-800 border-blue-200',
    head: 'bg-purple-100 text-purple-800 border-purple-200',
    staff: 'bg-green-100 text-green-800 border-green-200',
};

const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    manager: 'Manager',
    head: 'Head',
    staff: 'Staff',
};

export default function UserShow({ user }: UserShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
    ];

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            router.delete(`/admin/users/${user.id}`, {
                onSuccess: () => {
                    router.visit('/admin/users');
                },
            });
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`User - ${user.name}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/users">
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
                            <p className="text-gray-600 mt-1">{user.username}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link href={`/admin/users/${user.id}/edit`}>
                            <Button variant="outline" className="bg-yellow-500 text-white hover:bg-yellow-600">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>

                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <Card className="shadow-md bg-white lg:col-span-1">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                                <Avatar className="h-fit w-fit mb-4">
                                    <AvatarImage 
                                        src={user.foto ? `/storage/${user.foto}` : undefined} 
                                        alt={user.name} 
                                    />
                                    <AvatarFallback className="text-2xl bg-blue-500 text-white">
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    {user.name}
                                </h2>
                                <p className="text-gray-600 mb-3">@{user.username}</p>

                                <Badge className={`${roleColors[user.role]} text-base px-4 py-1`}>
                                    {roleLabels[user.role]}
                                </Badge>
                            </div>

                            <div className="mt-6 pt-6 border-t space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Mail className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600">Email</p>
                                        <a 
                                            href={`mailto:${user.email}`}
                                            className="text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            {user.email}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Phone className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600">Phone</p>
                                        <a 
                                            href={`tel:${user.telp}`}
                                            className="text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            {user.telp}
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Shield className="h-4 w-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-600">Role</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {roleLabels[user.role]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Information Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Account Information */}
                        <Card className="bg-white text-black shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Account Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className=" space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Full Name
                                        </label>
                                        <p className="text-base font-semibold text-black bg-gray-200 rounded p-1 mt-1">
                                            {user.name}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Username
                                        </label>
                                        <p className="text-base font-semibold text-black bg-gray-200 rounded p-1 mt-1">
                                            {user.username}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Email Address
                                        </label>
                                        <p className="text-base text-black bg-gray-200 rounded p-1 mt-1">
                                            {user.email}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-600">
                                            Phone Number
                                        </label>
                                        <p className="text-base text-black bg-gray-200 rounded p-1 mt-1">
                                            {user.telp}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card className="bg-white text-black shadow-md">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Account Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 pb-4 border-b">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            Account Created
                                        </p>
                                        <p className="text-base font-semibold text-gray-900 mt-1">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {new Date(user.created_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })} WIB
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-600">
                                            Last Updated
                                        </p>
                                        <p className="text-sm text-gray-900 mt-1">
                                            {new Date(user.updated_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="shadow-md bg-white text-black">
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-white"
                                    onClick={() => window.location.href = `mailto:${user.email}`}
                                >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start bg-white"
                                    onClick={() => window.location.href = `tel:${user.telp}`}
                                >
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call User
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}