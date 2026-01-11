<?php

namespace App\Service;

use App\Models\Portfolio;
use App\Repository\PortfolioRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PortfolioService
{
    public function __construct(
        protected PortfolioRepository $repository
    ) {}

    /* ==========================
        PUBLIC
    =========================== */

    public function getAllActive()
    {
        return Cache::remember('portfolios.all.active', 3600, function () {
            return $this->repository->getAllActive();
        });
    }

    public function getPaginated(int $perPage = 12)
    {
        return $this->repository->paginate($perPage);
    }

    public function getFeatured(int $limit = 4): Collection
    {
        return Cache::remember("portfolios.featured.$limit", 3600, function () use ($limit) {
            return $this->repository->getFeatured($limit);
        });
    }

    public function getBySlug(string $slug): ?Portfolio
    {
        return Cache::remember("portfolios.$slug", 3600, function () use ($slug) {
            return $this->repository->findBySlug($slug);
        });
    }

    /* ==========================
        ADMIN
    =========================== */

    public function findById(int $id): ?Portfolio
    {
        return $this->repository->findById($id);
    }

    /**
     * Get paginated portfolios for admin with filters.
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null,
        ?int $serviceId = null
    ) {
        return $this->repository->getAdminPaginated($perPage, $search, $status, $serviceId);
    }

    /**
     * Get statistics for admin.
     */
    public function getAdminStatistics(): array
    {
        return [
            'total' => Portfolio::count(),
            'active' => Portfolio::where('is_active', true)->count(),
            'inactive' => Portfolio::where('is_active', false)->count(),
            'featured' => Portfolio::where('is_featured', true)->count(),
        ];
    }

    /**
     * Create new portfolio.
     */
    public function create(array $data, $request): Portfolio
    {
        $data['slug'] = $this->generateSlug($data['title']);

        // Handle main image
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')
                ->store('portfolios', 'public');
        }

        // Handle gallery
        if ($request->hasFile('gallery')) {
            $gallery = [];
            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('portfolios/gallery', 'public');
            }
            $data['gallery'] = $gallery;
        }

        $data['is_active']   = $data['is_active']   ?? true;
        $data['is_featured'] = $data['is_featured'] ?? false;
        $data['order']       = $data['order']       ?? Portfolio::max('order') + 1;

        $portfolio = $this->repository->create($data);

        $this->clearCache();

        return $portfolio;
    }

    /**
     * Update portfolio.
     */
    public function update(Portfolio $portfolio, array $data, $request): bool
    {
        if (isset($data['title']) && $data['title'] !== $portfolio->title) {
            $data['slug'] = $this->generateSlug($data['title'], $portfolio->id);
        }

        // Handle main image
        if ($request->hasFile('image')) {
            if ($portfolio->image) {
                Storage::disk('public')->delete($portfolio->image);
            }
            $data['image'] = $request->file('image')
                ->store('portfolios', 'public');
        }

        // Handle gallery
        if ($request->hasFile('gallery')) {
            if ($portfolio->gallery) {
                foreach ($portfolio->gallery as $old) {
                    Storage::disk('public')->delete($old);
                }
            }

            $gallery = [];
            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('portfolios/gallery', 'public');
            }
            $data['gallery'] = $gallery;
        }

        $updated = $this->repository->update($portfolio, $data);

        if ($updated) {
            $this->clearCache();
        }

        return $updated;
    }

    /**
     * Delete portfolio.
     */
    public function delete(Portfolio $portfolio): bool
    {
        if ($portfolio->image) {
            Storage::disk('public')->delete($portfolio->image);
        }

        if ($portfolio->gallery) {
            foreach ($portfolio->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }

        $deleted = $this->repository->delete($portfolio);

        if ($deleted) {
            $this->clearCache();
        }

        return $deleted;
    }

    /**
     * Toggle portfolio status.
     */
    public function toggleStatus(Portfolio $portfolio): bool
    {
        $updated = $this->repository->update($portfolio, [
            'is_active' => !$portfolio->is_active,
        ]);

        if ($updated) {
            $this->clearCache();
        }

        return $updated;
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(Portfolio $portfolio): bool
    {
        $updated = $this->repository->update($portfolio, [
            'is_featured' => !$portfolio->is_featured,
        ]);

        if ($updated) {
            $this->clearCache();
        }

        return $updated;
    }

    /**
     * Update portfolios order.
     */
    public function updateOrder(array $portfolios): void
    {
        foreach ($portfolios as $portfolioData) {
            Portfolio::where('id', $portfolioData['id'])
                ->update(['order' => $portfolioData['order']]);
        }

        $this->clearCache();
    }

    /**
     * Bulk delete portfolios.
     */
    public function bulkDelete(array $ids): int
    {
        $portfolios = Portfolio::whereIn('id', $ids)->get();
        $count = 0;

        foreach ($portfolios as $portfolio) {
            if ($this->delete($portfolio)) {
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
        $count = Portfolio::whereIn('id', $ids)
            ->update(['is_active' => $status]);

        if ($count > 0) {
            $this->clearCache();
        }

        return $count;
    }

    /**
     * Duplicate a portfolio.
     */
    public function duplicatePortfolio(Portfolio $portfolio): Portfolio
    {
        $newPortfolio = $portfolio->replicate();
        $newPortfolio->title = $portfolio->title . ' (Copy)';
        $newPortfolio->slug = $this->generateSlug($newPortfolio->title);
        $newPortfolio->is_active = false;
        $newPortfolio->is_featured = false;
        $newPortfolio->order = Portfolio::max('order') + 1;

        // Copy images if exist
        if ($portfolio->image) {
            $extension = pathinfo($portfolio->image, PATHINFO_EXTENSION);
            $newImagePath = 'portfolios/' . Str::random(40) . '.' . $extension;
            Storage::disk('public')->copy($portfolio->image, $newImagePath);
            $newPortfolio->image = $newImagePath;
        }

        if ($portfolio->gallery) {
            $newGallery = [];
            foreach ($portfolio->gallery as $image) {
                $extension = pathinfo($image, PATHINFO_EXTENSION);
                $newImagePath = 'portfolios/gallery/' . Str::random(40) . '.' . $extension;
                Storage::disk('public')->copy($image, $newImagePath);
                $newGallery[] = $newImagePath;
            }
            $newPortfolio->gallery = $newGallery;
        }

        $newPortfolio->save();

        $this->clearCache();

        return $newPortfolio;
    }

    /* ==========================
        HELPER
    =========================== */

    protected function generateSlug(string $title, ?int $ignoreId = null): string
    {
        $slug = Str::slug($title);
        $original = $slug;
        $i = 1;

        while (
            Portfolio::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $original . '-' . $i++;
        }

        return $slug;
    }

    protected function clearCache(): void
    {
        Cache::forget('portfolios.all.active');
        
        // Clear featured cache
        for ($i = 1; $i <= 20; $i++) {
            Cache::forget("portfolios.featured.{$i}");
        }
        
        // Clear individual portfolio caches
        $portfolios = Portfolio::all();
        foreach ($portfolios as $portfolio) {
            Cache::forget("portfolios.{$portfolio->slug}");
        }
    }
}