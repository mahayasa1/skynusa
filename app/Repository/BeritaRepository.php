<?php

namespace App\Repository;

use App\Models\Berita;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class BeritaRepository
{
    /**
     * Get all published beritas
     */
    public function getAllPublished(): Collection
    {
        return Berita::with('user')
            ->published()
            ->ordered()
            ->get();
    }

    /**
     * Get paginated published beritas
     */
    public function getPaginatedPublished(int $perPage = 12): LengthAwarePaginator
    {
        return Berita::with('user')
            ->published()
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get featured beritas
     */
    public function getFeatured(int $limit = 3): Collection
    {
        return Berita::with('user')
            ->published()
            ->featured()
            ->ordered()
            ->limit($limit)
            ->get();
    }

    /**
     * Find berita by slug
     */
    public function findBySlug(string $slug): ?Berita
    {
        return Berita::with('user')
            ->where('slug', $slug)
            ->published()
            ->first();
    }

    /**
     * Find berita by ID
     */
    public function findById(int $id): ?Berita
    {
        return Berita::with('user')->find($id);
    }

    /**
     * Get related beritas
     */
    public function getRelated(Berita $berita, int $limit = 3): Collection
    {
        return Berita::with('user')
            ->published()
            ->where('id', '!=', $berita->id)
            ->where(function($query) use ($berita) {
                if ($berita->category) {
                    $query->where('category', $berita->category);
                }
            })
            ->ordered()
            ->limit($limit)
            ->get();
    }

    /**
     * Get beritas by category
     */
    public function getByCategory(string $category, int $perPage = 12): LengthAwarePaginator
    {
        return Berita::with('user')
            ->published()
            ->byCategory($category)
            ->ordered()
            ->paginate($perPage);
    }

    /**
     * Get paginated beritas for admin
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null,
        ?string $category = null
    ): LengthAwarePaginator {
        $query = Berita::with('user');

        // Search filter
        if ($search) {
            $query->search($search);
        }

        // Status filter
        if ($status === 'published') {
            $query->where('is_published', true);
        } elseif ($status === 'draft') {
            $query->where('is_published', false);
        }

        // Category filter
        if ($category) {
            $query->byCategory($category);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create new berita
     */
    public function create(array $data): Berita
    {
        return Berita::create($data);
    }

    /**
     * Update berita
     */
    public function update(Berita $berita, array $data): bool
    {
        return $berita->update($data);
    }

    /**
     * Delete berita
     */
    public function delete(Berita $berita): bool
    {
        return $berita->delete();
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => Berita::count(),
            'published' => Berita::where('is_published', true)->count(),
            'draft' => Berita::where('is_published', false)->count(),
            'featured' => Berita::where('is_featured', true)->count(),
            'total_views' => Berita::sum('views'),
        ];
    }

    /**
     * Get recent beritas
     */
    public function getRecent(int $limit = 5): Collection
    {
        return Berita::with('user')
            ->published()
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get popular beritas
     */
    public function getPopular(int $limit = 5): Collection
    {
        return Berita::with('user')
            ->published()
            ->orderBy('views', 'desc')
            ->limit($limit)
            ->get();
    }
}