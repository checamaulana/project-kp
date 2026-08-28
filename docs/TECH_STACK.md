# Technology Stack (TECH_STACK)
## SIM SURAT RSGM UNIMUS

**Versi:** 1.0
**Tanggal:** 2026-08-27
**Referensi:** PRD.md, APP_FLOW.md, AGENTS.md

---

## 1. Ringkasan Stack

| Layer | Teknologi | Versi | Alasan |
|---|---|---|---|
| **Backend Framework** | Laravel | 12.x | Modern, ekosistem matang, dokumentasi lengkap, sesuai AGENTS.md. |
| **Frontend Bridge** | Inertia.js | 2.x | SPA feel tanpa API terpisah, sesuai AGENTS.md. |
| **Frontend Framework** | React | 18.x | Komponen reaktif, ekosistem besar. |
| **Type System** | TypeScript | 5.x | Type safety, IDE support lebih baik. |
| **Styling** | Tailwind CSS | 3.x | Utility-first, cepat, bundle kecil. |
| **UI Components** | shadcn/ui | latest | Komponen accessible & customizable, sesuai AGENTS.md. |
| **Database** | MySQL | 8.0 | Stabil, dukungan penuh Laravel, on-premise friendly. |
| **Package Manager (JS)** | Bun | 1.x | Cepat, sesuai AGENTS.md. |
| **Package Manager (PHP)** | Composer | 2.x | Standar Laravel. |
| **Build Tool** | Vite | 5.x | Cepat, default Laravel. |
| **Runtime (PHP)** | PHP | 8.2.28 | Sesuai AGENTS.md. |
| **Server** | Nginx + PHP-FPM | latest | Stabil, hemat resource, umum di on-premise. |
| **OS Server** | Linux Ubuntu | 22.04 LTS | Stabil, long-term support. |
| **PDF Generator** | Spatie/Laravel-PDF atau DomPDF | latest | Generate PDF surat keluar & lembar disposisi. |
| **Rich Text Editor** | Tiptap | 2.x | Untuk field detail permintaan pelayanan. |
| **File Upload** | Laravel Storage | 12.x | Local filesystem abstraction. |
| **Queue** | Laravel Queue (database driver) | 12.x | Untuk email & notifikasi. |
| **Testing (PHP)** | Pest | 3.x | Modern, ekspresif, sesuai AGENTS.md. |
| **Testing (JS)** | Vitest + React Testing Library | latest | Standar untuk Vite + React. |
| **Code Style (PHP)** | Laravel Pint | 1.x | Auto-format, sesuai AGENTS.md. |
| **Code Style (JS/TS)** | ESLint + Prettier | latest | Standar React. |
| **Auth** | Laravel built-in (Sanctum untuk session) | 12.x | Tidak perlu tambahan. |
| **Wayfinder** | laravel/wayfinder | 0.x | Type-safe Laravel routes → TS, sesuai AGENTS.md. |
| **MCP** | laravel/mcp | 0.x | Untuk AI-assisted development, sesuai AGENTS.md. |
| **Prompts** | laravel/prompts | 0.x | Untuk CLI interaktif, sesuai AGENTS.md. |
| **Sail** | laravel/sail | 1.x | Docker dev environment, sesuai AGENTS.md. |

---

## 2. Backend Stack (Detail)

### 2.1 Framework & Core

#### Laravel 12.x
- **Streamlined structure** (no `app/Http/Kernel.php`, pakai `bootstrap/app.php`).
- **PHP 8.2.28** minimum.
- **Server requirements:** PHP 8.2+, BCMath, Ctype, cURL, DOM, Fileinfo, Filter, Hash, Mbstring, OpenSSL, PCRE, PDO, Session, Tokenizer, XML.

#### Composer 2.x
- Dependency management.
- Autoload PSR-4 untuk app classes.

#### Laravel Pint 1.x
- Auto-formatting PHP code style.
- Config: `pint.json` di root.

### 2.2 Backend Packages (dari AGENTS.md)

