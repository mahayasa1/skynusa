<?php

namespace App\Http\Controllers;

use App\Models\Berita;
use App\Service\BeritaService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BeritaController extends Controller
{
    public function __construct(
        protected BeritaService $service
    ) {}

    /* ==========================
        PUBLIC ROUTES
    =========================== */

    /**
     * Display list of published beritas
     */
    public function index(): Response
    {
        $beritas = $this->service->getPaginatedPublished(12);
        $featured = $this->service->getFeatured(3);
        $categories = Berita::getCategories();

        return Inertia::render('berita', [
            'beritas' => $beritas,
            'featured' => $featured,
            'categories' => $categories,
        ]);
    }

    /**
     * Display berita detail
     */
    public function show(string $slug): Response
    {
        $berita = $this->service->getBySlug($slug);
        
        if (!$berita) {
            abort(404);
        }

        $related = $this->service->getRelated($berita, 3);
        $popular = $this->service->getPopular(5);

        return Inertia::render('berita-show', [
            'berita' => $berita,
            'related' => $related,
            'popular' => $popular,
        ]);
    }

    /**
     * Display beritas by category
     */
    public function category(string $category): Response
    {
        $beritas = $this->service->getByCategory($category, 12);
        $categories = Berita::getCategories();

        return Inertia::render('berita', [
            'beritas' => $beritas,
            'categories' => $categories,
            'currentCategory' => $category,
        ]);
    }

    /* ==========================
        ADMIN ROUTES
    =========================== */

    /**
     * Display list of beritas for admin
     */
    public function adminIndex(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $status = $request->input('status');
        $category = $request->input('category');

        $beritas = $this->service->getAdminPaginated($perPage, $search, $status, $category);
        $categories = Berita::getCategories();

        return Inertia::render('admin/berita/index', [
            'beritas' => $beritas,
            'categories' => $categories,
            'filters' => $request->only(['search', 'per_page', 'status', 'category']),
            'statistics' => $this->service->getStatistics(),
        ]);
    }

    /**
     * Show the form for creating a new berita
     */
    public function create(): Response
    {
        $categories = Berita::getCategories();

        return Inertia::render('admin/berita/create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created berita
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'featured_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
        ]);

        $validated['user_id'] = auth()->id();

        $this->service->create($validated, $request);

        return redirect()
            ->route('admin.berita.index')
            ->with('success', 'Berita berhasil ditambahkan');
    }

    /**
     * Display the specified berita for admin
     */
    public function adminShow($id): Response
    {
        $berita = $this->service->findById($id);

        if (!$berita) {
            abort(404);
        }

        return Inertia::render('admin/berita/show', [
            'berita' => $berita,
        ]);
    }

    /**
     * Show the form for editing the specified berita
     */
    public function edit($id): Response
    {
        $berita = $this->service->findById($id);

        if (!$berita) {
            abort(404);
        }

        $categories = Berita::getCategories();

        return Inertia::render('admin/berita/edit', [
            'berita' => $berita,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified berita
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $berita = $this->service->findById($id);

        if (!$berita) {
            abort(404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'sometimes|required|string',
            'featured_image' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'gallery.*' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
            'category' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'is_published' => 'boolean',
            'is_featured' => 'boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:500',
            'order' => 'nullable|integer|min:0',
        ]);

        $this->service->update($berita, $validated, $request);

        return redirect()
            ->route('admin.berita.index')
            ->with('success', 'Berita berhasil diperbarui');
    }

    /**
     * Remove the specified berita
     */
    public function destroy($id): RedirectResponse
    {
        $berita = $this->service->findById($id);

        if (!$berita) {
            abort(404);
        }

        $this->service->delete($berita);

        return redirect()
            ->route('admin.berita.index')
            ->with('success', 'Berita berhasil dihapus');
    }

    /**
     * Toggle publish status
     */
    public function togglePublish($id): RedirectResponse
    {
        $berita = $this->service->findById($id);

        if (!$berita) {
            abort(404);
        }

        $this->service->togglePublish($berita);

        return back()->with('success', 'Status publikasi berhasil diupdate');
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured($id): RedirectResponse
    {
        $berita = $this->service->findById($id);

        if (!$berita) {
            abort(404);
        }

        $this->service->toggleFeatured($berita);

        return back()->with('success', 'Status featured berhasil diupdate');
    }

    /**
     * Bulk delete beritas
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:beritas,id',
        ]);

        $count = $this->service->bulkDelete($request->ids);

        return back()->with('success', "{$count} berita berhasil dihapus");
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:beritas,id',
            'status' => 'required|boolean',
        ]);

        $count = $this->service->bulkUpdateStatus($request->ids, $request->status);

        $status = $request->status ? 'dipublikasikan' : 'disembunyikan';

        return back()->with('success', "{$count} berita berhasil {$status}");
    }
}