# Implementation Plan (IMPLEMENTATION_PLAN)

## SIM SURAT RSGM UNIMUS

**Versi:** 1.0
**Tanggal:** 2026-08-27
**Referensi:** PRD.md, APP_FLOW.md, TECH_STACK.md, FRONTEND_GUIDELINES.md, BACKEND_STRUCTURE.md

---

## 1. Pendekatan

**Metodologi:** Incremental delivery dengan milestone yang bisa divalidasi per fase.
**Prinsip:** Bikin yang bisa dipakai dulu (working software), polish belakangan.
**Test strategy:** TDD untuk services (critical), integration test untuk flows, manual untuk UI.

**Fase:**

- **Fase 0:** Setup & Fondasi (3 hari)
- **Fase 1:** MVP — Modul Surat (10 hari)
- **Fase 2:** MVP — Modul Permintaan Pelayanan (5 hari)
- **Fase 3:** Polish, Hardening, Deploy (3 hari)
- **Total MVP:** ~21 hari kerja (4 minggu)

**Fase 2 (post-MVP):** Modul Pengadaan, Dashboard analitik, Multi-tahun toggle, optimasi.

---

## 2. Backlog & Dependencies

### 2.1 Dependency Graph

```
Fase 0 (Setup)
  ├── Init Laravel + Inertia + shadcn/ui
  ├── DB design + migrations
  ├── Models + Enums + Seeders (units, users, indeks)
  ├── Auth scaffolding
  └── AppLayout + Header + Sidebar

Fase 1 (Surat)
  ├── SuratMasukService + Controller + Form + Pages
  ├── DisposisiService + Controller + Form + Pages
  ├── SuratKeluarService + Controller + Form + Pages (incl. approval flow)
  ├── PDF Generator (Lembar Disposisi + Surat Keluar)
  ├── Rekap + Export Excel/PDF
  └── Notifikasi in-app (bell + center)

Fase 2 (Pelayanan)
  ├── PelayananService + Controller + Form + Pages
  ├── PelayananProgress flow
  └── Tiptap rich text editor

Fase 3 (Polish)
  ├── Notifikasi real-time polling
  ├── Audit log UI
  ├── Performance optimization
  ├── Security hardening
  └── Deployment + Documentation
```

---

## 3. Fase 0: Setup & Fondasi (3 hari)

### 3.1 Hari 1: Project Init

#### Task 0.1.1: Inisialisasi project Laravel 12

- **Estimasi:** 2 jam
- **Steps:**
    1. `composer create-project laravel/laravel project-kp` (jika belum ada) — sudah ada.
    2. `composer require inertiajs/inertia-laravel`
    3. `composer require laravel/sanctum` (untuk session API).
    4. `npm install @inertiajs/react react react-dom` (atau via Bun).
    5. Setup `vite.config.ts` untuk React.
    6. Setup `resources/js/app.tsx` sebagai entry point Inertia.
- **Acceptance:** Project bisa diakses, halaman welcome render via Inertia.

#### Task 0.1.2: Install shadcn/ui

- **Estimasi:** 1 jam
- **Steps:**
    1. `npx shadcn@latest init` (atau via Bun: `bunx shadcn@latest init`).
    2. Pilih style: "Default".
    3. Pilih base color: "Slate" (akan di-override).
    4. Konfirmasi `components.json` ada.
- **Acceptance:** shadcn/ui siap dipakai, Tailwind config terupdate.

#### Task 0.1.3: Konfigurasi Tailwind dengan design tokens

- **Estimasi:** 1 jam
- **Steps:**
    1. Update `tailwind.config.ts` sesuai FRONTEND_GUIDELINES.md §4.
    2. Setup color palette (primary biru RSGM, success, destructive, dll).
    3. Setup font Inter.
- **Acceptance:** Class seperti `bg-primary`, `text-success` bisa dipakai.

#### Task 0.1.4: Install Wayfinder

- **Estimasi:** 30 menit
- **Steps:**
    1. `composer require laravel/wayfinder` (sesuai AGENTS.md).
    2. `php artisan wayfinder:generate` (atau auto via npm script).
    3. Setup tsconfig path untuk `@/actions`, `@/routes`.
- **Acceptance:** Bisa import route functions dari `@/actions/`.

#### Task 0.1.5: Install packages tambahan

- **Estimasi:** 30 menit
- **Steps:**
    1. `composer require barryvdh/laravel-dompdf maatwebsite/excel`
    2. `npm install @tiptap/react @tiptap/starter-kit sonner date-fns lucide-react dompurify`
    3. Publish config PDF: `php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"`