| Package | Versi | Fungsi |
|---|---|---|
| `inertiajs/inertia-laravel` | v2 | Server-side adapter untuk Inertia. |
| `laravel/wayfinder` | v0 | TypeScript route generation dari Laravel routes. |
| `laravel/mcp` | v0 | Model Context Protocol untuk AI tools. |
| `laravel/prompts` | v0 | Interactive CLI prompts. |
| `laravel/sail` | v1 | Docker dev environment. |
| `pestphp/pest` | v3 | Testing framework. |
| `phpunit/phpunit` | v11 | Underlying test runner untuk Pest. |

### 2.3 Backend Packages Tambahan (akan ditambahkan)

```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^12.0",
    "laravel/tinker": "^2.9",
    "inertiajs/inertia-laravel": "^2.0",
    "laravel/sanctum": "^4.0",
    "barryvdh/laravel-dompdf": "^3.0",     // PDF generation
    "spatie/laravel-permission": "^6.0",    // RBAC (alternative: pakai guards manual)
    "maatwebsite/excel": "^3.1",            // Excel export
    "intervention/image": "^3.0"            // Image manipulation (opsional, untuk preview)
  },
  "require-dev": {
    "fakerphp/faker": "^1.23",
    "laravel/pint": "^1.13",
    "laravel/sail": "^1.26",
    "mockery/mockery": "^1.6",
    "nunomaduro/collision": "^8.1",
    "pestphp/pest": "^3.0",
    "pestphp/pest-plugin-laravel": "^3.0"
  }
}
```

### 2.4 Struktur Direktori Backend

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/                  # Login, Register, Logout, Password Reset
│   │   │   ├── LoginController.php
│   │   │   ├── RegisterController.php
│   │   │   └── ...
│   │   ├── SuratMasukController.php
│   │   ├── SuratKeluarController.php
│   │   ├── DisposisiController.php
│   │   ├── PelayananController.php
│   │   ├── RekapController.php
│   │   ├── NotifikasiController.php
│   │   ├── ProfileController.php
│   │   └── Admin/
│   │       ├── UserController.php
│   │       ├── UnitController.php
│   │       ├── KodeSuratController.php
│   │       ├── IndeksController.php
│   │       └── AuditLogController.php
│   ├── Middleware/
│   │   ├── HandleInertiaRequests.php    # Default
│   │   ├── EnsureUserActive.php         # Custom: cek status active
│   │   ├── CheckRole.php                # Custom: role-based gate
│   │   └── SetActiveYear.php            # Custom: handle toggle tahun
│   ├── Requests/                 # Form Request Validation
│   │   ├── Auth/...
│   │   ├── SuratMasukStoreRequest.php
│   │   ├── SuratMasukUpdateRequest.php
│   │   ├── SuratKeluarStoreRequest.php
│   │   ├── DisposisiStoreRequest.php
│   │   └── PelayananStoreRequest.php
│   └── Resources/                # Optional: API resources
│       └── UserResource.php
├── Models/
│   ├── User.php
│   ├── Unit.php
│   ├── Role.php                  # Enum atau table
│   ├── KodeSurat.php
│   ├── Indeks.php
│   ├── SuratMasuk.php
│   ├── SuratKeluar.php
│   ├── Disposisi.php
│   ├── Pelayanan.php
│   ├── PelayananProgress.php
│   ├── Notification.php
│   └── AuditLog.php
├── Observers/                    # Auto-trigger audit log
│   ├── SuratMasukObserver.php
│   ├── SuratKeluarObserver.php
│   ├── DisposisiObserver.php
│   └── UserObserver.php
├── Services/                     # Business logic
│   ├── SuratMasukService.php
│   ├── SuratKeluarService.php
│   ├── DisposisiService.php
│   ├── PelayananService.php
│   ├── NotifikasiService.php
│   ├── NomorSuratGenerator.php
│   └── PdfGenerator.php
├── Notifications/                # Laravel notifications
│   ├── SuratMasukBaru.php
│   ├── DisposisiBaru.php
│   ├── SuratKeluarApproved.php
│   └── ...
├── Enums/
│   ├── RoleEnum.php              # superadmin, admin_tu, kepala_unit, staf
│   ├── StatusSuratEnum.php       # aktif, on_route, selesai
│   ├── StatusSuratKeluarEnum.php # draft, menunggu_acc, disetujui, ditolak
│   ├── StatusPelayananEnum.php   # waiting, accepted, in_progress, rejected, closed
│   └── AksiDisposisiEnum.php     # di_disposisi, di_arsipkan
├── Policies/                     # Authorization
│   ├── SuratMasukPolicy.php
│   ├── SuratKeluarPolicy.php
│   └── UserPolicy.php
└── Providers/
    ├── AppServiceProvider.php
    └── AuthServiceProvider.php

