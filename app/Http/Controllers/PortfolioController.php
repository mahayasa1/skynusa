<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use App\Models\Services;
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

    public function create()
    {
        return Inertia::render('Admin/Portfolio/Create', [
            'services' => Services::active()->ordered()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_id'    => 'required|exists:services,id',
            'companies_id'  => 'required|exists:companies,id',
            'categories_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required',
            'short_description' => 'nullable',
            'image' => 'nullable|image',
            'gallery.*' => 'image',
            'location' => 'nullable|string',
            'project_date' => 'nullable|date',
            'duration' => 'nullable|string',
            'technologies' => 'nullable|array',
            'features' => 'nullable|array',
            'project_url' => 'nullable|url',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'integer',
        ]);

        $this->service->create($validated, $request);

        return redirect()->route('admin.portfolio.index')
            ->with('success', 'Portfolio berhasil ditambahkan');
    }

    public function edit(Portfolio $portfolio)
    {
        return Inertia::render('Admin/Portfolio/Edit', [
            'portfolio' => $portfolio,
            'services' => Services::active()->ordered()->get(),
        ]);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required',
            'short_description' => 'nullable',
            'image' => 'nullable|image',
            'gallery.*' => 'image',
            'location' => 'nullable|string',
            'project_date' => 'nullable|date',
            'duration' => 'nullable|string',
            'technologies' => 'nullable|array',
            'features' => 'nullable|array',
            'project_url' => 'nullable|url',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
            'order' => 'integer',
        ]);

        $this->service->update($portfolio, $validated, $request);

        return redirect()->back()
            ->with('success', 'Portfolio berhasil diperbarui');
    }

    public function destroy(Portfolio $portfolio)
    {
        $this->service->delete($portfolio);

        return redirect()->back()
            ->with('success', 'Portfolio berhasil dihapus');
    }
}
