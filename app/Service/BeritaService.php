<?php

namespace App\Service;

use App\Models\Berita;
use App\Repository\BeritaRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BeritaService
{
    public function __construct(
        protected BeritaRepository $repository
    ) {}

    /**
     * Get all published beritas with caching
     */
    public function getAllPublished(): Collection
    {
        return Cache::remember('beritas.published', 3600, function () {
            return $this->repository->getAllPublished();
        });
    }

    /**
     * Get paginated published beritas
     */
    public function getPaginatedPublished(int $perPage = 12)
    {
        return $this->repository->getPaginatedPublished($perPage);
    }

    /**
     * Get featured beritas
     */
    public function getFeatured(int $limit = 3): Collection
    {
        return Cache::remember("beritas.featured.{$limit}", 3600, function () use ($limit) {
            return $this->repository->getFeatured($limit);
        });
    }

    /**
     * Get berita by slug
     */
    public function getBySlug(string $slug): ?Berita
    {
        $berita = $this->repository->findBySlug($slug);
        
        if ($berita) {
            $berita->incrementViews();
        }
        
        return $berita;
    }

    /**
     * Find berita by ID
     */
    public function findById(int $id): ?Berita
    {
        return $this->repository->findById($id);
    }

    /**
     * Get related beritas
     */
    public function getRelated(Berita $berita, int $limit = 3): Collection
    {
        return $this->repository->getRelated($berita, $limit);
    }

    /**
     * Get beritas by category
     */
    public function getByCategory(string $category, int $perPage = 12)
    {
        return $this->repository->getByCategory($category, $perPage);
    }

    /**
     * Get paginated beritas for admin
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null,
        ?string $category = null
    ) {
        return $this->repository->getAdminPaginated($perPage, $search, $status, $category);
    }

    /**
     * Create new berita
     */
    public function create(array $data, $request): Berita
    {
        // Generate slug
        $data['slug'] = $this->generateUniqueSlug($data['title']);

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')
                ->store('beritas', 'public');
        }

        // Handle gallery
        if ($request->hasFile('gallery')) {
            $gallery = [];
            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('beritas/gallery', 'public');
            }
            $data['gallery'] = $gallery;
        }

        // Set published_at if is_published
        if (isset($data['is_published']) && $data['is_published'] && !isset($data['published_at'])) {
            $data['published_at'] = now();
        }

        // Set defaults
        $data['views'] = 0;
        $data['order'] = $data['order'] ?? Berita::max('order') + 1;

        $berita = $this->repository->create($data);
        
        $this->clearCache();
        
        return $berita;
    }

    /**
     * Update berita
     */
    public function update(Berita $berita, array $data, $request): bool
    {
        // Update slug if title changed
        if (isset($data['title']) && $data['title'] !== $berita->title) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $berita->id);
        }

        // Handle featured image
        if ($request->hasFile('featured_image')) {
            if ($berita->featured_image) {
                Storage::disk('public')->delete($berita->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')
                ->store('beritas', 'public');
        }

        // Handle gallery
        if ($request->hasFile('gallery')) {
            if ($berita->gallery) {
                foreach ($berita->gallery as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            $gallery = [];
            foreach ($request->file('gallery') as $image) {
                $gallery[] = $image->store('beritas/gallery', 'public');
            }
            $data['gallery'] = $gallery;
        }

        // Set published_at if is_published and not set
        if (isset($data['is_published']) && $data['is_published'] && !$berita->published_at) {
            $data['published_at'] = now();
        }

        $updated = $this->repository->update($berita, $data);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Delete berita
     */
    public function delete(Berita $berita): bool
    {
        // Delete images
        if ($berita->featured_image) {
            Storage::disk('public')->delete($berita->featured_image);
        }
        
        if ($berita->gallery) {
            foreach ($berita->gallery as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        
        $deleted = $this->repository->delete($berita);
        
        if ($deleted) {
            $this->clearCache();
        }
        
        return $deleted;
    }

    /**
     * Toggle publish status
     */
    public function togglePublish(Berita $berita): bool
    {
        $data = ['is_published' => !$berita->is_published];
        
        if ($data['is_published'] && !$berita->published_at) {
            $data['published_at'] = now();
        }
        
        $updated = $this->repository->update($berita, $data);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(Berita $berita): bool
    {
        $updated = $this->repository->update($berita, [
            'is_featured' => !$berita->is_featured,
        ]);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Bulk delete
     */
    public function bulkDelete(array $ids): int
    {
        $beritas = Berita::whereIn('id', $ids)->get();
        $count = 0;
        
        foreach ($beritas as $berita) {
            if ($this->delete($berita)) {
                $count++;
            }
        }
        
        return $count;
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(array $ids, bool $status): int
    {
        $count = Berita::whereIn('id', $ids)->update([
            'is_published' => $status,
            'published_at' => $status ? now() : null,
        ]);
        
        if ($count > 0) {
            $this->clearCache();
        }
        
        return $count;
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        return $this->repository->getStatistics();
    }

    /**
     * Get recent beritas
     */
    public function getRecent(int $limit = 5): Collection
    {
        return $this->repository->getRecent($limit);
    }

    /**
     * Get popular beritas
     */
    public function getPopular(int $limit = 5): Collection
    {
        return $this->repository->getPopular($limit);
    }

    /**
     * Generate unique slug
     */
    protected function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $counter = 1;
        
        while ($this->slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }
        
        return $slug;
    }

    /**
     * Check if slug exists
     */
    protected function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = Berita::where('slug', $slug);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

    /**
     * Clear cache
     */
    protected function clearCache(): void
    {
        Cache::forget('beritas.published');
        
        // Clear featured cache
        for ($i = 1; $i <= 20; $i++) {
            Cache::forget("beritas.featured.{$i}");
        }
    }
}