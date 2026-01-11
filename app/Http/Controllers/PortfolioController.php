<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Services;
use App\Models\Company;
use App\Models\Categories;
use App\Service\PortfolioService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function __construct(
        protected PortfolioService $service
    ) {}

    /* ==========================
        PUBLIC
    =========================== */

    public function index()
    {
        $paginated = $this->service->getPaginated(12);

        return Inertia::render('portfolio', [
            // kirim ARRAY, bukan paginator
            'portfolios' => $paginated->items(),

            // statistik (optional, tapi TSX kamu support)
            'statistics' => [
                'total_projects' => $paginated->total(),
                'success_rate'   => '95%',
                'total_clients'  => 150,
            ],

            // featured kalau mau dipakai terpisah
            'featured' => $this->service->getFeatured(4),
        ]);
    }

    public function getPortfoliosForHome(int $limit = 12)
    {
        $portfolios = $this->service->getAllActive()
            ->take($limit);

        // Transform data untuk frontend (TSX-friendly)
        return $portfolios->map(function ($portfolio) {
            return [
                'id' => $portfolio->id,
                'service_id' => $portfolio->service_id,

                'title' => $portfolio->title,
                'slug' => $portfolio->slug,
                'description' => $portfolio->description,
                'short_description' => $portfolio->short_description,

                'image' => $portfolio->image,
                'gallery' => $portfolio->gallery ?? [],

                'client_name' => $portfolio->company?->name ?? null,
                'location' => $portfolio->location,

                'project_date' => optional($portfolio->project_date)?->toDateString(),
                'duration' => $portfolio->duration,

                'technologies' => $portfolio->technologies ?? [],
                'features' => $portfolio->features ?? [],

                'project_url' => $portfolio->project_url,

                'is_active' => (bool) $portfolio->is_active,
                'is_featured' => (bool) $portfolio->is_featured,

                'order' => $portfolio->order,

                'meta_title' => $portfolio->meta_title,
                'meta_description' => $portfolio->meta_description,
                'meta_keywords' => $portfolio->meta_keywords,

                'service' => $portfolio->service ? [
                    'id' => $portfolio->service->id,
                    'title' => $portfolio->service->title,
                    'slug' => $portfolio->service->slug,
                ] : null,
            ];
        });
    }

    public function show(string $slug)
    {
        $portfolio = $this->service->getBySlug($slug);
        abort_if(!$portfolio, 404);

        return Inertia::render('Portfolio/Show', [
            'portfolio' => $portfolio,
        ]);
    }

    /* ==========================
        ADMIN
    =========================== */

    /**
     * Display a listing of portfolios for admin.
     */
    public function adminIndex(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $status = $request->input('status');
        $serviceId = $request->input('service_id');

        $portfolios = $this->service->getAdminPaginated($perPage, $search, $status, $serviceId);
        $services = Services::active()->ordered()->get(['id', 'title']);

        return Inertia::render('admin/portfolio/index', [
            'portfolios' => $portfolios,
            'services' => $services,
            'filters' => $request->only(['search', 'per_page', 'status', 'service_id']),
            'statistics' => $this->service->getAdminStatistics(),
        ]);
    }

    /**
     * Display the specified portfolio for admin.
     */
    public function adminShow($id)
    {
        $portfolio = $this->service->findById($id);

        if (!$portfolio) {
            abort(404);
        }

        // Load relationships
        $portfolio->load(['service', 'company', 'category']);

        return Inertia::render('admin/portfolio/show', [
            'portfolio' => $portfolio,
        ]);
    }

    /**
     * Show the form for creating a new portfolio.
     */
    public function create()
    {
        return Inertia::render('admin/portfolio/create', [
            'services' => Services::active()->ordered()->get(['id', 'title']),
            'companies' => Company::active()->ordered()->get(['id', 'name']),
            'categories' => Categories::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created portfolio.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id'    => 'required|exists:services,id',
            'companies_id'  => 'required|exists:companies,id',
            'categories_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required',
            'short_description' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'location' => 'nullable|string|max:255',
            'project_date' => 'nullable|date',
            'duration' => 'nullable|string|max:100',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:100',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'project_url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $this->service->create($validated, $request);

        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio berhasil ditambahkan');
    }

    /**
     * Show the form for editing the specified portfolio.
     */
    public function edit($id)
    {
        $portfolio = $this->service->findById($id);

        if (!$portfolio) {
            abort(404);
        }

        return Inertia::render('admin/portfolio/edit', [
            'portfolio' => $portfolio,
            'services' => Services::active()->ordered()->get(['id', 'title']),
            'companies' => Company::active()->ordered()->get(['id', 'name']),
            'categories' => Categories::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified portfolio.
     */
    public function update(Request $request, $id)
    {
        $portfolio = $this->service->findById($id);

        if (!$portfolio) {
            abort(404);
        }

        $validated = $request->validate([
            'service_id'    => 'sometimes|required|exists:services,id',
            'companies_id'  => 'sometimes|required|exists:companies,id',
            'categories_id' => 'sometimes|required|exists:categories,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required',
            'short_description' => 'nullable|string|max:500',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'location' => 'nullable|string|max:255',
            'project_date' => 'nullable|date',
            'duration' => 'nullable|string|max:100',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:100',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'project_url' => 'nullable|url|max:255',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'nullable|integer|min:0',
        ]);

        $this->service->update($portfolio, $validated, $request);

        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio berhasil diperbarui');
    }

    /**
     * Remove the specified portfolio.
     */
    public function destroy($id)
    {
        $portfolio = $this->service->findById($id);

        if (!$portfolio) {
            abort(404);
        }

        $this->service->delete($portfolio);

        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio berhasil dihapus');
    }

    /**
     * Toggle portfolio status.
     */
    public function toggleStatus($id)
    {
        $portfolio = $this->service->findById($id);

        if (!$portfolio) {
            abort(404);
        }

        $this->service->toggleStatus($portfolio);

        return back()->with('success', 'Status portfolio berhasil diupdate');
    }

    /**
     * Toggle featured status.
     */
    public function toggleFeatured($id)
    {
        $portfolio = $this->service->findById($id);

        if (!$portfolio) {
            abort(404);
        }

        $this->service->toggleFeatured($portfolio);

        return back()->with('success', 'Featured status berhasil diupdate');
    }

    /**
     * Update portfolios order.
     */
    public function updateOrder(Request $request)
    {
        $request->validate([
            'portfolios' => 'required|array',
            'portfolios.*.id' => 'required|exists:portfolios,id',
            'portfolios.*.order' => 'required|integer',
        ]);

        $this->service->updateOrder($request->portfolios);

        return back()->with('success', 'Urutan portfolio berhasil diupdate');
    }

    /**
     * Bulk delete portfolios.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:portfolios,id',
        ]);

        $count = $this->service->bulkDelete($request->ids);

        return back()->with('success', "{$count} portfolio berhasil dihapus");
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:portfolios,id',
            'status' => 'required|boolean',
        ]);

        $count = $this->service->bulkUpdateStatus($request->ids, $request->status);

        $status = $request->status ? 'diaktifkan' : 'dinonaktifkan';

        return back()->with('success', "{$count} portfolio berhasil {$status}");
    }

    /**
     * Duplicate a portfolio.
     */
    public function duplicate($id)
    {
        $portfolio = $this->service->findById($id);

        if (!$portfolio) {
            abort(404);
        }

        $newPortfolio = $this->service->duplicatePortfolio($portfolio);

        return redirect()
            ->route('admin.portfolio.edit', $newPortfolio->id)
            ->with('success', 'Portfolio berhasil diduplikasi');
    }
}