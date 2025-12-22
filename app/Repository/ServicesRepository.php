<?php

namespace App\Repository;

use App\Models\Services;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ServicesRepository
{
    /**
     * Get all active services ordered.
     */
    public function getAllActive(): Collection
    {
        return Services::active()
            ->ordered()
            ->get();
    }

    /**
     * Get service by slug.
     */
    public function findBySlug(string $slug): ?Services
    {
        return Services::where('slug', $slug)
            ->active()
            ->first();
    }

    /**
     * Get service by id.
     */
    public function findById(int $id): ?Services
    {
        return Services::find($id);
    }

    /**
     * Get paginated services for admin with filters.
     */
    public function getAdminPaginated(int $perPage = 15, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = Services::query();
        
        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%");
            });
        }
        
        // Apply status filter
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }
        
        return $query->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new service.
     */
    public function create(array $data): Services
    {
        return Services::create($data);
    }

    /**
     * Update service.
     */
    public function update(Services $service, array $data): bool
    {
        return $service->update($data);
    }

    /**
     * Delete service.
     */
    public function delete(Services $service): bool
    {
        return $service->delete();
    }

    /**
     * Get paginated services (public).
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Services::active()
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get total active services count.
     */
    public function getActiveCount(): int
    {
        return Services::active()->count();
    }

    /**
     * Get featured services.
     */
    public function getFeatured(int $limit = 3): Collection
    {
        return Services::active()
            ->featured()
            ->ordered()
            ->limit($limit)
            ->get();
    }

    /**
     * Search services.
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return Services::active()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('short_description', 'like', "%{$query}%");
            })
            ->ordered()
            ->paginate($perPage);
    }
}