- **Acceptance:** Semua package terinstall dan callable.

### 3.2 Hari 2: Database & Models

#### Task 0.2.1: Migrations untuk master data

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:migration create_units_table`
    2. `php artisan make:migration create_kode_surats_table`
    3. `php artisan make:migration create_indeks_table`
    4. Tulis schema sesuai TECH_STACK.md §2.5.
    5. `php artisan migrate`
- **Acceptance:** Tabel `units`, `kode_surats`, `indeks` ada di DB.

#### Task 0.2.2: Migrations untuk users update

- **Estimasi:** 1 jam
- **Steps:**
    1. `php artisan make:migration add_role_and_status_to_users_table`
    2. Tambah kolom `role` (ENUM), `status` (ENUM), `unit_id` (FK), `username` (unique, drop if exists).
    3. Update `users` migration original.
- **Acceptance:** Tabel `users` punya kolom role, status, unit_id, username.

#### Task 0.2.3: Models + Enums

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:enum RoleEnum` + tulis isi.
    2. `php artisan make:enum StatusUserEnum`.
    3. Update `User` model (fillable, casts, relations).
    4. `php artisan make:model Unit -mf` + tulis.
    5. `php artisan make:model KodeSurat -mf` + tulis.
    6. `php artisan make:model Indeks -mf` + tulis.
- **Acceptance:** Models + Enums bisa dipakai, factories generate dummy data.

#### Task 0.2.4: Seeders

- **Estimasi:** 1 jam
- **Steps:**
    1. `php artisan make:seeder UnitSeeder` + tulis (12 unit RSGM).
    2. `php artisan make:seeder KodeSuratSeeder` + tulis.
    3. `php artisan make:seeder IndeksSeeder` + tulis.
    4. `php artisan make:seeder UserSeeder` + tulis (default superadmin).
    5. Update `DatabaseSeeder` untuk panggil semua.
    6. `php artisan migrate:fresh --seed`.
- **Acceptance:** DB terisi master data + 1 superadmin.

### 3.3 Hari 3: Auth & Layout

#### Task 0.3.1: Auth scaffolding

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:controller Auth/AuthenticatedSessionController`
    2. `php artisan make:controller Auth/RegisteredUserController`
    3. `php artisan make:request Auth/LoginRequest`
    4. `php artisan make:request Auth/RegisterRequest`
    5. Tulis logic (Laravel Breeze-like pattern, tapi custom untuk username).
    6. Setup routes di `routes/web.php` (group `guest` & `auth`).
- **Acceptance:** Bisa register & login, session aktif, redirect ke dashboard.

#### Task 0.3.2: Middleware custom

- **Estimasi:** 1 jam
- **Steps:**
    1. `php artisan make:middleware EnsureUserActive`
    2. `php artisan make:middleware CheckRole`
    3. `php artisan make:middleware SetActiveYear`
    4. Register di `bootstrap/app.php`.
- **Acceptance:** User non-active ditolak, role check bekerja, tahun default di-set.

#### Task 0.3.3: AppLayout, Header, Sidebar

- **Estimasi:** 4 jam
- **Steps:**
    1. Install shadcn components: `button`, `card`, `avatar`, `dropdown-menu`, `separator`, `sheet` (mobile).
    2. Buat `components/common/AppLayout.tsx`.
    3. Buat `components/common/Header.tsx` (logo, notif bell, user dropdown, year toggle).
    4. Buat `components/common/Sidebar.tsx` (menu navigasi, collapsible).
    5. Buat `components/common/NotificationBell.tsx` (placeholder, akan diisi Fase 1).
    6. Buat `components/common/YearToggle.tsx` (dropdown tahun + post ke `/session/set-year`).
    7. Setup SessionController untuk handle year toggle.
- **Acceptance:** Layout responsive, navigasi berfungsi, year toggle persist di session.

#### Task 0.3.4: Dashboard page placeholder

- **Estimasi:** 1 jam
- **Steps:**
    1. `php artisan make:controller DashboardController`
    2. `php artisan make:request ...` (tidak perlu)
    3. Buat page `resources/js/pages/Dashboard.tsx` (placeholder dengan sapaan user).
    4. Tulis route `GET /dashboard`.
- **Acceptance:** User login → redirect ke `/dashboard` → tampil "Selamat datang, [name]".

#### Task 0.3.5: Profile page (basic)

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:controller ProfileController`
    2. `php artisan make:request ProfileUpdateRequest`
    3. Tulis `edit()`, `update()`, `updatePassword()`.
    4. Buat page `Profile.tsx` dengan form edit nama, email, password.
- **Acceptance:** User bisa edit profil & ganti password sendiri.

