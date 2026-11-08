<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;

class Turnstile implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $secret = config('services.turnstile.secret');

        if (! $secret) {
            // Tanpa secret key: hanya boleh dilewati di lokal, di production ditolak
            if (! app()->environment('local')) {
                $fail('Verifikasi keamanan belum dikonfigurasi.');
            }
            return;
        }

        try {
            $response = Http::asForm()->timeout(5)->post(
                'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                [
                    'secret'   => $secret,
                    'response' => $value,
                    'remoteip' => request()->ip(),
                ]
            );
        } catch (\Throwable $e) {
            report($e);
            $fail('Verifikasi keamanan gagal diproses. Silakan coba lagi.');
            return;
        }

        if (! $response->json('success')) {
            $fail('Verifikasi keamanan gagal. Silakan coba lagi.');
        }
    }
}
