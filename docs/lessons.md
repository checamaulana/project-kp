# Lessons Learned — SIM SURAT RSGM UNIMUS

## 2026-08-28 — Implementation Phase

### Key Insights

1. **Migration file conflict**: When multiple `php artisan make:migration` runs happen at the same minute, filenames collide. Always check for existing files first.
2. **Middleware alias 'active' must be registered**: Laravel 12 requires explicit alias for `auth:active` middleware pattern to work in tests. Without it, `Target class [active] does not exist` error.
3. **Inertia + Wayfinder**: Auto-generated routes in `@/actions` and `@/routes` work seamlessly.
4. **Vite v7 with Wayfinder**: Builds successfully, no issues with route generation during build.
5. **Modul Pelayanan → IT Helpdesk**: User showed new screenshot clarifying scope is simple 2-page IT helpdesk.

### Best Practices Applied

- **Service layer pattern**: All business logic in dedicated services
- **Enum-backed enums**: PHP 8.1+ backed enums for type safety
- **FormRequest classes**: All validation in dedicated request classes
- **Policy classes**: Authorization via policies
- **Observer pattern**: Audit logging via model observers
- **Soft deletes**: Surat tables use `SoftDeletes` trait for 30-day recovery

### Common Pitfalls to Avoid

- Don't forget to register middleware aliases in `bootstrap/app.php` for `auth:custom` to work
- Don't use `Pelayanan` model — it was replaced with `HelpdeskTicket`
- For PUT/PATCH with file, use `post(url, { _method: 'put', forceFormData: true })` workaround
- Make sure all relations use proper foreign key names (e.g., `unit_penerima_id`, `kepada_user_id`)

### Things That Could Be Improved

1. **Email notifications**: Currently only `database` channel, not `mail`. Add SMTP config for production.
2. **Tipe `any`**: Sebagian sudah diperbaiki (Rekap, Disposisi/Show, Admin Edits, SuratKeluar/Edit). Sisa `any` di beberapa file + noise typing `setData`/`ButtonLink href` dari @inertiajs/react v2 (tidak merusak `vite build`, hanya `tsc --noEmit`).
3. **Tests coverage**: Auth + 10 regression tests (BugfixRegressionTest). Helpdesk/Surat flow E2E via browser belum ada.
4. **File upload validation**: Could add virus scanning, image dimension checks.
5. **Dashboard charts**: ActivityChart/DonutChart/tren KPI/target masih data dummy hardcoded — perlu endpoint analitik bila ingin real.

### ⚠️ CORRECTED 2026-09-04: `_method` Harus di DATA, Bukan di Options

Koreksi atas pitfall lama ("For PUT/PATCH with file, use `post(url, { _method: 'put', forceFormData: true })`"): argumen kedua `post()` pada `useForm` adalah **visit options**, BUKAN data — sehingga `_method` di options **tidak pernah terkirim** ke server dan submit Edit selalu 405. Pola yang benar:

```tsx
// ❌ WRONG — _method hilang, server terima POST polos → 405
post(`/surat-masuk/${id}`, { forceFormData: true, _method: 'put' });

// ✅ CORRECT — _method ikut di body FormData → Laravel spoof jadi PUT
const { post } = useForm({ _method: 'put' as const /* ...fields */ });
post(update({ surat_masuk: id }).url, { forceFormData: true });
```

Aturan yang sama berlaku untuk `YearToggle`: `post(url, { year })` pada `useForm` tidak mengirim data — gunakan `router.post(url, { year })`.

### Bugfix Sweep 2026-09-04 (ringkas, detail di progress.txt)

- `SuratKeluar`: relasi diganti `creator/approver` → `createdBy/approvedBy` + tambah `isEditable()/isApprovable()` (sebelumnya index/show/approve/reject 500).
- `ProfileController`: tambah `use Password;` (ganti password 500).
- `StatusUserEnum`: tambah `values()/options()` (update user admin 500).
- Fitur Lupa Password diimplementasi penuh (controller + route + halaman + link login) — sebelumnya route mati.
- `DisposisiStoreRequest`: hapus rule `surat_masuk_id` wajib (form selalu 422).
- `SuratMasukController::restore`: authorize pakai instance trashed, bukan class-string.
- Migrasi `fix_unique_and_foreign_keys`: unique surat keluar jadi per (tahun, unit, no_urut); FK unit/user destruktif jadi `restrict`.
- Guards: approve/reject hanya dari `menunggu_acc`; transisi helpdesk tervalidasi; approve/reject user hanya saat pending; proteksi hapus unit terpakai & superadmin terakhir & demosi diri.
- Frontend: YearToggle, preview nomor CSRF, filter tanggal/audit, status rekap, Pending approve+konfirmasi, pagination Rekap/Disposisi, JSON.parse aman, state komentar terpisah, fallback '-', ST section reaktif, semua URL hardcoded → Wayfinder, `canProcess/canFinish/canClose` dikirim ke Helpdesk/Show, counter dashboard real.

### ⚠️ CRITICAL 2026-09-04: Relasi Eloquent Terserialisasi snake_case (halaman putih)

**Gejala:** Setelah simpan surat masuk → redirect ke rincian → halaman putih total. Log browser: `TypeError: Cannot read properties of undefined (reading 'nama') at SuratMasukShow`.

