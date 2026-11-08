// resources/js/pages/admin/hero.tsx
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Video } from 'lucide-react';
import { useState } from 'react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard' },
    { title: 'Hero Beranda', href: '/admin/hero' },
];

interface Props {
    hero: { mode: 'video' | 'foto' | 'keduanya'; video_url: string | null; poster_url: string | null };
}

export default function HeroAdmin({ hero }: Props) {
    const [saved, setSaved] = useState(false);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        mode: hero.mode,
        video: null as File | null,
        poster: null as File | null,
        remove_video: false,
        remove_poster: false,
    });

    const pick = (field: 'video' | 'poster', set: (v: string | null) => void) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] ?? null;
            setData(field, file);
            set(file ? URL.createObjectURL(file) : null);
        };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(false);
        post('/admin/hero', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset('video', 'poster', 'remove_video', 'remove_poster');
                setVideoPreview(null);
                setPosterPreview(null);
                setSaved(true);
            },
        });
    };

    const currentVideo = videoPreview ?? (data.remove_video ? null : hero.video_url);
    const currentPoster = posterPreview ?? (data.remove_poster ? null : hero.poster_url);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Hero Beranda" />

            <div className="max-w-3xl space-y-6 p-6">
                <div className="flex items-center gap-3">
                    <Video className="h-6 w-6 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold">Hero Beranda</h1>
                        <p className="text-sm text-muted-foreground">Video latar di bagian paling atas halaman depan.</p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tampilan hero</CardTitle>
                            <CardDescription>Pilih apa yang tampil di bagian atas halaman depan.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-3">
                            {([
                                ['video', 'Video saja', 'Video diputar sebagai latar.'],
                                ['foto', 'Foto saja', 'Gambar diam, paling ringan.'],
                                ['keduanya', 'Video + foto', 'Foto sebagai dasar, video diputar menyatu di atasnya.'],
                            ] as const).map(([value, title, desc]) => (
                                <label key={value}
                                    className={`cursor-pointer rounded-lg border p-4 text-sm transition-colors ${data.mode === value ? 'border-blue-600 bg-blue-50' : 'hover:bg-muted'}`}>
                                    <input type="radio" name="mode" value={value} className="sr-only"
                                        checked={data.mode === value} onChange={() => setData('mode', value)} />
                                    <span className="block font-semibold">{title}</span>
                                    <span className="mt-1 block text-muted-foreground">{desc}</span>
                                </label>
                            ))}
                        </CardContent>
                    </Card>

                    {data.mode !== 'foto' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Video</CardTitle>
                            <CardDescription>MP4 atau WebM, maksimal 50 MB. Disarankan 8-15 detik, 1280×720, tanpa suara.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {currentVideo ? (
                                <video key={currentVideo} src={currentVideo} muted loop autoPlay playsInline
                                    className="aspect-video w-full rounded-lg bg-black object-cover" />
                            ) : (
                                <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
                                    Belum ada video. Halaman depan memakai foto.
                                </div>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="video">Ganti video</Label>
                                <Input id="video" type="file" accept="video/mp4,video/webm" onChange={pick('video', setVideoPreview)} />
                                {errors.video && <p className="text-sm text-destructive">{errors.video}</p>}
                            </div>
                            {hero.video_url && (
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={data.remove_video}
                                        onChange={(e) => setData('remove_video', e.target.checked)} />
                                    Hapus video (kembali ke foto)
                                </label>
                            )}
                        </CardContent>
                    </Card>

                    )}

                    {data.mode !== 'video' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Foto</CardTitle>
                            <CardDescription>Foto latar hero, juga tampil untuk pengunjung yang mematikan animasi. JPG/PNG/WebP, maksimal 2 MB.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {currentPoster && (
                                <img src={currentPoster} alt="Poster hero" className="aspect-video w-full rounded-lg object-cover" />
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="poster">Ganti foto</Label>
                                <Input id="poster" type="file" accept="image/jpeg,image/png,image/webp" onChange={pick('poster', setPosterPreview)} />
                                {errors.poster && <p className="text-sm text-destructive">{errors.poster}</p>}
                            </div>
                            {hero.poster_url && (
                                <label className="flex items-center gap-2 text-sm">
                                    <input type="checkbox" checked={data.remove_poster}
                                        onChange={(e) => setData('remove_poster', e.target.checked)} />
                                    Hapus foto (pakai foto bawaan)
                                </label>
                            )}
                        </CardContent>
                    </Card>
                    )}

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan perubahan'}
                        </Button>
                        {saved && <span className="text-sm text-green-600">Tersimpan.</span>}
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
