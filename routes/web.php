<?php

use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\HelpdeskController;
use App\Http\Controllers\NotifikasiController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RekapController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\SuratKeluarController;
use App\Http\Controllers\SuratMasukController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('login'));

Route::middleware('guest')->group(function (): void {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

Route::middleware(['auth', 'active'])->group(function (): void {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('session/set-year', [SessionController::class, 'setYear'])->name('session.set-year');

    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');

    // Surat Masuk
    Route::resource('surat-masuk', SuratMasukController::class);
    Route::get('surat-masuk/{suratMasuk}/cetak-disposisi', [SuratMasukController::class, 'cetakDisposisi'])->name('surat-masuk.cetak-disposisi');
    Route::get('surat-masuk/{suratMasuk}/download', [SuratMasukController::class, 'download'])->name('surat-masuk.download');
    Route::post('surat-masuk/{id}/restore', [SuratMasukController::class, 'restore'])->name('surat-masuk.restore');

    // Disposisi
    Route::resource('disposisi', DisposisiController::class)->only(['index', 'show']);
    Route::post('surat-masuk/{suratMasuk}/disposisi', [DisposisiController::class, 'store'])->name('disposisi.store');

    // Surat Keluar
    Route::resource('surat-keluar', SuratKeluarController::class);
    Route::post('surat-keluar/{suratKeluar}/submit', [SuratKeluarController::class, 'submitForApproval'])->name('surat-keluar.submit');
    Route::post('surat-keluar/{suratKeluar}/approve', [SuratKeluarController::class, 'approve'])->name('surat-keluar.approve');
    Route::post('surat-keluar/{suratKeluar}/reject', [SuratKeluarController::class, 'reject'])->name('surat-keluar.reject');
    Route::get('surat-keluar/{suratKeluar}/cetak', [SuratKeluarController::class, 'cetak'])->name('surat-keluar.cetak');
    Route::post('surat-keluar/preview-nomor', [SuratKeluarController::class, 'previewNomor'])->name('surat-keluar.preview-nomor');

    // Rekap
    Route::get('/rekap', [RekapController::class, 'index'])->name('rekap.index');
    Route::get('/rekap/surat-masuk', [RekapController::class, 'suratMasuk'])->name('rekap.surat-masuk');
    Route::get('/rekap/surat-keluar', [RekapController::class, 'suratKeluar'])->name('rekap.surat-keluar');
    Route::get('/rekap/surat-masuk/export', [RekapController::class, 'exportSuratMasuk'])->name('rekap.surat-masuk.export');
    Route::get('/rekap/surat-keluar/export', [RekapController::class, 'exportSuratKeluar'])->name('rekap.surat-keluar.export');

    // IT Helpdesk
    Route::resource('helpdesk', HelpdeskController::class)->except(['edit', 'update']);
    Route::post('helpdesk/{helpdesk}/proses', [HelpdeskController::class, 'proses'])->name('helpdesk.proses');
    Route::post('helpdesk/{helpdesk}/selesaikan', [HelpdeskController::class, 'selesaikan'])->name('helpdesk.selesaikan');
    Route::post('helpdesk/{helpdesk}/tutup', [HelpdeskController::class, 'tutup'])->name('helpdesk.tutup');
    Route::get('helpdesk/{helpdesk}/lampiran/{index}', [HelpdeskController::class, 'downloadLampiran'])->name('helpdesk.lampiran');

    // Notifikasi
    Route::get('/notifications', [NotifikasiController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{id}/read', [NotifikasiController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotifikasiController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::get('/api/notifications/unread', [NotifikasiController::class, 'unreadCount'])->name('api.notifications.unread');

    // Admin (superadmin only)
    Route::prefix('admin')->name('admin.')->middleware('role:superadmin')->group(function (): void {
        Route::resource('users', UserController::class);
        Route::get('users-pending', [UserController::class, 'pending'])->name('users.pending');
        Route::post('users/{user}/approve', [UserController::class, 'approve'])->name('users.approve');
        Route::post('users/{user}/reject', [UserController::class, 'reject'])->name('users.reject');

        Route::resource('units', UnitController::class);
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    });
});