**Root cause:** Laravel men-snake_case-kan key relasi di `toArray()` (`HasAttributes::$snakeAttributes = true`, lihat `relationsToArray()`). Jadi Inertia menerima `unit_penerima`, `dari_user`, `kepada_user`, `kepada_unit`, `unit_pembuat`, `created_by`, `approved_by`, `surat_masuk`, `kode_surat` — BUKAN camelCase. Hampir semua halaman Show/Index memakai `surat.unitPenerima.nama`, `d.dariUser.name`, `surat.createdBy.name`, dll → `undefined.nama` → React crash → blank page. Halaman yang kebetulan pakai snake_case (Index, Rekap) lolos.

**Aturan:** Di semua file `resources/js/pages/**`, akses relasi model HARUS snake_case + guard optional chaining (`surat.unit_penerima?.nama ?? '-'`). Satu-satunya pengecualian: relasi satu kata (`creator`, `indeks`, `unit`, `pelapor`, `handler`). Jangan percaya interface TS lokal — verifikasi key aktual via `Model::toArray()` di tinker.

### ⚠️ CRITICAL: No Global `route()` Helper

**Never use `route('xxx')` global helper in this project.** This project uses **Wayfinder** which generates type-safe route imports in `@/actions/*` and `@/routes/*`. Using the global `route()` (Ziggy-style) will fail with `ReferenceError: route is not defined` and the React tree will not render, producing a blank page.

**Always** import from Wayfinder:

```tsx
// ❌ WRONG — produces blank page
import { Link } from '@inertiajs/react';
<Link href={route('dashboard')}>Dashboard</Link>;

// ✅ CORRECT — use Wayfinder
import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
<Link href={dashboard.url()}>Dashboard</Link>;
```

For Inertia `post()`, `patch()`, etc. (from `useForm`):

```tsx
// ❌ WRONG
post(route('login'));

// ✅ CORRECT
post(login.url());
```

Files that need Wayfinder imports when adding new routes:

- Any page in `resources/js/pages/**`
- Any component in `resources/js/components/**`
- Common components (AppLayout, Header, Sidebar, YearToggle, NotificationBell)

---

## 2026-08-28 — `Button asChild` Causes Base UI Error #31 (Blank Page)

### Bug

The "Super Admin" user dropdown in the header caused the page to **turn blank** when clicked. Browser console showed:

```
Base UI error #31
MenuGroupContext is missing. Menu group parts must be used within <Menu.Group> or <Menu.RadioGroup>.
```

### Root Cause

The project uses `@base-ui/react` (NOT Radix UI). The base-ui `Button` primitive does **not** support the Radix-style `asChild` prop. The code was using:

```tsx
<DropdownMenuTrigger asChild>
    <Button variant="ghost" className="gap-2">
        <Avatar />
    </Button>
</DropdownMenuTrigger>
```

This rendered invalid HTML: `<button><button>...</button></button>` (nested buttons). When clicked, base-ui threw error #31 and the React tree crashed, making the page blank.

The same pattern (`<Button asChild><Link>...</Link></Button>`) was used in 19+ files across the codebase, producing nested `<button><a>...</a></button>` HTML that broke the link click and made the link unclickable.

### Fix

1. Removed all `<Button asChild>` patterns from the codebase
2. Created dedicated `ButtonLink` and `ButtonAnchor` components that render proper `<a>` elements (via Inertia `Link` for SPA navigation, plain `<a>` for downloads/external links)
3. Updated `Header.tsx` to use the base-ui pattern: pass `className` directly to `DropdownMenuTrigger` (which renders its own button) and use the `render` prop for `DropdownMenuItem` to swap the underlying element
4. Wrapped the `DropdownMenuLabel` in `DropdownMenuGroup` to satisfy base-ui's `MenuGroupContext` requirement

### Components

[`resources/js/components/ui/button.tsx`](resources/js/components/ui/button.tsx) exports three button primitives:

- `Button` — plain `<button>` (no asChild)
- `ButtonLink` — Inertia `<Link>` styled as button (renders as `<a>` for SPA navigation)
- `ButtonAnchor` — plain `<a>` styled as button (for downloads, target="\_blank", external links)

### Usage

```tsx
// ❌ WRONG — broken, link inside button
<Button asChild>
  <Link href="/somewhere">Click me</Link>
</Button>

// ✅ CORRECT — for Inertia links
<ButtonLink href="/somewhere">Click me</ButtonLink>

// ✅ CORRECT — for plain anchors
<ButtonAnchor href="/file.pdf" target="_blank">Download</ButtonAnchor>

// ✅ CORRECT — dropdown trigger with base-ui
<DropdownMenuTrigger className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2')}>
  <Avatar />
  <span>User</span>
</DropdownMenuTrigger>

// ✅ CORRECT — dropdown item with Link
<DropdownMenuItem render={<Link href="/profile" />}>
  <UserIcon />
  Profil
</DropdownMenuItem>
```

### Why base-ui Differs from Radix

- Radix uses `asChild` to merge the consumer's element with the trigger's behavior
- base-ui uses `render={<CustomElement />}` for the same purpose
- For base-ui `Menu.Trigger`, the trigger itself is always a `<button>` — pass `className` to style it directly, do NOT nest another button inside