bootstrap/
├── app.php                       # Laravel 12 main config
└── providers.php

config/
├── app.php
├── auth.php
├── cache.php
├── database.php
├── filesystems.php               # Storage disks
├── inertia.php
├── logging.php
├── mail.php
├── queue.php
├── services.php
└── session.php

database/
├── factories/
│   ├── UserFactory.php
│   ├── UnitFactory.php
│   ├── SuratMasukFactory.php
│   └── ...
├── migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 0001_01_01_000001_create_cache_table.php
│   ├── 0001_01_01_000002_create_jobs_table.php
│   ├── 2025_08_14_170933_add_two_factor_columns_to_users_table.php
│   ├── 2026_08_27_100000_create_units_table.php
│   ├── 2026_08_27_100001_create_kode_surats_table.php
│   ├── 2026_08_27_100002_create_indeks_table.php
│   ├── 2026_08_27_100003_create_surat_masuks_table.php
│   ├── 2026_08_27_100004_create_surat_keluars_table.php
│   ├── 2026_08_27_100005_create_disposisis_table.php
│   ├── 2026_08_27_100006_create_pelayanans_table.php
│   ├── 2026_08_27_100007_create_pelayanan_progress_table.php
│   ├── 2026_08_27_100008_create_notifications_table.php
│   ├── 2026_08_27_100009_create_audit_logs_table.php
│   └── ...
├── seeders/
│   ├── DatabaseSeeder.php
│   ├── UserSeeder.php            # Superadmin default
│   ├── UnitSeeder.php            # 12 unit default
│   ├── IndeksSeeder.php          # Indeks default
│   └── KodeSuratSeeder.php       # Kode UNIMUS, RSGM

routes/
├── web.php
├── console.php
└── auth.php                      # Login, register, password reset

storage/
├── app/
│   ├── private/                  # User-uploaded files (not public)
│   │   └── surat/{tahun}/{file}
│   └── public/                   # Public assets
├── framework/
│   ├── cache/data/
│   ├── sessions/
│   ├── testing/
│   └── views/
└── logs/

tests/
├── Pest.php
├── TestCase.php
├── Feature/
│   ├── Auth/...
│   ├── SuratMasukTest.php
│   ├── SuratKeluarTest.php
│   ├── DisposisiTest.php
│   └── PelayananTest.php
└── Unit/
    ├── Services/
    │   ├── NomorSuratGeneratorTest.php
    │   └── ...
    └── Models/
