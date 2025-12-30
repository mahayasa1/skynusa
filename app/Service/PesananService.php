<?php

namespace App\Service;

use App\Models\Pesanan;
use App\Repository\PesananRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\log;

class PesananService
{
    public function __construct(
        protected PesananRepository $pesananRepository
    ) {}

    /**
     * Find by ID
     */
    public function findById(int $id): ?Pesanan
    {
        return $this->pesananRepository->findById($id);
    }

    /**
     * Find by code (for tracking)
     */
    public function findByCode(string $code): ?Pesanan
    {
        return $this->pesananRepository->findByCode($code);
    }

    /**
     * Get paginated orders for admin
     */
    public function getAdminPaginated(
        int $perPage = 15,
        ?string $search = null,
        ?string $status = null,
        ?int $serviceId = null
    ) {
        return $this->pesananRepository->getAdminPaginated($perPage, $search, $status, $serviceId);
    }

    /**
     * Create new order from public form
     */
    public function createOrder(array $data): Pesanan
    {
        // Generate unique order code
        $data['code'] = $this->generateOrderCode();

        // Set default status
        $data['status'] = Pesanan::STATUS_PENDING;

        // Create order
        $pesanan = $this->pesananRepository->create($data);

        // Send confirmation email to user
        $this->sendOrderConfirmation($pesanan);

        return $pesanan;
    }

    /**
     * Update order
     */
    public function updateOrder(Pesanan $pesanan, array $data): bool
    {
        $oldStatus = $pesanan->status;
        $updated = $this->pesananRepository->update($pesanan, $data);

        // If status changed, send notification
        if ($updated && isset($data['status']) && $data['status'] !== $oldStatus) {
            $this->sendStatusChangeNotification($pesanan->fresh());
        }

        return $updated;
    }

    /**
     * Update order status
     */
    public function updateStatus(Pesanan $pesanan, string $status): bool
    {
        return $this->updateOrder($pesanan, ['status' => $status]);
    }

    /**
     * Delete order
     */
    public function deleteOrder(Pesanan $pesanan): bool
    {
        return $this->pesananRepository->delete($pesanan);
    }

    /**
     * Bulk delete
     */
    public function bulkDelete(array $ids): int
    {
        $orders = Pesanan::whereIn('id', $ids)->get();
        $count = 0;

        foreach ($orders as $order) {
            if ($this->deleteOrder($order)) {
                $count++;
            }
        }

        return $count;
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(array $ids, string $status): int
    {
        return Pesanan::whereIn('id', $ids)->update(['status' => $status]);
    }

    /**
     * Get active orders
     */
    public function getActiveOrders(): Collection
    {
        return $this->pesananRepository->getActive();
    }

    /**
     * Get orders by status
     */
    public function getOrdersByStatus(string $status): Collection
    {
        return $this->pesananRepository->getByStatus($status);
    }

    /**
     * Get statistics
     */
    public function getStatistics(): array
    {
        return $this->pesananRepository->getStatistics();
    }

    /**
     * Get recent orders
     */
    public function getRecentOrders(int $limit = 10): Collection
    {
        return $this->pesananRepository->getRecent($limit);
    }

    /**
     * Generate unique order code
     */
    protected function generateOrderCode(): string
    {
        do {
            // Format: ORD-YYYYMMDD-XXXXX
            $code = 'ORD-SKYNUSA-' . date('Ymd') . '-' . strtoupper(Str::random(5));
        } while (Pesanan::where('code', $code)->exists());

        return $code;
    }

    /**
     * Send order confirmation email (optional)
     */
    protected function sendOrderConfirmation(Pesanan $pesanan): void
    {
        try {
            Mail::to($pesanan->email)->send(new \App\Mail\OrderCreatedMail($pesanan));
        } catch (\Exception $e) {
            // Log error but don't fail the order creation
            Log::error('Failed to send order confirmation email: ' . $e->getMessage());
        }
    }

    /**
     * Send status change notification (optional)
     */
    protected function sendStatusChangeNotification(Pesanan $pesanan): void
    {
        try {
            Mail::to($pesanan->email)->send(new \App\Mail\OrderStatusChangedMail($pesanan));
        } catch (\Exception $e) {
            // Log error but don't fail the status update
            Log::error('Failed to send status change notification: ' . $e->getMessage());
        }
    }

    /**
     * Check if order can be updated
     */
    public function canUpdateOrder(Pesanan $pesanan): bool
    {
        return $pesanan->status !== Pesanan::STATUS_SELESAI;
    }

    /**
     * Check if order can be cancelled
     */
    public function canCancelOrder(Pesanan $pesanan): bool
    {
        return in_array($pesanan->status, [
            Pesanan::STATUS_PENDING,
            Pesanan::STATUS_VERIFIKASI,
        ]);
    }

    /**
     * Get next status options
     */
    public function getNextStatusOptions(string $currentStatus): array
    {
        $flow = [
            Pesanan::STATUS_PENDING => [Pesanan::STATUS_VERIFIKASI],
            Pesanan::STATUS_VERIFIKASI => [Pesanan::STATUS_PROSES],
            Pesanan::STATUS_PROSES => [Pesanan::STATUS_APPROVAL],
            Pesanan::STATUS_APPROVAL => [Pesanan::STATUS_RUNNING],
            Pesanan::STATUS_RUNNING => [Pesanan::STATUS_SELESAI],
            Pesanan::STATUS_SELESAI => [],
        ];

        return $flow[$currentStatus] ?? [];
    }

    /**
     * Get status progress percentage
     */
    public function getStatusProgress(string $status): int
    {
        $progress = [
            Pesanan::STATUS_PENDING => 0,
            Pesanan::STATUS_VERIFIKASI => 15,
            Pesanan::STATUS_PROSES => 35,
            Pesanan::STATUS_APPROVAL => 55,
            Pesanan::STATUS_RUNNING => 75,
            Pesanan::STATUS_SELESAI => 100,
        ];

        return $progress[$status] ?? 0;
    }
}