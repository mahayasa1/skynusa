# Patch SKYNUSA: Captcha di form + transisi halus

Captcha yang dipakai: **Cloudflare Turnstile** (gratis, tanpa centang gambar, tampil profesional).
Dipasang di: **form pesanan**, **form kontak**, dan **login**.

## A. File BARU (salin sesuai path)

| File | Fungsi |
|---|---|
| `app/Rules/Turnstile.php` | Validasi token captcha ke Cloudflare |
| `resources/js/components/turnstile.tsx` | Widget captcha untuk React |
| `resources/js/components/reveal.tsx` | Animasi muncul halus saat scroll (opsional dipakai) |
| `database/migrations/2026_11_08_120000_drop_unique_email_from_pesans_table.php` | Menghapus `unique` di email tabel `pesans` |

> Migration ini penting: tabel `pesans` punya `email` yang `unique`, jadi satu orang hanya bisa kirim pesan kontak satu kali (kedua kalinya error 500).

## B. File yang DIUBAH

### 1. `.env` dan `.env.example`
```
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```
Itu key **testing** Cloudflare (selalu lolos). Untuk production, buat widget di dash.cloudflare.com > Turnstile, lalu ganti dengan site key dan secret key asli.

### 2. `config/services.php` (tambah di dalam array `return`)
```php
'turnstile' => [
    'secret' => env('TURNSTILE_SECRET_KEY'),
],
```

### 3. `routes/web.php`
Ganti blok `/kontak` POST (sekarang salah mengarah ke `PesananController`):
```php
Route::post('/kontak', [PesanController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');
```
Dan di grup pesanan, tambah throttle di route order:
```php
Route::post('/pesanan/order', 'store')->middleware('throttle:5,1')->name('order.store');
```

### 4. `app/Http/Controllers/PesananController.php` (method `store`)
Tambah di atas: `use App\Rules\Turnstile;`

Di dalam `$request->validate([...])` tambahkan:
```php
'captcha' => ['required', new Turnstile],
```
dan di array pesan:
```php
'captcha.required' => 'Selesaikan verifikasi keamanan terlebih dahulu',
```
Tepat setelah validate, sebelum `createOrder`:
```php
unset($validated['captcha']);
```

### 5. `app/Http/Controllers/PesanController.php` (isi method `store` yang masih kosong)
Tambah di atas: `use App\Rules\Turnstile;`
```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name'    => 'required|string|max:255',
        'email'   => 'required|email|max:255',
        'phone'   => 'required|string|max:20',
        'subject' => 'nullable|string|max:255',
        'message' => 'required|string|max:5000',
        'captcha' => ['required', new Turnstile],
    ], [
        'captcha.required' => 'Selesaikan verifikasi keamanan terlebih dahulu',
    ]);

    Pesan::create([
        'name'  => $validated['name'],
        'email' => $validated['email'],
        'telp'  => $validated['phone'],
        'judul' => $validated['subject'] ?? 'Pesan dari website',
        'isi'   => $validated['message'],
    ]);

    return back()->with('success', 'Pesan berhasil dikirim.');
}
```

### 6. `app/Http/Requests/Auth/LoginRequest.php`
Tambah di atas: `use App\Rules\Turnstile;`, lalu di `rules()`:
```php
'captcha' => ['required', new Turnstile],
```

### 7. `resources/js/pages/pesanan/order.tsx`
```tsx
// import
import Turnstile from '@/components/turnstile';

// useForm: tambah satu field
captcha: '',

// di bawah useForm
const [captchaReset, setCaptchaReset] = React.useState(0);
const resetCaptcha = () => { setData('captcha', ''); setCaptchaReset((n) => n + 1); };

// di post('/pesanan/order', {...}): panggil resetCaptcha() di onSuccess (setelah reset())
// dan di onError (setelah Swal.close()), karena token hanya berlaku sekali

// di JSX, tepat sebelum blok tombol "Submit Button"
<div className="space-y-2">
    <Turnstile onVerify={(t) => setData('captcha', t)} resetKey={captchaReset} />
    {errors.captcha && <p className="text-sm text-red-600">{errors.captcha}</p>}
</div>

// tombol submit
disabled={processing || !data.captcha}
```

