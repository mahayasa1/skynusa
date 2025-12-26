<?php

namespace App\Service;

use App\Models\Company;
use App\Repository\CompanyRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompanyService
{
    public function __construct(
        protected CompanyRepository $companyRepository
    ) {}

    /**
     * Get all active companies with caching.
     */
    public function getAllActive(): Collection
    {
        return Cache::remember('companies.active', 3600, function () {
            return $this->companyRepository->getAllActive();
        });
    }

    /**
     * Get company by slug with caching.
     */
    public function getBySlug(string $slug): ?Company
    {
        return Cache::remember("companies.{$slug}", 3600, function () use ($slug) {
            return $this->companyRepository->findBySlug($slug);
        });
    }

    /**
     * Get company by ID.
     */
    public function findById(int $id): ?Company
    {
        return $this->companyRepository->findById($id);
    }

    /**
     * Get paginated companies for admin with filters.
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null
    ) {
        return $this->companyRepository->getAdminPaginated($perPage, $search, $status);
    }

    /**
     * Create a new company.
     */
    public function createCompany(array $data, $request): Company
    {
        // Generate unique slug
        $data['slug'] = $this->generateUniqueSlug($data['name']);
        
        // Handle logo upload
        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('companies', 'public');
        }
        
        // Set default values
        $data['is_active'] = $data['is_active'] ?? true;
        
        $company = $this->companyRepository->create($data);
        
        $this->clearCache();
        
        return $company;
    }

    /**
     * Update company.
     */
    public function updateCompany(Company $company, array $data, $request): bool
    {
        // Update slug if name changed
        if (isset($data['name']) && $data['name'] !== $company->name) {
            $data['slug'] = $this->generateUniqueSlug($data['name'], $company->id);
        }
        
        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo
            if ($company->logo) {
                Storage::disk('public')->delete($company->logo);
            }
            $data['logo'] = $request->file('logo')->store('companies', 'public');
        }
        
        $updated = $this->companyRepository->update($company, $data);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Delete company.
     */
    public function deleteCompany(Company $company): bool
    {
        // Delete associated logo
        if ($company->logo) {
            Storage::disk('public')->delete($company->logo);
        }
        
        $deleted = $this->companyRepository->delete($company);
        
        if ($deleted) {
            $this->clearCache();
        }
        
        return $deleted;
    }

    /**
     * Toggle company status.
     */
    public function toggleStatus(Company $company): bool
    {
        $updated = $this->companyRepository->update($company, [
            'is_active' => !$company->is_active,
        ]);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Bulk delete companies.
     */
    public function bulkDelete(array $ids): int
    {
        $companies = Company::whereIn('id', $ids)->get();
        $count = 0;
        
        foreach ($companies as $company) {
            if ($this->deleteCompany($company)) {
                $count++;
            }
        }
        
        return $count;
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(array $ids, bool $status): int
    {
        $count = Company::whereIn('id', $ids)
            ->update(['is_active' => $status]);
        
        if ($count > 0) {
            $this->clearCache();
        }
        
        return $count;
    }

    /**
     * Get paginated companies.
     */
    public function getPaginated(int $perPage = 12)
    {
        return $this->companyRepository->paginate($perPage);
    }

    /**
     * Get statistics for admin.
     */
    public function getAdminStatistics(): array
    {
        return [
            'total' => Company::count(),
            'active' => Company::where('is_active', true)->count(),
            'inactive' => Company::where('is_active', false)->count(),
        ];
    }

    /**
     * Get companies for homepage (random 12).
     */
    public function getCompaniesForHome(int $limit = 12): Collection
    {
        return Cache::remember("companies.home.{$limit}", 3600, function () use ($limit) {
            return $this->companyRepository->getRandom($limit);
        });
    }

    /**
     * Generate unique slug.
     */
    protected function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    /**
     * Check if slug exists.
     */
    protected function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = Company::where('slug', $slug);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

    /**
     * Clear all company caches.
     */
    protected function clearCache(): void
    {
        Cache::forget('companies.active');
        
        // Clear home cache
        for ($i = 1; $i <= 20; $i++) {
            Cache::forget("companies.home.{$i}");
        }
        
        // Clear individual company caches
        $companies = Company::all();
        foreach ($companies as $company) {
            Cache::forget("companies.{$company->slug}");
        }
    }
}