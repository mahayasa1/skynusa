<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'website',
        'email',
        'phone',
        'address',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function portfolios(): HasMany
    {
        return $this->hasMany(Portfolio::class, 'companies_id');
    }

    /**
     * Scope a query to only include active companies.
     */
    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include inactive companies.
     */
    public function scopeInactive(Builder $query)
    {
        return $query->where('is_active', false);
    }

    /**
     * Scope a query to order companies by name.
     */
    public function scopeOrdered(Builder $query)
    {
        return $query->orderBy('name');
    }
}