```

### 2.5 Database Schema (MySQL 8.0)

#### Tabel `users`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| username | VARCHAR(100) | UNIQUE, NOT NULL |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| email_verified_at | TIMESTAMP | NULL |
| password | VARCHAR(255) | NOT NULL |
| unit_id | BIGINT UNSIGNED | FK → units.id, NOT NULL |
| role | ENUM('superadmin','admin_tu','kepala_unit','staf') | NOT NULL |
| status | ENUM('pending','active','rejected') | DEFAULT 'pending' |
| remember_token | VARCHAR(100) | NULL |
| created_at | TIMESTAMP | NULL |
| updated_at | TIMESTAMP | NULL |
| deleted_at | TIMESTAMP | NULL (soft delete) |

**Indexes:** `username`, `email`, `(unit_id, role)`, `(status, role)`.

#### Tabel `units`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| kode | VARCHAR(10) | UNIQUE |
| nama | VARCHAR(100) | NOT NULL |
| keterangan | TEXT | NULL |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at, updated_at | TIMESTAMP | |

#### Tabel `kode_surats`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| kode | VARCHAR(20) | UNIQUE |
| keterangan | VARCHAR(255) | NULL |
| is_active | BOOLEAN | DEFAULT TRUE |

#### Tabel `indeks`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| kode | VARCHAR(10) | UNIQUE |
| nama | VARCHAR(100) | NOT NULL |
| kode_turunan | JSON | NULL (untuk ST: ["KP","KM"]) |
| is_active | BOOLEAN | DEFAULT TRUE |

#### Tabel `surat_masuks`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| no_urut | INT UNSIGNED | NOT NULL (auto per tahun) |
| tahun | SMALLINT UNSIGNED | NOT NULL |
| tanggal_terima | DATE | NOT NULL |
| tanggal_surat | DATE | NOT NULL |
| nomor_surat | VARCHAR(100) | NOT NULL |
| pengirim | VARCHAR(255) | NOT NULL |
| perihal | VARCHAR(255) | NOT NULL |
| keterangan | TEXT | NULL |
| indeks_id | BIGINT UNSIGNED | FK → indeks.id, NULL |
| file_path | VARCHAR(255) | NOT NULL |
| file_name | VARCHAR(255) | NOT NULL |
| unit_penerima_id | BIGINT UNSIGNED | FK → units.id, NOT NULL |
| created_by | BIGINT UNSIGNED | FK → users.id |
| updated_by | BIGINT UNSIGNED | FK → users.id, NULL |
| status | ENUM('aktif','on_route','selesai') | DEFAULT 'aktif' |
| created_at, updated_at | TIMESTAMP | |
| deleted_at | TIMESTAMP | NULL |

**Indexes:** `(tahun, no_urut)`, `(tanggal_terima)`, `(unit_penerima_id)`, `(status)`, FULLTEXT `(pengirim, perihal, nomor_surat)`.

#### Tabel `surat_keluars`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| no_urut | INT UNSIGNED | NOT NULL (auto per tahun) |
| tahun | SMALLINT UNSIGNED | NOT NULL |
| nomor_surat | VARCHAR(100) | UNIQUE NOT NULL |
| kode_surat_id | BIGINT UNSIGNED | FK → kode_surats.id, NOT NULL |
| indeks_id | BIGINT UNSIGNED | FK → indeks.id, NOT NULL |
| kode_turunan | VARCHAR(10) | NULL (KP/KM untuk ST) |
| tanggal_surat | DATE | NOT NULL |
| kepada | VARCHAR(255) | NOT NULL |
| perihal | VARCHAR(255) | NOT NULL |
| penanda_tangan | VARCHAR(255) | NOT NULL |
| tembusan | TEXT | NULL |
| keterangan | TEXT | NULL |
| tanggal_mulai_penugasan | DATE | NULL (khusus ST) |
| tanggal_selesai_penugasan | DATE | NULL (khusus ST) |
| file_path | VARCHAR(255) | NULL |
| file_name | VARCHAR(255) | NULL |
| unit_pembuat_id | BIGINT UNSIGNED | FK → units.id, NOT NULL |
| created_by | BIGINT UNSIGNED | FK → users.id |
| status | ENUM('draft','menunggu_acc','disetujui','ditolak') | DEFAULT 'draft' |
| approved_by | BIGINT UNSIGNED | FK → users.id, NULL |
| approved_at | TIMESTAMP | NULL |
| rejection_reason | TEXT | NULL |
| created_at, updated_at | TIMESTAMP | |
| deleted_at | TIMESTAMP | NULL |

**Indexes:** `(tahun, no_urut)`, `(status)`, `(unit_pembuat_id)`, `(tanggal_surat)`.

#### Tabel `disposisis`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| surat_masuk_id | BIGINT UNSIGNED | FK → surat_masuks.id, NOT NULL |
| parent_id | BIGINT UNSIGNED | FK → disposisis.id, NULL (untuk chain) |
| dari_user_id | BIGINT UNSIGNED | FK → users.id, NOT NULL |
| kepada_user_id | BIGINT UNSIGNED | FK → users.id, NULL (jika ke user) |
| kepada_unit_id | BIGINT UNSIGNED | FK → units.id, NULL (jika ke unit) |
| isi | TEXT | NOT NULL |
| aksi | ENUM('di_disposisi','di_arsipkan') | NOT NULL |
| status | ENUM('pending','selesai') | DEFAULT 'pending' |
| dibaca_at | TIMESTAMP | NULL |
| selesai_at | TIMESTAMP | NULL |
| created_at, updated_at | TIMESTAMP | |

**Indexes:** `(surat_masuk_id, created_at)`, `(kepada_user_id, status)`, `(dari_user_id)`.

#### Tabel `pelayanans`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| judul | VARCHAR(100) | NOT NULL |
| jenis_pelayanan | VARCHAR(50) | NOT NULL (pendaftaran, rawat_jalan, dll) |
| aplikasi | VARCHAR(50) | NOT NULL (trouble, pengembangan_fitur) |
| detail | LONGTEXT | NOT NULL (rich text JSON atau HTML) |
| pengaju_id | BIGINT UNSIGNED | FK → users.id, NOT NULL |
| unit_pengaju_id | BIGINT UNSIGNED | FK → units.id, NOT NULL |
| handler_id | BIGINT UNSIGNED | FK → users.id, NULL |
| status | ENUM('waiting','accepted','in_progress','rejected','closed') | DEFAULT 'waiting' |
| lampiran | JSON | NULL (array of file paths) |
| created_at, updated_at | TIMESTAMP | |
| closed_at | TIMESTAMP | NULL |

#### Tabel `pelayanan_progress`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| pelayanan_id | BIGINT UNSIGNED | FK → pelayanans.id, NOT NULL |
| user_id | BIGINT UNSIGNED | FK → users.id, NOT NULL |
| komentar | TEXT | NOT NULL |
| status_sebelum | VARCHAR(20) | NOT NULL |
| status_sesudah | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | |

#### Tabel `notifications`
(Standar Laravel notifications table)
- `id`, `type`, `notifiable_type`, `notifiable_id`, `data` (JSON), `read_at`, `created_at`, `updated_at`.

#### Tabel `audit_logs`
| Kolom | Tipe | Constraint |
|---|---|---|
| id | BIGINT UNSIGNED | PK |
| user_id | BIGINT UNSIGNED | FK → users.id, NULL |
| action | VARCHAR(50) | NOT NULL (created, updated, deleted, restored) |
| model_type | VARCHAR(100) | NOT NULL |
| model_id | BIGINT UNSIGNED | NULL |
| before | JSON | NULL |
| after | JSON | NULL |
| ip_address | VARCHAR(45) | NULL |
| user_agent | TEXT | NULL |
| created_at | TIMESTAMP | |

**Indexes:** `(model_type, model_id)`, `(user_id, created_at)`, `(action)`.

---

## 3. Frontend Stack (Detail)

### 3.1 Core

#### React 18.x
- Functional components + hooks (sesuai AGENTS.md).
- Concurrent features (Suspense, useTransition untuk deferred props).

#### TypeScript 5.x
- Strict mode ON.
- Interface untuk semua props dan data shape.
- `no-any: error` di ESLint.

#### Inertia.js 2.x
- Server-side routing via `Inertia::render()`.
- Client-side navigation tanpa full page reload.
- **v2 features:** Deferred props, infinite scroll (merge props + WhenVisible), lazy loading, prefetching.
- Link: `<Link href={route('surat-masuk.index')}>` (auto-generated via Wayfinder).
- Form: `useForm()` hook untuk state management.

#### Vite 5.x
- Hot Module Replacement untuk dev.
- Tree-shaking untuk production.
- Build output: `public/build/`.

### 3.2 Styling

#### Tailwind CSS 3.x
- Utility-first.
- Custom design tokens di `tailwind.config.ts` (sesuai AGENTS.md):
  - `background: #FFFFFF`
  - `foreground: #0A0A0A`
  - `muted: #F5F5F5`
  - `border: #E5E5E5`
  - `success: green` (available, accepted)
  - `destructive: red` (sold, rejected)
  - Tambahan: `primary: #1E40AF` (biru RSGM)
