<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pesanan extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'service_id',
        'name',
        'email',
        'telp',
        'description',
        'due_date',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Status constants
     */
    const STATUS_PENDING = 'pending';
    const STATUS_VERIFIKASI = 'verifikasi';
    const STATUS_PROSES = 'proses';
    const STATUS_APPROVAL = 'approval';
    const STATUS_RUNNING = 'running';
    const STATUS_SELESAI = 'selesai';

    /**
     * Get all available statuses
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING => 'Menunggu',
            self::STATUS_VERIFIKASI => 'Verifikasi',
            self::STATUS_PROSES => 'Diproses',
            self::STATUS_APPROVAL => 'Persetujuan',
            self::STATUS_RUNNING => 'Sedang Berjalan',
            self::STATUS_SELESAI => 'Selesai',
        ];
    }

    /**
     * Get status label
     */
    public function getStatusLabelAttribute(): string
    {
        return self::getStatuses()[$this->status] ?? $this->status;
    }

    /**
     * Get status color
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            self::STATUS_PENDING => 'yellow',
            self::STATUS_VERIFIKASI => 'blue',
            self::STATUS_PROSES => 'indigo',
            self::STATUS_APPROVAL => 'purple',
            self::STATUS_RUNNING => 'orange',
            self::STATUS_SELESAI => 'green',
            default => 'gray',
        };
    }

    /**
     * Relationship to Service
     */
    public function service(): BelongsTo
    {
        return $this->belongsTo(Services::class, 'service_id');
    }

    /**
     * Scope for filtering by status
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for active orders (not completed)
     */
    public function scopeActive($query)
    {
        return $query->whereNotIn('status', [self::STATUS_SELESAI]);
    }

    /**
     * Scope for completed orders
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_SELESAI);
    }

    /**
     * Scope for searching
     */
    public function scopeSearch($query, string $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('telp', 'like', "%{$search}%");
        });
    }
}
