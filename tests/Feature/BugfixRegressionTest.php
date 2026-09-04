<?php

use App\Enums\HelpdeskStatusEnum;
use App\Enums\RoleEnum;
use App\Enums\StatusSuratKeluarEnum;
use App\Enums\StatusUserEnum;
use App\Models\HelpdeskTicket;
use App\Models\SuratKeluar;
use App\Models\SuratMasuk;
use App\Models\Unit;
use App\Models\User;
use App\Services\HelpdeskService;
use App\Services\SuratKeluarService;
use Illuminate\Support\Facades\Hash;

function adminUser(): User
{
    return User::factory()->create([
        'role' => RoleEnum::SUPERADMIN,
        'status' => StatusUserEnum::ACTIVE,
    ]);
}

it('menampilkan daftar dan rincian surat keluar (relasi createdBy/approvedBy)', function () {
    $admin = adminUser();

    $surat = SuratKeluar::factory()->create([
        'unit_pembuat_id' => $admin->unit_id,
        'created_by' => $admin->id,
        'status' => StatusSuratKeluarEnum::DRAFT,
    ]);

    $this->actingAs($admin)->get('/surat-keluar')->assertSuccessful();
    $this->actingAs($admin)->get("/surat-keluar/{$surat->id}")->assertSuccessful();
});

it('policy surat keluar memakai isEditable/isApprovable', function () {
    $admin = adminUser();

    $draft = SuratKeluar::factory()->create([
        'unit_pembuat_id' => $admin->unit_id,
        'created_by' => $admin->id,
        'status' => StatusSuratKeluarEnum::DRAFT,
    ]);
    expect($draft->isEditable())->toBeTrue();
    expect($draft->isApprovable())->toBeFalse();

    $menunggu = SuratKeluar::factory()->create([
        'unit_pembuat_id' => $admin->unit_id,
        'created_by' => $admin->id,
        'status' => StatusSuratKeluarEnum::MENUNGGU_ACC,
    ]);
    expect($menunggu->isEditable())->toBeFalse();
    expect($menunggu->isApprovable())->toBeTrue();

    $this->assertTrue($admin->can('update', $draft));
    $this->assertTrue($admin->can('approve', $menunggu));
    $this->assertFalse($admin->can('approve', $draft));
});

it('service menolak approve/reject surat yang tidak menunggu ACC', function () {
    $admin = adminUser();
    $service = app(SuratKeluarService::class);

    $draft = SuratKeluar::factory()->create([
        'unit_pembuat_id' => $admin->unit_id,
        'created_by' => $admin->id,
        'status' => StatusSuratKeluarEnum::DRAFT,
    ]);

    expect(fn () => $service->approve($draft, $admin))->toThrow(RuntimeException::class);
    expect(fn () => $service->reject($draft, $admin, 'alasan'))->toThrow(RuntimeException::class);
});

it('ganti password profil berfungsi', function () {
    $admin = adminUser();

    $this->actingAs($admin)->put('/profile/password', [
        'current_password' => 'password',
        'password' => 'password-baru-123',
        'password_confirmation' => 'password-baru-123',
    ])->assertRedirect();

    expect(Hash::check('password-baru-123', $admin->fresh()->password))->toBeTrue();
});

it('disposisi bisa dibuat tanpa surat_masuk_id di body', function () {
    $admin = adminUser();
    $tujuan = User::factory()->create(['status' => StatusUserEnum::ACTIVE]);

    $surat = SuratMasuk::factory()->create([
        'unit_penerima_id' => $admin->unit_id,
        'created_by' => $admin->id,
    ]);

    $this->actingAs($admin)->post("/surat-masuk/{$surat->id}/disposisi", [
        'aksi' => 'di_disposisi',
        'kepada_user_id' => $tujuan->id,
        'isi' => 'Mohon ditindaklanjuti segera.',
    ])->assertRedirect();

    expect($surat->disposisis()->count())->toBe(1);
});

it('restore surat masuk terhapus memakai policy instance', function () {
    $admin = adminUser();

    $surat = SuratMasuk::factory()->create([
        'unit_penerima_id' => $admin->unit_id,
        'created_by' => $admin->id,
    ]);
    $surat->delete();

    $this->actingAs($admin)->post("/surat-masuk/{$surat->id}/restore")->assertRedirect();
    expect(SuratMasuk::find($surat->id))->not->toBeNull();
});

it('helpdesk menolak transisi status yang tidak valid', function () {
    $admin = adminUser();
    $service = app(HelpdeskService::class);
    $unit = Unit::factory()->create();

    $ticket = HelpdeskTicket::create([
        'kode_tiket' => '#0001',
        'nama_pelapor' => 'Pelapor',
        'unit_id' => $unit->id,
        'kategori' => 'hardware',
        'jenis_permintaan' => 'perbaikan',
        'deskripsi' => 'Komputer mati total.',
        'pelapor_id' => $admin->id,
        'status' => HelpdeskStatusEnum::BARU,
    ]);

    expect(fn () => $service->selesaikan($ticket, $admin, 'solusi'))->toThrow(RuntimeException::class);

    $service->proses($ticket->fresh(), $admin, 'dikerjakan');
    expect(fn () => $service->proses($ticket->fresh(), $admin))->toThrow(RuntimeException::class);
});

it('toggle tahun menyimpan session', function () {
    $admin = adminUser();

    $this->actingAs($admin)->post('/session/set-year', ['year' => 2024])->assertRedirect();
    expect(session('active_year'))->toBe(2024);
});

it('approve/reject user hanya untuk status pending', function () {
    $admin = adminUser();
    $aktif = User::factory()->create(['status' => StatusUserEnum::ACTIVE]);

    $this->actingAs($admin)->post("/admin/users/{$aktif->id}/approve", ['role' => 'staf'])->assertRedirect();
    expect($aktif->fresh()->status)->toBe(StatusUserEnum::ACTIVE);

    $this->actingAs($admin)->post("/admin/users/{$aktif->id}/reject")->assertRedirect();
    expect($aktif->fresh()->status)->toBe(StatusUserEnum::ACTIVE);
});

it('halaman lupa password bisa diakses guest', function () {
    $this->get('/forgot-password')->assertSuccessful();
    $this->get('/reset-password/token-contoh')->assertSuccessful();
});