#### Task 0.3.6: Initial test setup

- **Estimasi:** 1 jam
- **Steps:**
    1. Install Pest (sesuai AGENTS.md, sudah ada).
    2. Update `tests/Pest.php` dengan `RefreshDatabase` trait.
    3. Tulis feature test untuk register & login.
- **Acceptance:** `php artisan test --compact` pass.

---

## 4. Fase 1: MVP — Modul Surat (10 hari)

### 4.1 Hari 4-5: Surat Masuk (CRUD)

#### Task 1.1.1: Migration + Model SuratMasuk

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:migration create_surat_masuks_table` + tulis.
    2. `php artisan make:model SuratMasuk -mf` + tulis relasi.
    3. `php artisan make:enum StatusSuratMasukEnum`.
    4. `php artisan make:factory SuratMasukFactory`.
    5. `php artisan migrate`.
- **Acceptance:** Tabel ada, factory generate dummy, model bisa query.

#### Task 1.1.2: SuratMasukService + Form Requests

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:request SuratMasukStoreRequest` + rules.
    2. `php artisan make:request SuratMasukUpdateRequest`.
    3. `php artisan make:service SuratMasukService` + create/update/delete logic.
    4. Tulis `SuratMasukPolicy` (view, create, update, delete).
- **Acceptance:** Service bisa create surat dengan file upload, validasi berjalan.

#### Task 1.1.3: SuratMasukController (resource)

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:controller SuratMasukController --resource`.
    2. Tulis `index`, `create`, `store`, `show`, `edit`, `update`, `destroy`.
    3. Inject `SuratMasukService`.
- **Acceptance:** Semua route resource berfungsi, return Inertia response.

#### Task 1.1.4: Audit Log Observer

- **Estimasi:** 1 jam
- **Steps:**
    1. `php artisan make:observer SuratMasukObserver`.
    2. Tulis `created`, `updated`, `deleted`.
    3. Register di `AppServiceProvider::boot()`.
- **Acceptance:** Setiap create/update/delete catat ke `audit_logs`.

#### Task 1.1.5: Frontend — Index page

- **Estimasi:** 4 jam
- **Steps:**
    1. Install shadcn: `table`, `pagination`, `badge`, `input`, `select`.
    2. Buat `resources/js/types/surat.ts` (interface `SuratMasuk`, `SuratMasukFormData`).
    3. Buat `resources/js/components/common/DataTable.tsx` (reusable).
    4. Buat `resources/js/components/common/StatusBadge.tsx`.
    5. Buat `resources/js/components/common/EmptyState.tsx`.
    6. Buat `resources/js/pages/SuratMasuk/Index.tsx`.
- **Acceptance:** Tabel tampil, pagination, search, filter unit (untuk non-superadmin) berjalan.

#### Task 1.1.6: Frontend — Create + Edit form

- **Estimasi:** 4 jam
- **Steps:**
    1. Install shadcn: `form`, `label`, `textarea`, `popover`, `calendar` (datepicker).
    2. Buat `resources/js/components/common/DatePicker.tsx`.
    3. Buat `resources/js/components/common/FileUpload.tsx` (drag & drop, preview).
    4. Buat `resources/js/components/surat/SuratMasukForm.tsx` (reusable untuk create & edit).
    5. Buat `pages/SuratMasuk/Create.tsx` & `Edit.tsx`.
- **Acceptance:** Form submit, file upload, validasi client + server, error handling.

#### Task 1.1.7: Frontend — Show page (rincian)

- **Estimasi:** 2 jam
- **Steps:**
    1. Buat `pages/SuratMasuk/Show.tsx`.
    2. Tampilkan info surat + tombol download file.
    3. Placeholder untuk timeline disposisi (diisi Hari 7).
- **Acceptance:** User bisa lihat rincian & download file.

#### Task 1.1.8: Test untuk SuratMasuk

- **Estimasi:** 2 jam
- **Steps:**
    1. Feature test: create, update, delete, authorization, validasi.
    2. Unit test: SuratMasukService.
- **Acceptance:** Coverage > 70% untuk SuratMasuk flow.

---

### 4.2 Hari 6-7: Disposisi

#### Task 1.2.1: Migration + Model Disposisi

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:migration create_disposisis_table` + tulis.
    2. `php artisan make:model Disposisi -mf`.
    3. `php artisan make:enum AksiDisposisiEnum` + `StatusDisposisiEnum`.
- **Acceptance:** Tabel disposisi dengan parent_id (self-referencing FK).

