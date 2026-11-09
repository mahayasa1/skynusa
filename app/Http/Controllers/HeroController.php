<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HeroController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/hero', [
            'hero' => SiteSetting::hero(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'mode'          => 'required|in:video,foto,keduanya',
            'video'         => 'nullable|file|mimes:mp4,webm|max:51200', // 50 MB
            'poster'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // 2 MB
            'remove_video'  => 'boolean',
            'remove_poster' => 'boolean',
        ]);

        SiteSetting::setValue('hero_mode', $request->input('mode'));

        $this->replace($request, 'hero_video', 'video', 'hero', 'remove_video');
        $this->replace($request, 'hero_poster', 'poster', 'hero', 'remove_poster');

        return back()->with('success', 'Hero beranda berhasil diperbarui.');
    }

    private function replace(Request $request, string $key, string $input, string $dir, string $removeFlag): void
    {
        $old = SiteSetting::getValue($key);

        if ($request->hasFile($input)) {
            if ($old) {
                Storage::disk('public')->delete($old);
            }
            SiteSetting::setValue($key, $request->file($input)->store($dir, 'public'));
        } elseif ($request->boolean($removeFlag) && $old) {
            Storage::disk('public')->delete($old);
            SiteSetting::setValue($key, null);
        }
    }
}
