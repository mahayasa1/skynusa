<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Visitor Tracking Settings
    |--------------------------------------------------------------------------
    */
    'tracking' => [
        'enabled' => env('VISITOR_TRACKING_ENABLED', true),
        'exclude_admin' => true,
        'exclude_api' => true,
        'log_retention_days' => env('VISITOR_LOG_RETENTION_DAYS', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Settings
    |--------------------------------------------------------------------------
    */
    'cache' => [
        'chart_data_ttl' => 300, // 5 minutes
        'visitor_locations_ttl' => 300, // 5 minutes
        'geolocation_ttl' => 86400, // 1 day
    ],

    /*
    |--------------------------------------------------------------------------
    | Auto Refresh Settings
    |--------------------------------------------------------------------------
    */
    'refresh' => [
        'interval' => env('DASHBOARD_REFRESH_INTERVAL', 30), // seconds
        'enabled' => env('DASHBOARD_AUTO_REFRESH', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | Geolocation Settings
    |--------------------------------------------------------------------------
    */
    'geolocation' => [
        'provider' => env('GEOLOCATION_PROVIDER', 'ip-api'), // ip-api, ipinfo, geoip2
        'api_key' => env('GEOLOCATION_API_KEY', null),
    ],
];