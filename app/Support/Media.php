<?php

namespace App\Support;

/**
 * Mengubah path gambar di database menjadi URL yang bisa dipakai browser.
 *
 *  - "asset/cctv.jpeg"        -> "/asset/cctv.jpeg"      (file bawaan di public/asset)
 *  - "portfolios/abc.jpg"     -> "/storage/portfolios/abc.jpg" (unggahan dari admin)
 *  - "https://..." / "/..."   -> dipakai apa adanya
 */
class Media
{
    public static function url(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (preg_match('#^(https?:)?//#i', $path) || str_starts_with($path, 'data:')) {
            return $path;
        }

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'asset/') || str_starts_with($path, 'storage/')) {
            return '/' . $path;
        }

        return '/storage/' . $path;
    }
}
