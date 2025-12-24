<?php

namespace App\Repository;

use App\Models\Portfolio;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PortfolioRepository
{
    public function getAll(): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->ordered()
            ->get();
    }
    public function getAllActive(): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->orderByDesc('is_featured')
            ->orderBy('order')
            ->get();
    }


    public function getActive(): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->ordered()
            ->get();
    }

    public function getFeatured(int $limit = 4): Collection
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->featured()
            ->ordered()
            ->limit($limit)
            ->get();
    }

    public function findBySlug(string $slug): ?Portfolio
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();
    }

    public function findById(int $id): ?Portfolio
    {
        return Portfolio::with(['service', 'company', 'category'])->find($id);
    }

    public function paginate(int $perPage = 12): LengthAwarePaginator
    {
        return Portfolio::with(['service', 'company', 'category'])
            ->active()
            ->ordered()
            ->paginate($perPage);
    }

    public function create(array $data): Portfolio
    {
        return Portfolio::create($data);
    }

    public function update(Portfolio $portfolio, array $data): bool
    {
        return $portfolio->update($data);
    }

    public function delete(Portfolio $portfolio): bool
    {
        return $portfolio->delete();
    }
}
