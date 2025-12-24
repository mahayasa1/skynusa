<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'title',
        'slug',
        'description',
        'short_description',
        'image',
        'gallery',
        'client_name',
        'location',
        'project_date',
        'duration',
        'technologies',
        'features',
        'project_url',
        'is_active',
        'is_featured',
        'order',
        'meta_title',
        'meta_description',
        'meta_keywords',
    ];

    protected $casts = [
        'gallery' => 'array',
        'technologies' => 'array',
        'features' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'project_date' => 'date',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Services::class, 'service_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order')
                     ->orderBy('created_at', 'desc');
    }

    public function scopeByService($query, $serviceId)
    {
        return $query->where('service_id', $serviceId);
    }

    public function company()
    {
        return $this->belongsTo(Company::class, 'companies_id');
    }

    public function category()
    {
        return $this->belongsTo(Categories::class, 'categories_id');
    }

}
