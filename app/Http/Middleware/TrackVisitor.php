<?php

namespace App\Http\Middleware;

use App\Models\VisitorLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;
use Jenssegers\Agent\Agent;

class TrackVisitor
{
    public function handle(Request $request, Closure $next): Response
    {
        // Track visitor setelah response dikirim untuk tidak memperlambat
        app()->terminating(function () use ($request) {
            $this->logVisitor($request);
        });

        return $next($request);
    }

    private function logVisitor(Request $request): void
    {
        // Hanya track GET requests dan exclude admin routes & assets
        if (
            !$request->isMethod('GET') || 
            $request->is('admin/*') || 
            $request->is('api/*') ||
            $this->isAsset($request->path())
        ) {
            return;
        }

        try {
            $agent = new Agent();
            $agent->setUserAgent($request->userAgent());

            $ipAddress = $this->getRealIpAddress($request);
            $geoData = $this->getGeolocation($ipAddress);

            VisitorLog::create([
                'ip_address' => $ipAddress,
                'user_agent' => $request->userAgent(),
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'country' => $geoData['country'] ?? null,
                'city' => $geoData['city'] ?? null,
                'region' => $geoData['region'] ?? null,
                'latitude' => $geoData['latitude'] ?? null,
                'longitude' => $geoData['longitude'] ?? null,
                'device' => $this->getDeviceType($agent),
                'browser' => $agent->browser(),
                'platform' => $agent->platform(),
                'referrer' => $request->header('referer'),
            ]);
        } catch (\Exception $e) {
            Log::error('Visitor tracking error: ' . $e->getMessage());
        }
    }

    private function getRealIpAddress(Request $request): string
    {
        // Cek berbagai header untuk mendapatkan IP asli
        if ($request->header('HTTP_CF_CONNECTING_IP')) {
            return $request->header('HTTP_CF_CONNECTING_IP');
        }
        
        if ($request->header('HTTP_X_FORWARDED_FOR')) {
            $ips = explode(',', $request->header('HTTP_X_FORWARDED_FOR'));
            return trim($ips[0]);
        }
        
        return $request->ip();
    }

    private function getDeviceType(Agent $agent): string
    {
        if ($agent->isMobile()) {
            return 'mobile';
        }
        if ($agent->isTablet()) {
            return 'tablet';
        }
        return 'desktop';
    }

    private function isAsset(string $path): bool
    {
        $extensions = ['js', 'css', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'eot'];
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        return in_array(strtolower($extension), $extensions);
    }

    private function getGeolocation(string $ip): array
    {
        // Untuk localhost/private IP, return default Jakarta
        if ($this->isPrivateIp($ip)) {
            return [
                'country' => 'Indonesia',
                'city' => 'Jakarta',
                'region' => 'DKI Jakarta',
                'latitude' => -6.2088,
                'longitude' => 106.8456,
            ];
        }

        try {
            // Cache geolocation untuk IP yang sama (1 hari)
            return Cache::remember("geo_{$ip}", 86400, function () use ($ip) {
                return $this->fetchGeolocation($ip);
            });
        } catch (\Exception $e) {
            Log::error('Geolocation error: ' . $e->getMessage());
            return [];
        }
    }

    private function fetchGeolocation(string $ip): array
    {
        try {
            // Menggunakan ip-api.com (gratis, 45 req/minute)
            $url = "http://ip-api.com/json/{$ip}?fields=status,country,city,regionName,lat,lon";
            $response = @file_get_contents($url);
            
            if (!$response) {
                return [];
            }

            $data = json_decode($response, true);

            if ($data && isset($data['status']) && $data['status'] === 'success') {
                return [
                    'country' => $data['country'] ?? null,
                    'city' => $data['city'] ?? null,
                    'region' => $data['regionName'] ?? null,
                    'latitude' => $data['lat'] ?? null,
                    'longitude' => $data['lon'] ?? null,
                ];
            }
        } catch (\Exception $e) {
            Log::error('Fetch geolocation error: ' . $e->getMessage());
        }

        return [];
    }

    private function isPrivateIp(string $ip): bool
    {
        // Check for localhost
        if ($ip === '127.0.0.1' || $ip === '::1') {
            return true;
        }

        // Check for private IP ranges
        $private = [
            '10.0.0.0|10.255.255.255',
            '172.16.0.0|172.31.255.255',
            '192.168.0.0|192.168.255.255',
        ];

        $long = ip2long($ip);
        if ($long === false) {
            return true;
        }

        foreach ($private as $range) {
            list($start, $end) = explode('|', $range);
            if ($long >= ip2long($start) && $long <= ip2long($end)) {
                return true;
            }
        }

        return false;
    }
}