- Mobile-first approach.

#### shadcn/ui (latest)
- Komponen: Button, Card, Input, Label, Select, Textarea, Dialog, Dropdown, Table, Tabs, Toast, Form, Badge, Avatar, dll.
- Customize via `components.json`.
- Copy-paste komponen (bukan npm package), sesuai preferensi AGENTS.md.

### 3.3 Frontend Packages

```json
{
  "dependencies": {
    "@inertiajs/react": "^2.0",
    "@inertiajs/progress": "^0.1",
    "react": "^18.0",
    "react-dom": "^18.0",
    "@tiptap/react": "^2.0",                  // Rich text editor
    "@tiptap/starter-kit": "^2.0",
    "lucide-react": "^0.400",                 // Icons
    "clsx": "^2.1",
    "tailwind-merge": "^2.3",
    "class-variance-authority": "^0.7",
    "date-fns": "^3.6",                       // Date formatting
    "dompurify": "^3.1",                      // Sanitize rich text
    "sonner": "^1.5"                          // Toast notifications
  },
  "devDependencies": {
    "@types/react": "^18.3",
    "@types/react-dom": "^18.3",
    "@types/dompurify": "^3.0",
    "@vitejs/plugin-react": "^4.3",
    "typescript": "^5.5",
    "vite": "^5.4",
    "tailwindcss": "^3.4",
    "autoprefixer": "^10.4",
    "postcss": "^8.4",
    "eslint": "^9.9",
    "prettier": "^3.3",
    "vitest": "^2.0",
    "@testing-library/react": "^16.0",
    "@testing-library/jest-dom": "^6.4"
  }
}
```