#### Task 1.2.2: DisposisiService + Form Request

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:request DisposisiStoreRequest` + rules.
    2. `php artisan make:service DisposisiService` + create logic.
    3. `php artisan make:policy DisposisiPolicy`.
    4. Tulis logic: create disposisi + update status surat + kirim notifikasi.
- **Acceptance:** Disposisi tersimpan, status surat update, notif terkirim.

#### Task 1.2.3: DisposisiController

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:controller DisposisiController --resource`.
    2. Tulis `index` (semua disposisi terkait user), `show`, `store`.
    3. Register policy di controller.
- **Acceptance:** Route disposisi berfungsi, user hanya lihat miliknya.

#### Task 1.2.4: Notifikasi Laravel

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:notification DisposisiBaruNotification` + tulis.
    2. Set queue (database driver).
    3. Setup `php artisan queue:work` di dev.
- **Acceptance:** Notifikasi terkirim ke `notifications` table.

#### Task 1.2.5: Frontend — Disposisi timeline di Show page

- **Estimasi:** 3 jam
- **Steps:**
    1. Buat `resources/js/components/surat/DisposisiTimeline.tsx` (vertical timeline dengan icon).
    2. Update `pages/SuratMasuk/Show.tsx` untuk include timeline.
    3. Install `lucide-react` icons (Mail, Archive, Check, X).
- **Acceptance:** Timeline kronologis tampil di rincian surat.

#### Task 1.2.6: Frontend — Form disposisi

- **Estimasi:** 3 jam
- **Steps:**
    1. Buat `components/surat/DisposisiForm.tsx` (Select aksi, kepada user/unit, isi).
    2. Buat modal/dialog untuk form.
    3. Tambah tombol "Buat Disposisi" di SuratMasuk Index.
- **Acceptance:** User bisa buat disposisi dari daftar atau dari rincian.

#### Task 1.2.7: Notification Bell (placeholder)

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:controller NotifikasiController` + `index`, `markAsRead`, `markAllAsRead`.
    2. Update `Header.tsx` untuk query unread count.
    3. Tampilkan dropdown 10 notif terbaru.
- **Acceptance:** Bell menampilkan badge unread, klik notif → redirect & mark read.

#### Task 1.2.8: Test Disposisi

- **Estimasi:** 2 jam
- **Steps:**
    1. Feature test: create disposisi, multi-route, status update, notifikasi.
    2. Unit test: DisposisiService.
- **Acceptance:** Coverage > 70% untuk Disposisi.

---

### 4.3 Hari 8-9: Surat Keluar + Approval Flow

#### Task 1.3.1: Migration + Model SuratKeluar

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:migration create_surat_keluars_table` + tulis.
    2. `php artisan make:model SuratKeluar -mf`.
    3. `php artisan make:enum StatusSuratKeluarEnum`.
- **Acceptance:** Tabel dengan semua field termasuk `kode_turunan` (nullable), tanggal penugasan (nullable).

#### Task 1.3.2: NomorSuratGenerator Service

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:service NomorSuratGenerator` + tulis logic (sesuai BACKEND_STRUCTURE.md §6.1).
    2. Unit test: generate format benar dengan bulan romawi, urutan per tahun.
- **Acceptance:** Format `UNIMUS/IT/ST.KP/001/VIII/2026` ter-generate benar.

#### Task 1.3.3: SuratKeluarService

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:service SuratKeluarService` + create, update, submit, approve, reject.
    2. `php artisan make:request SuratKeluarStoreRequest` (dengan conditional rules untuk ST).
    3. `php artisan make:request SuratKeluarUpdateRequest`.
    4. `php artisan make:request SuratKeluarApprovalRequest`.
    5. `php artisan make:policy SuratKeluarPolicy`.
- **Acceptance:** CRUD + approval flow berfungsi, validasi kondisional untuk ST.

#### Task 1.3.4: SuratKeluarController

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:controller SuratKeluarController --resource`.
    2. Tambah custom: `submitForApproval`, `approve`, `reject`, `cetak`.
    3. Register routes dengan middleware `role:superadmin` untuk approve/reject.
- **Acceptance:** Semua route berfungsi, Rektor bisa ACC/tolak.

#### Task 1.3.5: Frontend — Surat Keluar pages

- **Estimasi:** 6 jam
- **Steps:**
    1. Buat `types/surat.ts` (interface `SuratKeluar`, `SuratKeluarFormData`).
    2. Buat `components/surat/SuratKeluarForm.tsx` (conditional fields untuk ST).
    3. Buat `pages/SuratKeluar/Index.tsx` (tabel + filter status).
    4. Buat `pages/SuratKeluar/Create.tsx` & `Edit.tsx`.
    5. Buat `pages/SuratKeluar/Show.tsx` (info + status badge + aksi sesuai role).
    6. Buat `pages/Approval/Index.tsx` (khusus superadmin: daftar menunggu ACC).
