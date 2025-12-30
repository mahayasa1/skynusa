<?php

namespace App\Repository;

use App\Models\Pesanan;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class PesananRepository
{
    /**
     * Find by ID
     */
    public function findById(int $id): ?Pesanan
    {
        return Pesanan::with('service')->find($id);
    }

    /**
     * Find by code
     */
    public function findByCode(string $code): ?Pesanan
    {
        return Pesanan::with('service')->where('code', $code)->first();
    }

    /**
     * Get paginated orders for admin
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null,
        ?int $serviceId = null
    ): LengthAwarePaginator {
        $query = Pesanan::with('service');

        if ($search) {
            $query->search($search);
        }

        if ($status) {
            $query->byStatus($status);
        }

        if ($serviceId) {
            $query->where('service_id', $serviceId);
        }

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Create new order
     */
    public function create(array $data): Pesanan
    {
        return Pesanan::create($data);
    }

    /**
     * Update order
     */
    public function update(Pesanan $pesanan, array $data): bool
    {
        return $pesanan->update($data);
    }

    /**
     * Delete order (soft delete)
     */
    public function delete(Pesanan $pesanan): bool
    {
        return $pesanan->delete();
    }

    /**
     * Get active orders
     */
    public function getActive(): Collection
    {
        return Pesanan::with('service')
            ->active()
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get orders by status
     */
    public function getByStatus(string $status): Collection
    {
        return Pesanan::with('service')
            ->byStatus($status)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        return [
            'total' => Pesanan::count(),
            'pending' => Pesanan::byStatus(Pesanan::STATUS_PENDING)->count(),
            'verifikasi' => Pesanan::byStatus(Pesanan::STATUS_VERIFIKASI)->count(),
            'proses' => Pesanan::byStatus(Pesanan::STATUS_PROSES)->count(),
            'approval' => Pesanan::byStatus(Pesanan::STATUS_APPROVAL)->count(),
            'running' => Pesanan::byStatus(Pesanan::STATUS_RUNNING)->count(),
            'selesai' => Pesanan::byStatus(Pesanan::STATUS_SELESAI)->count(),
            'active' => Pesanan::active()->count(),
        ];
    }

    /**
     * Get recent orders
     */
    public function getRecent(int $limit = 10): Collection
    {
        return Pesanan::with('service')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }
}