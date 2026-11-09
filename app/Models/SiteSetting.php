<?php

namespace App\Models;

use App\Support\Media;
use App\Support\SiteDefaults;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    private const CACHE_KEY = 'site_settings.all';

    /** Semua pasangan key => value (di-cache; dihapus otomatis saat ada perubahan). */
    protected static function all_values(): array
    {
        return Cache::remember(self::CACHE_KEY, 3600, fn () => static::query()->pluck('value', 'key')->all());
    }

    public static function getValue(string $key, ?string $default = null): ?string
    {
        return static::all_values()[$key] ?? $default;
    }

    public static function setValue(string $key, ?string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Konten per kelompok (beranda, statistik, peta, kontak, tentang).
     * Tersimpan sebagai JSON di key "content_{group}" dan digabung dengan nilai bawaan,
     * jadi kolom yang belum pernah diisi tetap memakai teks asli situs.
     */
    public static function group(string $group): array
    {
        $defaults = SiteDefaults::for($group);

        try {
            $raw = static::getValue("content_{$group}");
        } catch (\Throwable) {
            return $defaults; // tabel belum ada (sebelum migrate)
        }

        $saved = $raw ? json_decode($raw, true) : null;

        return is_array($saved) ? array_replace($defaults, $saved) : $defaults;
    }

    public static function saveGroup(string $group, array $data): void
    {
        static::setValue("content_{$group}", json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    /** Data yang dibutuhkan di semua halaman publik (footer, kontak, statistik). */
    public static function publicShared(): array
    {
        return [
            'contact' => static::group('kontak'),
            'stats'   => static::group('statistik'),
        ];
    }

    /**
     * Data hero untuk halaman depan & admin.
     * Mengembalikan URL publik (null kalau belum diunggah).
     */
    public static function hero(): array
    {
        $video  = static::getValue('hero_video');
        $poster = static::getValue('hero_poster');

        $mode = static::getValue('hero_mode');
        if (!in_array($mode, ['video', 'foto', 'keduanya'], true)) {
            $mode = $video ? 'video' : 'foto';
        }

        return [
            'mode'       => $mode, // video | foto | keduanya
            'video_url'  => $video ? Storage::disk('public')->url($video) : null,
            'poster_url' => $poster ? Storage::disk('public')->url($poster) : null,
        ];
    }

    public static function mediaUrl(?string $path): ?string
    {
        return Media::url($path);
    }
}
