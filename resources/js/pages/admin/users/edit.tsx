// resources/js/pages/admin/users/edit.tsx
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

interface UserEditProps {
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
        telp: string;
        role: string;
        foto: string;
    };
}

export default function UserEdit({ user }: UserEditProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: user.name, href: `/admin/users/${user.id}` },
        { title: 'Edit', href: `/admin/users/${user.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        password: '',
        telp: user.telp,
        role: user.role,
        foto: null as File | null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(
        user.foto ? `/storage/${user.foto}` : null
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User - ${user.name}`} />

            <div className="space-y-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/admin/users/${user.id}`}>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
                            <p className="text-gray-600 mt-1">{user.username}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">
                                                Full Name <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="John Doe"
                                                className={errors.name ? 'border-red-500' : ''}
                                            />
                                            {errors.name && (
                                                <p className="text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="username">
                                                Username <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="username"
                                                value={data.username}
                                                onChange={(e) => setData('username', e.target.value)}
                                                placeholder="johndoe"
                                                className={errors.username ? 'border-red-500' : ''}
                                            />
                                            {errors.username && (
                                                <p className="text-sm text-red-500">{errors.username}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">
                                                Email <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="john@example.com"
                                                className={errors.email ? 'border-red-500' : ''}
                                            />
                                            {errors.email && (
                                                <p className="text-sm text-red-500">{errors.email}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="telp">
                                                Phone Number <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="telp"
                                                value={data.telp}
                                                onChange={(e) => setData('telp', e.target.value)}
                                                placeholder="08xxxxxxxxxx"
                                                className={errors.telp ? 'border-red-500' : ''}
                                            />
                                            {errors.telp && (
                                                <p className="text-sm text-red-500">{errors.telp}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Security */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Security & Access</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">
                                                New Password
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="••••••••"
                                                className={errors.password ? 'border-red-500' : ''}
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-500">{errors.password}</p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                Leave blank to keep current password
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="role">
                                                Role <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.role}
                                                onValueChange={(value) => setData('role', value)}
                                            >
                                                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="admin">Administrator</SelectItem>
                                                    <SelectItem value="manager">Manager</SelectItem>
                                                    <SelectItem value="head">Head</SelectItem>
                                                    <SelectItem value="staff">Staff</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.role && (
                                                <p className="text-sm text-red-500">{errors.role}</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Profile Photo */}
                            <Card className="shadow-md bg-white text-black">
                                <CardHeader>
                                    <CardTitle>Profile Photo</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {previewImage ? (
                                            <div className="relative">
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => {
                                                        setPreviewImage(null);
                                                        setData('foto', null);
                                                    }}
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-2 text-sm text-gray-600">
                                                    Upload new photo
                                                </p>
                                            </div>
                                        )}
                                        
                                        <Input
                                            id="foto"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className={`{errors.foto ? 'border-red-500' : ''} file:text-gray-400 `}
                                        />
                                        {errors.foto && (
                                            <p className="text-sm text-red-500">{errors.foto}</p>
                                        )}
                                        <p className="text-xs text-gray-500">
                                            JPG, PNG or WEBP. Max 20MB.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* User Info */}
                            <Card className="shadow-md bg-gray-50">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold text-sm text-gray-900 mb-2">
                                        User Information
                                    </h4>
                                    <div className="space-y-2 text-xs text-gray-600">
                                        <div>
                                            <span className="font-medium">User ID:</span> #{user.id}
                                        </div>
                                        <div>
                                            <span className="font-medium">Current Role:</span> {user.role}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Action Buttons */}
                            <Card className="shadow-md bg-white text-black">
                                <CardContent className="p-4 space-y-2">
                                    <Button
                                        type="submit"
                                        className="bg-gray-200 w-full"
                                        disabled={processing}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                    <Link href={`/admin/users/${user.id}`}>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="bg-white text-black hover:bg-red-600 w-full"
                                        >
                                            Cancel
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Helper Info */}
                            <Card className="shadow-md bg-blue-50">
                                <CardContent className="p-4">
                                    <h4 className="font-semibold text-sm text-blue-900 mb-2">
                                        Role Permissions
                                    </h4>
                                    <ul className="text-xs text-blue-800 space-y-1">
                                        <li>• <strong>Admin:</strong> Full access</li>
                                        <li>• <strong>Manager:</strong> Orders & Portfolio</li>
                                        <li>• <strong>Head:</strong> Services & Companies</li>
                                        <li>• <strong>Staff:</strong> View only</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}