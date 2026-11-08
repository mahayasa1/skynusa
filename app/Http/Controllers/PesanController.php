<?php

namespace App\Http\Controllers;

use App\Models\Pesan;
use App\Rules\Turnstile;
use Illuminate\Http\Request;

class PesanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
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

    /**
     * Display the specified resource.
     */
    public function show(Pesan $pesan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pesan $pesan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pesan $pesan)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pesan $pesan)
    {
        //
    }
}
