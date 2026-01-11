<?php

namespace App\Repository;

use App\Models\Portfolio;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PortfolioRepository
{
    /**
     * Get all portfolios with relationships.
     */
    public function getAll(): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->ordered()
            ->get();
    }

    /**
     * Get all active portfolios.
     */
    public function getAllActive(): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->orderByDesc('is_featured')
            ->orderBy('order')
            ->get();
    }

    /**
     * Get active portfolios.
     */
    public function getActive(): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->ordered()
            ->get();
    }

    /**
     * Get featured portfolios.
     */
    public function getFeatured(int $limit = 4): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->featured()
            ->ordered()
            ->limit($limit)
            ->get();
    }

    /**
     * Find portfolio by slug.
     */
    public function findBySlug(string $slug): ?Portfolio
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Find portfolio by ID.
     */
    public function findById(int $id): ?Portfolio
    {
        return Portfolio::with(['service', 'company', 'category'])->find($id);
    }

    /**
     * Get paginated portfolios (public).
     */
    public function paginate(int $perPage = 12): LengthAwarePaginator
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get paginated portfolios for admin with filters.
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null,
        ?int $serviceId = null
    ): LengthAwarePaginator {
        $query = Portfolio::with(['service', 'company', 'category']);
        
        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%");
            });
        }
        
        // Apply status filter
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }
        
        // Apply service filter
        if ($serviceId) {
            $query->where('service_id', $serviceId);
        }
        
        return $query->orderBy('order')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create new portfolio.
     */
    public function create(array $data): Portfolio
    {
        return Portfolio::create($data);
    }

    /**
     * Update portfolio.
     */
    public function update(Portfolio $portfolio, array $data): bool
    {
        return $portfolio->update($data);
    }

    /**
     * Delete portfolio.
     */
    public function delete(Portfolio $portfolio): bool
    {
        return $portfolio->delete();
    }

    /**
     * Get total active portfolios count.
     */
    public function getActiveCount(): int
    {
        return Portfolio::active()->count();
    }

    /**
     * Search portfolios.
     */
    public function search(string $query, int $perPage = 15): LengthAwarePaginator
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                    ->orWhere('description', 'like', "%{$query}%")
                    ->orWhere('location', 'like', "%{$query}%");
            })
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get portfolios by service.
     */
    public function getByService(int $serviceId, int $perPage = 12): LengthAwarePaginator
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->where('service_id', $serviceId)
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get portfolios by category.
     */
    public function getByCategory(int $categoryId, int $perPage = 12): LengthAwarePaginator
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->where('categories_id', $categoryId)
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get portfolios by company.
     */
    public function getByCompany(int $companyId, int $perPage = 12): LengthAwarePaginator
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->where('companies_id', $companyId)
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get recent portfolios.
     */
    public function getRecent(int $limit = 6): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}