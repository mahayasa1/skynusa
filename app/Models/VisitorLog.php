<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class VisitorLog extends Model
{
    protected $fillable = [
        'ip_address',
        'user_agent',
        'url',
        'method',
        'country',
        'city',
        'region',
        'latitude',
        'longitude',
        'device',
        'browser',
        'platform',
        'referrer',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    /**
     * Scope untuk hari ini
     */
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', Carbon::today());
    }

    /**
     * Scope untuk bulan ini
     */
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', Carbon::now()->month)
                     ->whereYear('created_at', Carbon::now()->year);
    }

    /**
     * Scope untuk tahun ini
     */
    public function scopeThisYear($query)
    {
        return $query->whereYear('created_at', Carbon::now()->year);
    }

    /**
     * Get visitors by city
     */
    public static function getVisitorsByCity($limit = 10)
    {
        return self::today()
            ->whereNotNull('city')
            ->selectRaw('city, AVG(latitude) as lat, AVG(longitude) as lon, COUNT(*) as count')
            ->groupBy('city')
            ->orderBy('count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get monthly visitors count
     */
    public static function getMonthlyVisitors(Carbon $date)
    {
        return self::whereYear('created_at', $date->year)
            ->whereMonth('created_at', $date->month)
            ->count();
    }

    /**
     * Get device statistics
     */
    public static function getDeviceStats()
    {
        return self::today()
            ->whereNotNull('device')
            ->selectRaw('device, COUNT(*) as count')
            ->groupBy('device')
            ->get();
    }
}