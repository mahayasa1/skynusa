<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function getValue(string $key, ?string $default = null): ?string
    {
        return static::where('key', $key)->value('value') ?? $default;
    }

    public static function setValue(string $key, ?string $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
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
}
