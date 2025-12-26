<?php

namespace App\Http\Controllers;

use App\Service\CompanyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function __construct(
        protected CompanyService $companyService
    ) {}

    // ============================================
    // PUBLIC METHODS - Untuk User
    // ============================================

    /**
     * Get companies data for homepage
     */
    public function getCompaniesForHome()
    {
        $companies = $this->companyService->getCompaniesForHome(12);
        
        return $companies->map(function($company) {
            return [
                'id' => $company->id,
                'name' => $company->name,
                'slug' => $company->slug,
                'logo' => $company->logo,
                'website' => $company->website,
            ];
        });
    }

    // ============================================
    // ADMIN METHODS - Protected by middleware role:admin
    // ============================================

    /**
     * Display a listing of companies for admin.
     */
    public function adminIndex(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $status = $request->input('status');
        
        $companies = $this->companyService->getAdminPaginated($perPage, $search, $status);
        
        return Inertia::render('Admin/Company/Index', [
            'companies' => $companies,
            'filters' => $request->only(['search', 'per_page', 'status']),
            'statistics' => $this->companyService->getAdminStatistics(),
        ]);
    }

    /**
     * Show the form for creating a new company.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Company/Create');
    }

    /**
     * Store a newly created company.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,svg,webp|max:1024',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ]);
        
        $this->companyService->createCompany($validated, $request);
        
        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Company created successfully.');
    }

    /**
     * Display the specified company for admin.
     */
    public function adminShow($id): Response
    {
        $company = $this->companyService->findById($id);
        
        if (!$company) {
            abort(404);
        }
        
        return Inertia::render('Admin/Company/Show', [
            'company' => $company,
        ]);
    }

    /**
     * Show the form for editing the specified company.
     */
    public function edit($id): Response
    {
        $company = $this->companyService->findById($id);
        
        if (!$company) {
            abort(404);
        }
        
        return Inertia::render('Admin/Company/Edit', [
            'company' => $company,
        ]);
    }

    /**
     * Update the specified company.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,jpg,png,svg,webp|max:1024',
            'website' => 'nullable|url|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ]);
        
        $company = $this->companyService->findById($id);
        
        if (!$company) {
            abort(404);
        }
        
        $this->companyService->updateCompany($company, $validated, $request);
        
        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Company updated successfully.');
    }

    /**
     * Remove the specified company.
     */
    public function destroy($id): RedirectResponse
    {
        $company = $this->companyService->findById($id);
        
        if (!$company) {
            abort(404);
        }
        
        $this->companyService->deleteCompany($company);
        
        return redirect()
            ->route('admin.companies.index')
            ->with('success', 'Company deleted successfully.');
    }

    /**
     * Toggle company status.
     */
    public function toggleStatus($id): RedirectResponse
    {
        $company = $this->companyService->findById($id);
        
        if (!$company) {
            abort(404);
        }
        
        $this->companyService->toggleStatus($company);
        
        return back()->with('success', 'Company status updated successfully.');
    }

    /**
     * Bulk delete companies.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:companies,id',
        ]);
        
        $count = $this->companyService->bulkDelete($request->ids);
        
        return back()->with('success', "{$count} companies deleted successfully.");
    }

    /**
     * Bulk update status.
     */
    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:companies,id',
            'status' => 'required|boolean',
        ]);
        
        $count = $this->companyService->bulkUpdateStatus($request->ids, $request->status);
        
        $status = $request->status ? 'activated' : 'deactivated';
        
        return back()->with('success', "{$count} companies {$status} successfully.");
    }
}