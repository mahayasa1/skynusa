<?php

namespace App\Http\Controllers;

use App\Service\ServicesService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    public function __construct(
        protected ServicesService $serviceService
    ) {}

    public function index(): Response
{
    $services = $this->serviceService->getAllActive();
    $statistics = $this->serviceService->getStatistics();

    return Inertia::render('services', [
        'services' => $services,
        'statistics' => $statistics,
    ]);
}
    
    /**
     * Get services data for homepage
     * Method ini dipanggil dari route homepage
     */
    public function getServicesForHome()
    {
        $services = $this->serviceService->getAllActive();
        
        // Transform data untuk frontend
        return $services->map(function($service) {
            return [
                'id' => $service['id'],
                'title' => $service['title'],
                'slug' => $service['slug'],
                'description' => $service['description'],
                'short_description' => $service['short_description'],
                'icon' => $service['icon'],
                'image' => $service['image'],
                'features' => $service['features'] ?? [],
                'price' => $service['price'],
                'price_text' => $service['price_text'],
                'duration' => $service['duration'],
                'is_featured' => $service['is_featured'],
            ];
        });
    }

    /**
     * Display the specified service (Public).
     */
    public function show(string $slug): Response
    {
        $service = $this->serviceService->getBySlug($slug);
        
        if (!$service) {
            abort(404);
        }
        
        $relatedServices = $this->serviceService->getAllActive()
            ->where('id', '!=', $service->id)
            ->take(3);
        
        return Inertia::render('Services/Show', [
            'service' => $service,
            'relatedServices' => $relatedServices,
        ]);
    }

    // ============================================
    // ADMIN METHODS - Protected by middleware role:admin
    // ============================================

    /**
     * Display a listing of services for admin.
     */
    public function adminIndex(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $status = $request->input('status'); // all, active, inactive
        
        $services = $this->serviceService->getAdminPaginated($perPage, $search, $status);
        
        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'filters' => $request->only(['search', 'per_page', 'status']),
            'statistics' => $this->serviceService->getAdminStatistics(),
        ]);
    }

    /**
     * Show the form for creating a new service.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Services/Create');
    }

    /**
     * Store a newly created service.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'icon' => 'nullable|image|mimes:jpeg,jpg,png,svg,webp|max:1024',
            'features' => 'nullable|array',
            'price' => 'nullable|numeric|min:0',
            'price_text' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);
        
        $service = $this->serviceService->createService($validated, $request);
        
        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service created successfully.');
    }

    /**
     * Display the specified service for admin.
     */
    public function adminShow($id): Response
    {
        $service = $this->serviceService->findById($id);
        
        if (!$service) {
            abort(404);
        }
        
        return Inertia::render('Admin/Services/Show', [
            'service' => $service,
        ]);
    }

    /**
     * Show the form for editing the specified service.
     */
    public function edit($id): Response
    {
        $service = $this->serviceService->findById($id);
        
        if (!$service) {
            abort(404);
        }
        
        return Inertia::render('Admin/Services/Edit', [
            'service' => $service,
        ]);
    }

    /**
     * Update the specified service.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'short_description' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'icon' => 'nullable|image|mimes:jpeg,jpg,png,svg,webp|max:1024',
            'features' => 'nullable|array',
            'price' => 'nullable|numeric|min:0',
            'price_text' => 'nullable|string|max:100',
            'duration' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);
        
        $service = $this->serviceService->findById($id);
        
        if (!$service) {
            abort(404);
        }
        
        $this->serviceService->updateService($service, $validated, $request);
        
        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service updated successfully.');
    }

    /**
     * Remove the specified service.
     */
    public function destroy($id): RedirectResponse
    {
        $service = $this->serviceService->findById($id);
        
        if (!$service) {
            abort(404);
        }
        
        $this->serviceService->deleteService($service);
        
        return redirect()
            ->route('admin.services.index')
            ->with('success', 'Service deleted successfully.');
    }

    /**
     * Toggle service status.
     */
    public function toggleStatus($id): RedirectResponse
    {
        $service = $this->serviceService->findById($id);
        
        if (!$service) {
            abort(404);
        }
        
        $this->serviceService->toggleStatus($service);
        
        return back()->with('success', 'Service status updated successfully.');
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured($id): RedirectResponse
    {
        $service = $this->serviceService->findById($id);
        
        if (!$service) {
            abort(404);
        }
        
        $this->serviceService->toggleFeatured($service);
        
        return back()->with('success', 'Service featured status updated successfully.');
    }

    /**
     * Update services order.
     */
    public function updateOrder(Request $request): RedirectResponse
    {
        $request->validate([
            'services' => 'required|array',
            'services.*.id' => 'required|exists:services,id',
            'services.*.order' => 'required|integer',
        ]);
        
        $this->serviceService->updateOrder($request->services);
        
        return back()->with('success', 'Services order updated successfully.');
    }

    /**
     * Bulk delete services.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:services,id',
        ]);
        
        $count = $this->serviceService->bulkDelete($request->ids);
        
        return back()->with('success', "{$count} services deleted successfully.");
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:services,id',
            'status' => 'required|boolean',
        ]);
        
        $count = $this->serviceService->bulkUpdateStatus($request->ids, $request->status);
        
        $status = $request->status ? 'activated' : 'deactivated';
        
        return back()->with('success', "{$count} services {$status} successfully.");
    }

    /**
     * Duplicate a service.
     */
    public function duplicate($id): RedirectResponse
    {
        $service = $this->serviceService->findById($id);
        
        if (!$service) {
            abort(404);
        }
        
        $newService = $this->serviceService->duplicateService($service);
        
        return redirect()
            ->route('admin.services.edit', $newService->id)
            ->with('success', 'Service duplicated successfully.');
    }
}