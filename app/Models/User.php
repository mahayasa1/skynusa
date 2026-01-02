<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
        protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'telp',
        'role',
        'foto',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Check if user is admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is manager
     */
    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    /**
     * Check if user is head
     */
    public function isHead(): bool
    {
        return $this->role === 'head';
    }

    /**
     * Check if user is staff
     */
    public function isStaff(): bool
    {
        return $this->role === 'staff';
    }

    /**
     * Check if user has specific role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Get role permissions for frontend
     */
    public function getPermissionsAttribute(): array
    {
        return match($this->role) {
            'admin' => [
                'users' => ['create', 'read', 'update', 'delete'],
                'services' => ['create', 'read', 'update', 'delete'],
                'portfolio' => ['create', 'read', 'update', 'delete'],
                'companies' => ['create', 'read', 'update', 'delete'],
                'pesanan' => ['create', 'read', 'update', 'delete'],
                'pesan' => ['create', 'read', 'update', 'delete'],
            ],
            'manager' => [
                'pesanan' => ['create', 'read', 'update', 'delete'],
                'portfolio' => ['create', 'read', 'update', 'delete'],
            ],
            'head' => [
                'services' => ['create', 'read', 'update', 'delete'],
                'portfolio' => ['create', 'read', 'update', 'delete'],
                'companies' => ['create', 'read', 'update', 'delete'],
            ],
            'staff' => [
                'pesan' => ['read'],
                'pesanan' => ['read'],
            ],
            default => [],
        };
    }
}