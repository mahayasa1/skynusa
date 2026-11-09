<?php

namespace App\Models;

use App\Support\Media;
use Illuminate\Database\Eloquent\Model;

class TeamMember extends Model
{
    public const LEVELS = ['ceo' => 'CEO / Pimpinan', 'management' => 'Manajemen', 'staff' => 'Staf'];

    protected $fillable = ['name', 'role', 'sub_role', 'photo', 'level', 'order', 'is_active'];

    protected $casts = ['is_active' => 'boolean', 'order' => 'integer'];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute(): string
    {
        return Media::url($this->photo) ?? '/asset/profile.png';
    }

    public function scopeOrdered($q)
    {
        return $q->orderBy('order')->orderBy('id');
    }

    /** Struktur untuk bagan organisasi publik: 1 CEO, daftar manajemen, daftar staf. */
    public static function tree(): array
    {
        try {
            $all = static::query()->where('is_active', true)->ordered()->get();
        } catch (\Throwable) {
            return ['ceo' => null, 'management' => [], 'staff' => []];
        }

        $shape = fn (TeamMember $m) => [
            'id'       => $m->id,
            'name'     => $m->name,
            'role'     => $m->role,
            'sub_role' => $m->sub_role,
            'photo'    => $m->photo_url,
        ];

        return [
            'ceo'        => ($ceo = $all->firstWhere('level', 'ceo')) ? $shape($ceo) : null,
            'management' => $all->where('level', 'management')->values()->map($shape)->all(),
            'staff'      => $all->where('level', 'staff')->values()->map($shape)->all(),
        ];
    }
}
