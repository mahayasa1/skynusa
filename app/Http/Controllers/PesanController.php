<?php

namespace App\Http\Controllers;

use App\Models\Pesan;
use App\Rules\Turnstile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PesanController extends Controller
{
    /**
     * Form kontak di situs publik.
     */
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

    /* ==========================
        ADMIN (kotak masuk)
    =========================== */

    public function adminIndex(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));

        $pesans = Pesan::query()
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($w) use ($search) {
                    $w->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('judul', 'like', "%{$search}%")
                        ->orWhere('isi', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/pesan', [
            'pesans'  => $pesans,
            'filters' => ['search' => $search],
        ]);
    }

    public function destroy(int $id): RedirectResponse
    {
        Pesan::findOrFail($id)->delete();

        return back()->with('success', 'Pesan dihapus.');
    }
}
