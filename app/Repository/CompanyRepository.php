<?php

namespace App\Repository;

use App\Models\Company;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CompanyRepository
{
    /**
     * Get all active companies ordered.
     */
    public function getAllActive(): Collection
    {
        return Company::active()->ordered()->get();
    }

    /**
     * Get company by slug.
     */
    public function findBySlug(string $slug): ?Company
    {
        return Company::where('slug', $slug)->active()->first();
    }

    /**
     * Get company by id.
     */
    public function findById(int $id): ?Company
    {
        return Company::find($id);
    }

    /**
     * Get paginated companies for admin with filters.
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null
    ): LengthAwarePaginator {
        $query = Company::query();
        
        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }
        
        // Apply status filter
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }
        
        return $query->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create a new company.
     */
    public function create(array $data): Company
    {
        return Company::create($data);
    }

    /**
     * Update company.
     */
    public function update(Company $company, array $data): bool
    {
        return $company->update($data);
    }

    /**
     * Delete company.
     */
    public function delete(Company $company): bool
    {
        return $company->delete();
    }

    /**
     * Get paginated companies (public).
     */
    public function paginate(int $perPage = 12): LengthAwarePaginator
    {
        return Company::active()->ordered()->paginate($perPage);
    }

    /**
     * Get total active companies count.
     */
    public function getActiveCount(): int
    {
        return Company::active()->count();
    }

    /**
     * Get random companies for display.
     */
    public function getRandom(int $limit = 12): Collection
    {
        return Company::active()->inRandomOrder()->limit($limit)->get();
    }
}