- **Acceptance:** User bisa create draft, submit, Rektor bisa ACC/tolak, history perubahan status.

#### Task 1.3.6: Auto-fill nomor surat

- **Estimasi:** 1 jam
- **Steps:**
    1. Di form SuratKeluar, auto-generate preview nomor saat user pilih unit + indeks.
    2. User bisa override.
- **Acceptance:** Preview nomor muncul otomatis, editable.

#### Task 1.3.7: Test SuratKeluar

- **Estimasi:** 2 jam
- **Steps:**
    1. Feature test: create, update, submit, approve, reject, authorization.
    2. Unit test: NomorSuratGenerator (bulan romawi, format).
- **Acceptance:** Coverage > 70%.

---

### 4.4 Hari 10-11: PDF Generator & Notifikasi Center

#### Task 1.4.1: PdfGeneratorService

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:service PdfGeneratorService`.
    2. Tulis `generateLembarDisposisi(SuratMasuk)` + `generateSuratKeluar(SuratKeluar)`.
    3. Buat Blade view: `resources/views/pdf/lembar-disposisi.blade.php` (kop RSGM, info surat, tabel disposisi).
    4. Buat Blade view: `resources/views/pdf/surat-keluar.blade.php` (kop, format surat resmi).
- **Acceptance:** PDF ter-generate dengan layout benar.

#### Task 1.4.2: Wire PDF ke controller

- **Estimasi:** 1 jam
- **Steps:**
    1. Tambah route `GET /surat-masuk/{id}/cetak-disposisi` → `SuratMasukController@cetakDisposisi`.
    2. Tambah route `GET /surat-keluar/{id}/cetak` → `SuratKeluarController@cetak`.
    3. Tambah tombol "Cetak Lembar Disposisi" & "Cetak PDF" di UI.
- **Acceptance:** User bisa download PDF, authorization check jalan.

#### Task 1.4.3: Notifikasi Center page

- **Estimasi:** 2 jam
- **Steps:**
    1. Buat `pages/Notifications.tsx` (list semua notif, filter, mark read).
    2. Update `NotificationBell.tsx` untuk handle pagination.
- **Acceptance:** User bisa lihat semua notif di `/notifications`.

#### Task 1.4.4: Notifikasi polling (real-time feel)

- **Estimasi:** 2 jam
- **Steps:**
    1. Buat hook `useNotificationPolling` (setiap 30s reload `unreadNotifications`).
    2. Integrate ke `NotificationBell.tsx`.
    3. (Opsional) Inertia v2 `WhenVisible` untuk efficient loading.
- **Acceptance:** Badge unread update otomatis tanpa refresh manual.

#### Task 1.4.5: Test PDF

- **Estimasi:** 1 jam
- **Steps:**
    1. Feature test: route cetak, authorization (hanya status `disetujui` untuk surat keluar).
- **Acceptance:** Test pass.

---

### 4.5 Hari 12-13: Rekap & Export

#### Task 1.5.1: RekapController

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:controller RekapController`.
    2. Tulis `index` (menu), `suratMasuk`, `suratKeluar`, `disposisi`.
    3. Tulis `export` (Excel + PDF) untuk masing-masing.
    4. Install `maatwebsite/excel` jika belum (Excel export).
- **Acceptance:** Filter + query + export berfungsi.

#### Task 1.5.2: Frontend — Rekap pages

- **Estimasi:** 4 jam
- **Steps:**
    1. Buat `pages/Rekap/Index.tsx` (menu 3 sub).
    2. Buat `pages/Rekap/SuratMasuk.tsx`, `SuratKeluar.tsx`, `Disposisi.tsx` (filter + tabel + tombol export).
    3. Tulis `components/surat/RekapFilter.tsx` (reusable filter component).
- **Acceptance:** User bisa filter & export ke Excel & PDF.

#### Task 1.5.3: Test Rekap

- **Estimasi:** 1 jam
- **Steps:**
    1. Feature test: filter, query, export.
- **Acceptance:** Test pass.

---

### 4.6 Hari 13 (sore): Soft Delete + Trash

#### Task 1.6.1: Soft delete + restore + auto-purge

- **Estimasi:** 3 jam
- **Steps:**
    1. Pastikan SuratMasuk & SuratKeluar pakai `SoftDeletes`.
    2. Tambah route `POST /surat-masuk/{id}/restore` (admin only).
    3. Tambah scheduled task di `routes/console.php` (auto-purge > 30 hari).
    4. Buat UI Trash page (opsional) atau tampilkan di index dengan filter.
