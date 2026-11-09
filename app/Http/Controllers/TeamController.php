<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/** Admin > Tim (bagan organisasi di beranda dan halaman /tim). */
class TeamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/team', [
            'members' => TeamMember::ordered()->get(),
            'levels'  => TeamMember::LEVELS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('team', 'public');
        }
        $data['order'] = $data['order'] ?? ((int) TeamMember::max('order') + 1);

        $this->guardSingleCeo($data['level'], null);
        TeamMember::create($data);

        return back()->with('success', 'Anggota tim ditambahkan.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $member = TeamMember::findOrFail($id);
        $data = $this->validated($request);

        if ($request->hasFile('photo')) {
            $this->deletePhoto($member);
            $data['photo'] = $request->file('photo')->store('team', 'public');
        } elseif ($request->boolean('remove_photo')) {
            $this->deletePhoto($member);
            $data['photo'] = null;
        }

        $this->guardSingleCeo($data['level'], $member->id);
        $member->update($data);

        return back()->with('success', 'Anggota tim diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $member = TeamMember::findOrFail($id);
        $this->deletePhoto($member);
        $member->delete();

        return back()->with('success', 'Anggota tim dihapus.');
    }

    private function validated(Request $request): array
    {
        $data = $request->validate([
            'name'      => 'required|string|max:120',
            'role'      => 'required|string|max:120',
            'sub_role'  => 'nullable|string|max:120',
            'level'     => 'required|in:ceo,management,staff',
            'order'     => 'nullable|integer|min:0|max:9999',
            'is_active' => 'boolean',
            'photo'     => 'nullable|image|mimes:jpeg,jpg,png,webp|max:2048',
        ]);

        unset($data['photo']);
        $data['is_active'] = $request->boolean('is_active', true);

        return $data;
    }

    /** Bagan hanya punya satu kotak pimpinan; CEO lama diturunkan jadi manajemen. */
    private function guardSingleCeo(string $level, ?int $exceptId): void
    {
        if ($level !== 'ceo') {
            return;
        }
        TeamMember::where('level', 'ceo')
            ->when($exceptId, fn ($q) => $q->where('id', '!=', $exceptId))
            ->update(['level' => 'management']);
    }

    private function deletePhoto(TeamMember $member): void
    {
        // Foto bawaan (public/asset) tidak dihapus.
        if ($member->photo && !str_starts_with($member->photo, 'asset/')) {
            Storage::disk('public')->delete($member->photo);
        }
    }
}
