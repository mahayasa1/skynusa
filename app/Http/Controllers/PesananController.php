<?php

namespace App\Http\Controllers;

use App\Models\Pesanan;
use App\Models\Services;
use App\Service\PesananService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Mail\OrderCreatedMail;
use App\Mail\OrderStatusChangedMail;
use Illuminate\Support\Facades\Mail;

class PesananController extends Controller
{
    public function __construct(
        protected PesananService $pesananService
    ) {}

    // ============================================
    // PUBLIC METHODS - Untuk User
    // ============================================

    /**
     * Display order form page
     */
    public function create(): Response
    {
        $services = Services::active()->ordered()->get(['id', 'title', 'slug']);

        return Inertia::render('pesanan/order', [
            'services' => $services,
        ]);
    }

    /**
     * Store new order
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:services,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telp' => 'required|string|max:20',
            'description' => 'required|string|max:5000',
            'due_date' => 'required|date|after:today',
        ], [
            'service_id.required' => 'Pilih layanan yang diinginkan',
            'name.required' => 'Nama wajib diisi',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'telp.required' => 'Nomor telepon wajib diisi',
            'description.required' => 'Deskripsi pesanan wajib diisi',
            'due_date.required' => 'Tanggal target selesai wajib diisi',
            'due_date.after' => 'Tanggal target harus setelah hari ini',
        ]);

        DB::beginTransaction();

        try {
            // Create order
            $pesanan = $this->pesananService->createOrder($validated);

            // Load service relationship untuk email
            $pesanan->load('service');

            // Send email to customer
            try {
                Mail::to($pesanan->email)->send(new OrderCreatedMail($pesanan));

                Log::info('Order email sent successfully', [
                    'order_code' => $pesanan->code,
                    'email' => $pesanan->email
                ]);

                $emailSent = true;
            } catch (\Exception $e) {
                Log::error('Failed to send order email', [
                    'order_code' => $pesanan->code,
                    'email' => $pesanan->email,
                    'error' => $e->getMessage()
                ]);

                $emailSent = false;
            }

            DB::commit();

            // Success message
            $successMessage = 'Pesanan berhasil dibuat!';

            if ($emailSent) {
                $successMessage .= ' Kode tracking telah dikirim ke email Anda.';
            } else {
                $successMessage .= ' Namun email notifikasi gagal dikirim. Silakan simpan kode tracking di bawah ini.';
            }

            return back()->with([
                'success' => $successMessage,
                'tracking_code' => $pesanan->code,
                'email_sent' => $emailSent,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Order creation failed', [
                'email' => $validated['email'] ?? 'unknown',
                'error' => $e->getMessage()
            ]);

            return back()
                ->withErrors(['error' => 'Terjadi kesalahan saat membuat pesanan. Silakan coba lagi.'])
                ->withInput();
        }
    }

    /**
     * Display tracking page
     */
    public function trackingForm(): Response
    {
        return Inertia::render('pesanan/tracking');
    }

    /**
     * Track order by code
     */
    public function track(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
        ], [
            'code.required' => 'Kode pesanan wajib diisi',
        ]);
    
        $pesanan = $this->pesananService->findByCode($request->code);
    
        if (!$pesanan) {
            return back()->withErrors([
                'code' => 'Kode pesanan tidak ditemukan. Pastikan kode yang Anda masukkan benar.'
            ]);
        }
    
        // Render ulang halaman tracking dengan data pesanan
        return Inertia::render('pesanan/tracking', [
            'pesanan' => [
                'id' => $pesanan->id,
                'code' => $pesanan->code,
                'name' => $pesanan->name,
                'email' => $pesanan->email,
                'telp' => $pesanan->telp,
                'description' => $pesanan->description,
                'due_date' => $pesanan->due_date->format('Y-m-d'),
                'status' => $pesanan->status,
                'created_at' => $pesanan->created_at->format('d M Y H:i'),
                'service' => [
                    'id' => $pesanan->service->id,
                    'title' => $pesanan->service->title,
                ],
            ],
            'statuses' => Pesanan::getStatuses(),
        ]);
    }

    // ============================================
    // ADMIN METHODS - Protected by middleware
    // ============================================

    /**
     * Display list of orders for admin
     */
    public function adminIndex(Request $request): Response
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $status = $request->input('status');
        $serviceId = $request->input('service_id');

        $orders = $this->pesananService->getAdminPaginated($perPage, $search, $status, $serviceId);
        $services = Services::active()->ordered()->get(['id', 'title']);

        return Inertia::render('Admin/Pesanan/Index', [
            'orders' => $orders,
            'services' => $services,
            'filters' => $request->only(['search', 'per_page', 'status', 'service_id']),
            'statistics' => $this->pesananService->getStatistics(),
            'statuses' => Pesanan::getStatuses(),
        ]);
    }

    /**
     * Display order detail
     */
    public function show($id): Response
    {
        $pesanan = $this->pesananService->findById($id);

        if (!$pesanan) {
            abort(404);
        }

        return Inertia::render('Admin/Pesanan/Show', [
            'pesanan' => $pesanan,
            'statuses' => Pesanan::getStatuses(),
            'nextStatusOptions' => $this->pesananService->getNextStatusOptions($pesanan->status),
        ]);
    }

    /**
     * Show edit form
     */
    public function edit($id): Response
    {
        $pesanan = $this->pesananService->findById($id);

        if (!$pesanan) {
            abort(404);
        }

        $services = Services::active()->ordered()->get(['id', 'title']);

        return Inertia::render('Admin/Pesanan/Edit', [
            'pesanan' => $pesanan,
            'services' => $services,
            'statuses' => Pesanan::getStatuses(),
        ]);
    }

    /**
     * Update order
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => 'sometimes|required|exists:services,id',
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'telp' => 'sometimes|required|string|max:20',
            'description' => 'sometimes|required|string|max:5000',
            'due_date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:pending,verifikasi,proses,approval,running,selesai',
        ]);

        $pesanan = $this->pesananService->findById($id);

        if (!$pesanan) {
            abort(404);
        }

        $this->pesananService->updateOrder($pesanan, $validated);

        return redirect()
            ->route('admin.pesanan.index')
            ->with('success', 'Order updated successfully.');
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,verifikasi,proses,approval,running,selesai',
        ]);

        $pesanan = $this->pesananService->findById($id);

        if (!$pesanan) {
            abort(404);
        }

        $this->pesananService->updateStatus($pesanan, $request->status);

        return back()->with('success', 'Order status updated successfully.');
    }

    /**
     * Delete order
     */
    public function destroy($id): RedirectResponse
    {
        $pesanan = $this->pesananService->findById($id);

        if (!$pesanan) {
            abort(404);
        }

        $this->pesananService->deleteOrder($pesanan);

        return redirect()
            ->route('admin.pesanan.index')
            ->with('success', 'Order deleted successfully.');
    }

    /**
     * Bulk delete
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:pesanans,id',
        ]);

        $count = $this->pesananService->bulkDelete($request->ids);

        return back()->with('success', "{$count} orders deleted successfully.");
    }

    /**
     * Bulk update status
     */
    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:pesanans,id',
            'status' => 'required|in:pending,verifikasi,proses,approval,running,selesai',
        ]);

        $count = $this->pesananService->bulkUpdateStatus($request->ids, $request->status);

        return back()->with('success', "{$count} orders status updated successfully.");
    }
}