- **Acceptance:** Soft delete + restore + scheduled purge berfungsi.

---

## 5. Fase 2: MVP — Modul IT Helpdesk / Lapor Kendala IT (5 hari)

> **Catatan:** Scope Pelayanan diubah dari multi-jenis menjadi **IT Helpdesk sederhana** sesuai screenshot user (2026-08-28). Form staf + dashboard tim IT dengan status Baru → Diproses → Selesai.

### 5.1 Hari 14: Setup Helpdesk

#### Task 2.1.1: Migration + Model HelpdeskTicket & Progress

- **Estimasi:** 2 jam
- **Steps:**
    1. ~~`create_pelayanans_table`~~ → `create_helpdesk_tickets_table` (sudah dibuat).
    2. ~~`create_pelayanan_progress_table`~~ → `create_helpdesk_progress_table` (sudah dibuat).
    3. `php artisan make:model HelpdeskTicket -mf` + relasi.
    4. `php artisan make:model HelpdeskProgress -mf`.
    5. `php artisan make:enum HelpdeskStatusEnum` (sudah ada), `HelpdeskKategoriEnum` (sudah ada), `HelpdeskJenisPermintaanEnum` (sudah ada).
- **Acceptance:** Tabel `helpdesk_tickets` & `helpdesk_progress` ada, model + relasi OK.

#### Task 2.1.2: HelpdeskService

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:request HelpdeskStoreRequest` + rules (nama required, kategori in:enum, dll).
    2. `php artisan make:request HelpdeskProgressRequest` (komentar required).
    3. `php artisan make:service HelpdeskService` + create (auto-gen kode tiket), updateStatus, tambahProgress.
    4. `php artisan make:policy HelpdeskTicketPolicy`.
- **Acceptance:** CRUD + progress flow berfungsi, kode tiket auto-generate `#0125` style.