### 3.4 Frontend Packages dari AGENTS.md (Wayfinder)

#### `laravel/wayfinder` (via `@/actions` & `@/routes`)
- Auto-generate TypeScript functions dari Laravel routes.
- Import di frontend: `import { show, store } from '@/actions/...';`
- Type-safe parameter binding.

### 3.5 Struktur Direktori Frontend

```
resources/
├── css/
│   └── app.css                      # Tailwind directives + custom
├── js/
│   ├── app.tsx                      # Entry point
│   ├── ssr.tsx                      # SSR entry (optional)
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx (sonner)
│   │   │   ├── avatar.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── ...
│   │   ├── common/                  # Shared components
│   │   │   ├── AppLayout.tsx        # Root layout (sidebar + header)
│   │   │   ├── AuthLayout.tsx       # Login/register layout
│   │   │   ├── Header.tsx           # Top bar (bell, user menu, year toggle)
│   │   │   ├── Sidebar.tsx          # Side nav
│   │   │   ├── PageHeader.tsx
│   │   │   ├── DataTable.tsx        # Reusable table with sort/filter/pagination
│   │   │   ├── FileUpload.tsx       # Drag & drop upload
│   │   │   ├── DatePicker.tsx
│   │   │   ├── NotificationBell.tsx
│   │   │   ├── YearToggle.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   └── ConfirmDialog.tsx
│   │   ├── admin/                   # Admin-only components
│   │   │   ├── UserForm.tsx
│   │   │   ├── UserTable.tsx
│   │   │   ├── UnitForm.tsx
│   │   │   ├── IndeksForm.tsx
│   │   │   └── AuditLogTable.tsx
│   │   └── surat/                   # Surat-specific
│   │       ├── SuratMasukForm.tsx
│   │       ├── SuratMasukTable.tsx
│   │       ├── SuratKeluarForm.tsx
│   │       ├── SuratKeluarTable.tsx
│   │       ├── DisposisiForm.tsx
│   │       ├── DisposisiTimeline.tsx
│   │       └── RekapFilter.tsx
│   ├── hooks/                       # Custom React hooks
│   │   ├── useNotifications.ts
│   │   ├── useDebounce.ts
│   │   ├── useYearFilter.ts
│   │   └── usePermissions.ts
│   ├── lib/
│   │   ├── utils.ts                 # cn(), formatDate(), dll
│   │   ├── wayfinder.ts             # Helper untuk wayfinder
│   │   └── constants.ts             # Konstanta (status color, role label, dll)
│   ├── pages/                       # Inertia pages
│   │   ├── welcome.tsx
│   │   ├── auth/
│   │   │   ├── login.tsx
│   │   │   ├── register.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   └── reset-password.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Profile.tsx
│   │   ├── SuratMasuk/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Edit.tsx
│   │   │   └── Show.tsx
│   │   ├── SuratKeluar/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   ├── Edit.tsx
│   │   │   └── Show.tsx
│   │   ├── Disposisi/
│   │   │   ├── Index.tsx
│   │   │   └── Show.tsx
│   │   ├── Rekap/
│   │   │   ├── SuratMasuk.tsx
│   │   │   ├── SuratKeluar.tsx
│   │   │   └── Disposisi.tsx
│   │   ├── Pelayanan/
│   │   │   ├── Index.tsx
│   │   │   ├── Create.tsx
│   │   │   └── Show.tsx
│   │   ├── Notifications.tsx
│   │   ├── Approval/
│   │   │   └── Index.tsx
│   │   └── Admin/
│   │       ├── Users/
│   │       │   ├── Index.tsx
│   │       │   ├── Create.tsx
│   │       │   ├── Edit.tsx
│   │       │   └── Pending.tsx
│   │       ├── Units/
│   │       │   ├── Index.tsx
│   │       │   ├── Create.tsx
│   │       │   └── Edit.tsx
│   │       ├── KodeSurat/
│   │       │   └── ...
│   │       ├── Indeks/
│   │       │   └── ...
│   │       └── AuditLogs/
│   │           └── Index.tsx
│   ├── types/                       # TypeScript types
│   │   ├── auth.ts
│   │   ├── index.ts
│   │   ├── surat.ts
│   │   ├── disposisi.ts
│   │   ├── pelayanan.ts
│   │   ├── user.ts
│   │   └── vite-env.d.ts
│   └── actions/                     # Generated by Wayfinder
│       └── ...
├── views/
│   └── app.blade.php                # Root template
└── ...
```