### 8. `resources/js/pages/contact.tsx`
Form ini sekarang hanya `console.log`, jadi perlu disambungkan ke server.
```tsx
// import (ganti baris import Head)
import { Head, useForm } from '@inertiajs/react';
import Turnstile from '@/components/turnstile';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// ganti useState formData + handleSubmit + handleChange dengan:
const { data: formData, setData, post, processing, errors, reset } = useForm({
    name: '', email: '', phone: '', subject: '', message: '', captcha: '',
});
const [captchaReset, setCaptchaReset] = useState(0);

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/kontak', {
        preserveScroll: true,
        onSuccess: () => {
            reset();
            Swal.fire({
                icon: 'success',
                title: 'Pesan terkirim',
                text: 'Tim kami akan menghubungi Anda dalam 24 jam.',
                confirmButtonText: 'Tutup',
            });
        },
        onFinish: () => { setData('captcha', ''); setCaptchaReset((n) => n + 1); },
    });
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setData(e.target.name as keyof typeof formData, e.target.value);

// JSX: tepat sebelum <Button type="submit" ...>
<div className="space-y-2">
    <Turnstile onVerify={(t) => setData('captcha', t)} resetKey={captchaReset} />
    {errors.captcha && <p className="text-sm text-red-600">{errors.captcha}</p>}
</div>

// tombol submit
<Button type="submit" size="lg" className="w-full md:w-auto" disabled={processing || !formData.captcha}>
    {processing ? 'Mengirim...' : 'Kirim Pesan'}
</Button>
```

### 9. `resources/js/pages/auth/login.tsx`
```tsx
// import
import Turnstile from '@/components/turnstile';

// useForm: tambah
captcha: '',

// di bawah useForm
const [captchaReset, setCaptchaReset] = useState(0);

// handleSubmit: ganti onFinish
onFinish: () => {
    setData((d) => ({ ...d, password: '', captcha: '' }));
    setCaptchaReset((n) => n + 1);
},

// JSX: tepat sebelum <Button type="submit" ...>
<div>
    <Turnstile onVerify={(t) => setData('captcha', t)} resetKey={captchaReset} />
    <InputError message={errors.captcha} />
</div>

// tombol: disabled={processing || !data.captcha}
```

## C. Transisi halus

### 10. `resources/css/app.css` (tambah di paling bawah)
```css
/* Halaman masuk dengan fade + naik tipis */
@keyframes page-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: none; }
}

@layer components {
    .page-enter { animation: page-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }

    .card-hover {
        transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .card-hover:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 28px -12px rgb(15 42 51 / 0.25);
    }
}

@layer base {
    a, button, [role='button'], input, textarea, select {
        transition-property: color, background-color, border-color, box-shadow, transform, opacity;
        transition-duration: 200ms;
        transition-timing-function: ease;
    }
}
```
Pengaturan `prefers-reduced-motion` yang sudah ada di file Anda otomatis mematikan animasi ini bagi pengguna yang memintanya.

### 11. `resources/js/layouts/public-layout.tsx`
```tsx
<main className="flex-grow page-enter">
```

### 12. Opsional: pemakaian
- Kartu yang ingin terangkat saat hover: tambah class `card-hover` (mis. kartu layanan, portfolio, berita).
- Section yang ingin muncul saat scroll:
```tsx
import Reveal from '@/components/reveal';

<Reveal><h2>Layanan Kami</h2></Reveal>
<Reveal delay={100}><ServiceCard /></Reveal>
```

## D. Setelah semua diubah
```bash
php artisan migrate
php artisan config:clear
# hentikan lalu jalankan ulang (VITE_* hanya terbaca saat start):
npm run dev
```

Catatan: form **tracking** (`/pesanan/tracking`) belum diberi captcha karena hanya pencarian. Kalau ingin, polanya sama dengan form pesanan.
