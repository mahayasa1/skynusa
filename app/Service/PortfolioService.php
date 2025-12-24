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

    public function create(array $data, $request): Portfolio
    {
        $data['slug'] = $this->generateSlug($data['title']);

        // image
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')
                ->store('portfolios', 'public');
        }

        // gallery
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

    public function update(Portfolio $portfolio, array $data, $request): bool
    {
        if (isset($data['title']) && $data['title'] !== $portfolio->title) {
            $data['slug'] = $this->generateSlug($data['title'], $portfolio->id);
        }

        if ($request->hasFile('image')) {
            if ($portfolio->image) {
                Storage::disk('public')->delete($portfolio->image);
            }
            $data['image'] = $request->file('image')
                ->store('portfolios', 'public');
        }

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
        Cache::flush();
    }
}