---

## 4. State Management

### 4.1 Server State
- **Inertia.js** sebagai primary state container. Data di-pass via `Inertia::render('Page', ['data' => ...])`.
- **Deferred props** untuk data non-critical (Inertia v2).
- **Polling** untuk notifikasi (interval 30s, Inertia `whenVisible`).

### 4.2 Client State
- **`useState` / `useReducer`** untuk local component state.
- **`useForm`** dari Inertia untuk form state + validation errors.
- **Tidak ada** Redux/Zustand/Jotai — overkill untuk scope ini.

### 4.3 URL State
- **Query params** untuk filter & pagination (shareable URLs).
- **Session** untuk toggle tahun (server-side).

---

## 5. Authentication & Authorization

### 5.1 Authentication (Laravel default + custom tweaks)
- **Login:** Username + password (bukan email).
- **Password hashing:** Bcrypt.
- **Session-based auth** (Laravel default).
- **CSRF protection** (Laravel default).
- **Email verification:** Opsional (tidak wajib aktif).
- **Password reset:** Via email link (Laravel default).

### 5.2 Authorization
- **Gates & Policies** di Laravel.
- Contoh: `Gate::define('approve-surat-keluar', fn($user) => $user->role === 'superadmin')`.
- Middleware: `->middleware('can:approve-surat-keluar')`.
- Frontend hide menu jika `can()` return false.

### 5.3 Middleware Custom
```php
// EnsureUserActive: blokir user yang belum active
public function handle($request, Closure $next)
{
    if ($request->user() && $request->user()->status !== 'active') {
        Auth::logout();
        return redirect('/login')->with('error', 'Akun Anda belum aktif.');
    }
    return $next($request);
}

// SetActiveYear: default session['active_year'] = current year
public function handle($request, Closure $next)
{
    if (!session('active_year')) {
        session(['active_year' => date('Y')]);
    }
    return $next($request);
}
```

---

## 6. Email & Notification

### 6.1 Mail Driver
- **Development:** `log` (cek di `storage/logs/laravel.log`).
- **Production:** `smtp` dengan kredensial email RSGM (setup oleh admin IT RSGM).
- Library: Laravel Mail (Mailable classes).

### 6.2 Notification Channels
- **In-app** (Laravel Notifications + table `notifications`).
- **Email** (untuk approval penting & reset password).

