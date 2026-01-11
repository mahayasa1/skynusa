<?php

namespace App\Service;

use App\Models\Services;
use App\Repository\ServicesRepository;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServicesService
{

    private function transformService(Services $service): array
    {
        return [
            'id' => $service->id,
            'title' => $service->title,
            'slug' => $service->slug,
            'description' => $service->description,
            'short_description' => $service->short_description,
            'icon' => $service->icon,
            'image' => $service->image,
            'features' => $service->features ?? [],
            'price' => $service->price,
            'is_active' => $service->is_active,
            'price_text' => $service->price_text,
            'duration' => $service->duration,
        ];
    }

    public function __construct(
        protected ServicesRepository $serviceRepository
    ) {}

    /**
     * Get all active services with caching.
     */
    public function getAllActive(): Collection
    {
        return Cache::remember('services.active', 3600, function () {
            return $this->serviceRepository->getAllActive();
        });
    }

    /**
     * Get service by slug with caching.
     */
    public function getBySlug(string $slug): ?Services
    {
        return Cache::remember("services.{$slug}", 3600, function () use ($slug) {
            return $this->serviceRepository->findBySlug($slug);
        });
    }

    /**
     * Get service by ID.
     */
    public function findById(int $id): ?Services
    {
        return $this->serviceRepository->findById($id);
    }

    /**
     * Get paginated services for admin with filters.
     */
    public function getAdminPaginated(int $perPage = 15, ?string $search = null, ?string $status = null)
    {
        return $this->serviceRepository->getAdminPaginated($perPage, $search, $status)->through(fn ($s) => $this->transformService($s));
    }

    /**
     * Create a new service.
     */
    public function createService(array $data, $request): Services
    {
        // Generate unique slug
        $data['slug'] = $this->generateUniqueSlug($data['title']);
        
        // Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('services', 'public');
        }
        
        // Handle icon upload
        if ($request->hasFile('icon')) {
            $data['icon'] = $request->file('icon')->store('services/icons', 'public');
        }
        
        // Set order if not provided
        if (!isset($data['order'])) {
            $data['order'] = Services::max('order') + 1;
        }
        
        // Set default values
        $data['is_active'] = $data['is_active'] ?? true;
        
        $service = $this->serviceRepository->create($data);
        
        $this->clearCache();
        
        return $service;
    }

    /**
     * Update service.
     */
    public function updateService(Services $service, array $data, $request): bool
    {
        // Update slug if title changed
        if (isset($data['title']) && $data['title'] !== $service->title) {
            $data['slug'] = $this->generateUniqueSlug($data['title'], $service->id);
        }
        
        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $data['image'] = $request->file('image')->store('services', 'public');
        }
        
        // Handle icon upload
        if ($request->hasFile('icon')) {
            // Delete old icon
            if ($service->icon) {
                Storage::disk('public')->delete($service->icon);
            }
            $data['icon'] = $request->file('icon')->store('services/icons', 'public');
        }
        
        $updated = $this->serviceRepository->update($service, $data);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Delete service.
     */
    public function deleteService(Services $service): bool
    {
        // Delete associated images
        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }
        
        if ($service->icon) {
            Storage::disk('public')->delete($service->icon);
        }
        
        $deleted = $this->serviceRepository->delete($service);
        
        if ($deleted) {
            $this->clearCache();
        }
        
        return $deleted;
    }

    /**
     * Toggle service status.
     */
    public function toggleStatus(Services $service): bool
    {
        $updated = $this->serviceRepository->update($service, [
            'is_active' => !$service->is_active,
        ]);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured(Services $service): bool
    {
        $updated = $this->serviceRepository->update($service, [
            'is_featured' => !$service->is_featured,
        ]);
        
        if ($updated) {
            $this->clearCache();
        }
        
        return $updated;
    }

    /**
     * Update services order.
     */
    public function updateOrder(array $services): void
    {
        foreach ($services as $serviceData) {
            Services::where('id', $serviceData['id'])
                ->update(['order' => $serviceData['order']]);
        }
        
        $this->clearCache();
    }

    /**
     * Bulk delete services.
     */
    public function bulkDelete(array $ids): int
    {
        $services = Services::whereIn('id', $ids)->get();
        $count = 0;
        
        foreach ($services as $service) {
            if ($this->deleteService($service)) {
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
        $count = Services::whereIn('id', $ids)
            ->update(['is_active' => $status]);
        
        if ($count > 0) {
            $this->clearCache();
        }
        
        return $count;
    }

    /**
     * Duplicate a service.
     */
    public function duplicateService(Services $service): Services
    {
        $newService = $service->replicate();
        $newService->title = $service->title . ' (Copy)';
        $newService->slug = $this->generateUniqueSlug($newService->title);
        $newService->is_active = false;
        $newService->order = Services::max('order') + 1;
        $newService->save();
        
        $this->clearCache();
        
        return $newService;
    }

    /**
     * Get paginated services.
     */
    public function getPaginated(int $perPage = 15)
    {
        return $this->serviceRepository->paginate($perPage);
    }

    /**
     * Get statistics for public.
     */
    public function getStatistics(): array
    {
        return Cache::remember('services.statistics', 3600, function () {
            return [
                'total_services' => $this->serviceRepository->getActiveCount(),
                'services' => $this->serviceRepository->getAllActive(),
            ];
        });
    }

    /**
     * Get statistics for admin.
     */
    public function getAdminStatistics(): array
    {
        return [
            'total' => Services::count(),
            'active' => Services::where('is_active', true)->count(),
            'inactive' => Services::where('is_active', false)->count(),
        ];
    }

    /**
     * Generate unique slug.
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
     * Check if slug exists.
     */
    protected function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = Services::where('slug', $slug);
        
        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }
        
        return $query->exists();
    }

    /**
     * Clear all service caches.
     */
    protected function clearCache(): void
    {
        Cache::forget('services.active');
        Cache::forget('services.statistics');
        
        // Clear individual service caches
        $services = Services::all();
        foreach ($services as $service) {
            Cache::forget("services.{$service->slug}");
        }
    }
}