#### Task 2.1.3: HelpdeskController

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:controller HelpdeskController --resource`.
    2. Tambah method custom: `proses` (status baru→diproses), `selesaikan` (status diproses→selesai + tindak lanjut), `tutup`.
    3. Register routes.
- **Acceptance:** Routes berfungsi, authorization per role.

#### Task 2.1.4: Notifikasi Helpdesk

- **Estimasi:** 1 jam
- **Steps:**
    1. `php artisan make:notification HelpdeskBaruNotification` (ke IT/admin).
    2. `php artisan make:notification HelpdeskProgressNotification` (ke pelapor).
    3. Wire ke Service.
- **Acceptance:** Notif terkirim saat tiket baru & update status.

### 5.2 Hari 15-16: Frontend Helpdesk

#### Task 2.2.1: Halaman 1 — Form Pelaporan Staf

- **Estimasi:** 3 jam
- **Steps:**
    1. Buat `pages/Helpdesk/Create.tsx` (sesuai screenshot).
    2. Field: nama pelapor (prefill), unit (dropdown), kategori (dropdown fix 4), permintaan (dropdown fix 3), deskripsi, file pendukung (drag-drop).
    3. Validasi form client + server.
    4. Submit → tampil pesan sukses dengan kode tiket.
- **Acceptance:** User bisa kirim laporan, dapat kode tiket.

#### Task 2.2.2: Halaman 2 — Dashboard Tim IT

- **Estimasi:** 4 jam
- **Steps:**
    1. Buat `pages/Helpdesk/Index.tsx` (sesuai screenshot).
    2. 3 card counter di atas: Tiket Baru / Diproses / Selesai.
    3. Tabel tiket dengan kolom: Tiket, Unit, Permintaan, Lampiran, Status.
    4. Filter status + pagination.
- **Acceptance:** Dashboard tampil dengan counter & tabel, filter berfungsi.

#### Task 2.2.3: Halaman Rincian + Aksi Tim IT

- **Estimasi:** 4 jam
- **Steps:**
    1. Buat `pages/Helpdesk/Show.tsx` (info tiket, deskripsi, lampiran, progress timeline).
    2. Tombol aksi sesuai status: "Proses" (baru), "Tandai Selesai" (diproses + form tindak lanjut), "Tutup".
    3. Komponen `HelpdeskProgressTimeline.tsx` untuk riwayat.
- **Acceptance:** Tim IT bisa proses tiket, catat tindak lanjut, selesaikan.

#### Task 2.2.4: Test Helpdesk

- **Estimasi:** 2 jam
- **Steps:**
    1. Feature test: create tiket, auto-gen kode, update status, progress flow, authorization.
    2. Unit test: HelpdeskService.
- **Acceptance:** Coverage > 70%.

---

## 6. Fase 3: Polish, Hardening, Deploy (3 hari)

### 6.1 Hari 17: Polish UX

#### Task 3.1.1: Loading states + error boundaries

- **Estimasi:** 2 jam
- **Steps:**
    1. Tambah `Loader2` di semua button submit.
    2. Tambah error boundary di App.
    3. Tambah 403/404/500 error pages di `pages/Errors/`.
- **Acceptance:** Loading & error handling konsisten.

#### Task 3.1.2: Empty states + confirm dialogs

- **Estimasi:** 2 jam
- **Steps:**
    1. Tambah empty state di semua list (tabel kosong).
    2. Tambah confirm dialog untuk hapus.
    3. Polish toast notifications.
- **Acceptance:** UX lebih jelas untuk user.

#### Task 3.1.3: Mobile responsive check

- **Estimasi:** 2 jam
- **Steps:**
    1. Test semua halaman di viewport 375px, 768px, 1280px.
    2. Fix layout issues (table horizontal scroll, form full-width, dll).
- **Acceptance:** Semua halaman responsive.

#### Task 3.1.4: Accessibility check

- **Estimasi:** 1 jam
- **Steps:**
    1. Cek label, alt text, focus visible.
    2. Test keyboard navigation.
- **Acceptance:** WCAG 2.1 Level A minimal terpenuhi.

### 6.2 Hari 18: Admin Panel (Users, Master Data, Audit)

#### Task 3.2.1: Admin — User management

- **Estimasi:** 4 jam
- **Steps:**
    1. `php artisan make:controller Admin/UserController --resource`.
    2. Methods: `index`, `create`, `store`, `edit`, `update`, `destroy`, `pending`, `approve`, `reject`.
    3. Frontend: `pages/Admin/Users/*` (list, create, edit, pending).
    4. Role-based UI (admin TU vs superadmin).
- **Acceptance:** Superadmin bisa kelola user, approve pending.

#### Task 3.2.2: Admin — Master data (Unit, Kode, Indeks)

- **Estimasi:** 3 jam
- **Steps:**
    1. `php artisan make:controller Admin/UnitController --resource` + Policy.
    2. Sama untuk KodeSurat & Indeks.
    3. Frontend: pages untuk CRUD.
- **Acceptance:** Master data bisa dikelola.

#### Task 3.2.3: Admin — Audit Log viewer

- **Estimasi:** 2 jam
- **Steps:**
    1. `php artisan make:controller Admin/AuditLogController`.
    2. `php artisan migrate` untuk tabel `audit_logs`.
    3. Frontend: `pages/Admin/AuditLogs/Index.tsx` + detail modal.
- **Acceptance:** Superadmin bisa lihat history perubahan.

### 6.3 Hari 19: Deploy & Dokumentasi

#### Task 3.3.1: Production build & optimization

- **Estimasi:** 2 jam
- **Steps:**
    1. `npm run build` (atau `bun run build`).
    2. `php artisan config:cache && route:cache && view:cache && event:cache`.
    3. Test di environment production-like.
- **Acceptance:** Build sukses, app load cepat.

#### Task 3.3.2: Deployment script + .env production

- **Estimasi:** 2 jam
- **Steps:**
    1. Setup `DEPLOY.md` dengan langkah deploy ke server RSGM.
    2. Setup `.env.production` template.
    3. Setup Nginx config + PHP-FPM pool.
    4. Setup Supervisor untuk queue worker.
    5. Setup cron untuk scheduled tasks.
- **Acceptance:** Dokumentasi deploy lengkap.

#### Task 3.3.3: Backup strategy

- **Estimasi:** 1 jam
- **Steps:**
    1. Tulis bash script untuk `mysqldump` harian.
    2. Setup cron untuk eksekusi.
    3. Dokumentasikan prosedur restore.
- **Acceptance:** Backup otomatis berjalan.

#### Task 3.3.4: Final documentation

- **Estimasi:** 1 jam
- **Steps:**
    1. Update `docs/progress.txt` dengan status semua fase.
    2. Update `docs/lessons.md` dengan lessons learned selama development.
    3. Tulis `README.md` dengan quick start.
- **Acceptance:** Dokumentasi lengkap.

---

## 7. Definition of Done (per Task)

Setiap task dianggap selesai jika:

- ✅ Code ditulis sesuai FRONTEND_GUIDELINES.md / BACKEND_STRUCTURE.md.
- ✅ TypeScript types didefinisikan (no `any`).
- ✅ Form Request validation ditulis (untuk backend).
- ✅ Authorization check ditulis (untuk backend).
- ✅ Authorization UI hide/show (untuk frontend).
- ✅ Test ditulis (minimal happy path).
- ✅ Manual test di browser (cek no console error, no 404).
- ✅ Mobile responsive dicek (untuk UI task).
- ✅ `vendor/bin/pint --dirty` pass (untuk PHP).
- ✅ `npm run lint` pass (untuk TS).
- ✅ `php artisan test` pass.

---

## 8. Risiko & Mitigasi per Fase

| Fase | Risiko                                          | Mitigasi                                                          |
| ---- | ----------------------------------------------- | ----------------------------------------------------------------- |
| 0    | shadcn/ui setup conflict dengan Tailwind preset | Backup `tailwind.config` sebelum init; install manual jika perlu. |
| 0    | Wayfinder generate path berbeda                 | Selalu gunakan `@/actions/...` dan `@/routes/...`.                |
| 1    | PDF layout tidak sesuai                         | Iterasi design PDF dengan stakeholder sebelum finalisasi.         |
| 1    | Approval flow Rektor bottleneck                 | Setup Wakil Rektor sebagai backup approver (fase 2).              |
| 1    | File upload error di production                 | Test dengan file size mendekati 10MB, cek disk space server.      |
| 2    | Rich text editor XSS                            | Wajib sanitize dengan DOMPurify saat render.                      |
| 3    | Deployment gagal di server RSGM                 | Dry-run deployment di VM lokal dulu, dokumentasikan error.        |

---

## 9. Post-MVP Roadmap (Fase 4+)

### 9.1 Modul Pengadaan (Fase 4)

- Tambah migration `pengadaans` & `pengadaan_items`.
- Tambah controller, service, pages.
- Scope: pencatatan surat penawaran saja (bukan procurement cycle).

### 9.2 Multi-tahun Toggle (Fase 4)

- Sudah ada di MVP, tapi mungkin perlu UI lebih jelas di rekap.

### 9.3 Dashboard Analytics (Fase 5)

- Grafik jumlah surat per bulan (Chart.js atau Recharts).
- Statistik global RSGM.
- Top 5 pengirim eksternal.

### 9.4 Optimasi (Fase 5)

- Image optimization untuk preview file.
- Database query optimization (EXPLAIN).
- Frontend code splitting.
- CDN untuk asset statis.

### 9.5 PWA Support (Fase 6, opsional)

- Service worker untuk offline basic.
- Install prompt untuk HP.

---

## 10. Sprint Planning Suggestion (jika pakai Agile)

**Sprint 1 (1 minggu):** Fase 0 + awal Fase 1 (Surat Masuk CRUD).
**Sprint 2 (1 minggu):** Fase 1 lanjutan (Disposisi + Surat Keluar).
**Sprint 3 (1 minggu):** Fase 1 akhir (PDF + Rekap) + Fase 2 (Pelayanan).
**Sprint 4 (4 hari):** Fase 3 (Polish, Admin, Deploy).

**Velocity target:** ~5 task/hari (1 task = 1-3 jam).

---

## 11. Tracking Progress

Gunakan `docs/progress.txt` untuk track:

```markdown
# Progress Log

## 2026-08-27

- [x] Inisialisasi project (Task 0.1.1)
- [x] Install shadcn/ui (Task 0.1.2)
- [ ] Tailwind config (Task 0.1.3) - in progress

## 2026-08-28

- [...]
```

---

## 12. Acceptance Criteria MVP

MVP dianggap selesai jika:

1. ✅ User bisa register, login, ganti password.
2. ✅ Superadmin bisa approve user pending.
3. ✅ User bisa tambah surat masuk dengan upload file.
4. ✅ User bisa disposisi surat (multi-route hingga Rektor ACC).
5. ✅ User bisa buat surat keluar, submit, Rektor bisa ACC.
6. ✅ User bisa cetak lembar disposisi & surat keluar (PDF).
7. ✅ User bisa rekap & export Excel/PDF.
8. ✅ User bisa ajukan & update permintaan pelayanan.
9. ✅ Notifikasi in-app bekerja real-time (polling).
10. ✅ Soft delete + restore bekerja.
11. ✅ Toggle ganti tahun bekerja.
12. ✅ Mobile responsive di breakpoint umum.
13. ✅ Test coverage > 70% untuk backend critical paths.
14. ✅ Deployment script siap & terdokumentasi.
15. ✅ User manual singkat tersedia.

---

**Dokumen ini adalah roadmap eksekusi. Update setiap ada perubahan scope atau timeline.**