### 6.3 Queue
- **Database driver** (table `jobs`).
- Worker: Supervisor process (`supervisord` di production).
- Command: `php artisan queue:work`.

---

## 7. Build & Deploy Tools

### 7.1 Development
```bash
# All-in-one (server + queue + vite)
composer run dev

# Atau manual:
php artisan serve                # Laravel dev server (port 8000)
php artisan queue:work           # Queue worker
npm run dev                     # atau bun run dev (Vite HMR)
```

### 7.2 Production Build
```bash
npm run build                   # Vite production build (bun)
# atau
bun run build

# Laravel optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### 7.3 CI/CD (Opsional, fase 2)
- GitHub Actions untuk run test + pint + build.
- Manual deploy ke server on-premise (rsync / git pull).

---

## 8. Testing Strategy

### 8.1 Backend (Pest 3)
- **Unit tests:** Services (NomorSuratGenerator, PdfGenerator, dll).
- **Feature tests:**
  - Auth flow (login, register, logout, password reset).
  - Surat masuk CRUD + authorization.
  - Surat keluar CRUD + approval flow.
  - Disposisi flow (multi-level).
  - Pelayanan flow.
  - Notifikasi trigger.
- **Coverage target:** 70% (services & critical flows).
- **Run:** `php artisan test --compact`.

### 8.2 Frontend (Vitest + React Testing Library)
- **Component tests:** Forms, tables, dialogs.
- **Hook tests:** useNotifications, useDebounce, usePermissions.
- **Integration tests:** Halaman dengan mock Inertia.
- **Coverage target:** 50% (focused pada logic components).

### 8.3 E2E (Opsional, fase 2)
- Playwright untuk smoke test full flow.

---

## 9. Monitoring & Logging

### 9.1 Application Logging
- **Laravel Log** ke `storage/logs/laravel.log`.
- **Channel:** `stack` (single + daily).
- **Level:** `debug` (dev), `info` (prod).

### 9.2 Error Tracking
- Fase 1: Manual cek log.
- Fase 2: Sentry atau Bugsnag integration.

### 9.3 Performance Monitoring
- Fase 1: Laravel Telescope (dev only).
- Fase 2: New Relic / Blackfire.

---

## 10. Versioning & Compatibility

| Component | Min Version | Rec Version | Notes |
|---|---|---|---|
| PHP | 8.2.0 | 8.2.28 | Wajib 8.2+. |
| MySQL | 8.0 | 8.0.x | Untuk JSON support optimal. |
| Node | 18.x | 20.x LTS | Untuk Vite + Bun. |
| Bun | 1.0 | 1.1+ | Untuk package manager JS. |
| Composer | 2.5 | 2.7+ | Standar. |
| Nginx | 1.20 | 1.24+ | Untuk production. |
| Laravel | 12.0 | 12.x | Framework utama. |
| React | 18.0 | 18.3+ | Concurrent features. |

---

## 11. Security Stack

| Concern | Solusi |
|---|---|
| Password storage | Bcrypt (Laravel default). |
| CSRF | Laravel CSRF middleware + Inertia token. |
| XSS | React auto-escape + DOMPurify untuk rich text. |
| SQL Injection | Eloquent ORM + parameter binding. |
| File upload validation | MIME type check + extension check + size limit. |
| Session security | HTTPS-only cookies + SameSite=Lax + HttpOnly. |
| Rate limiting | Laravel throttle middleware. |
| Brute force protection | Login throttle (5 attempts/menit). |
| Audit trail | Custom AuditLog model + Observers. |
| HTTPS | Wajib di production (Let's Encrypt atau self-signed internal). |

---

## 12. Third-Party Integrations

**Tidak ada integrasi eksternal di fase 1.** Semua fitur self-contained.

Jika fase 2 menambah:
- **Email SMTP** (RSGM's mail server)
- **Cloud storage** (optional, S3-compatible)
- **WhatsApp gateway** (optional, untuk notif)

---

**Dokumen ini menjadi acuan teknis. Untuk struktur kode detail dan patterns, lihat BACKEND_STRUCTURE.md dan FRONTEND_GUIDELINES.md.**
