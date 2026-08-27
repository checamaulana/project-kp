# Application Flow (APP_FLOW)
## SIM SURAT RSGM UNIMUS

**Versi:** 1.0
**Tanggal:** 2026-08-27
**Referensi:** PRD.md, TECH_STACK.md, FRONTEND_GUIDELINES.md, BACKEND_STRUCTURE.md

---

## 1. Arsitektur Aplikasi (Gambaran Besar)

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                            │
│   Chrome / Edge / Firefox — Desktop & Mobile Responsive         │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NGINX (Reverse Proxy)                           │
│                  SSL Termination, Static Files                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              LARAVEL 12 APPLICATION (PHP-FPM 8.2)                │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │   Routes     │  Middleware  │  Controllers │  Inertia SSR │  │
│  │  (web.php)   │  (auth,role) │  (Actions)   │  (Optional)  │  │
│  └──────┬───────┴──────┬───────┴──────┬───────┴──────┬───────┘  │
│         │              │              │              │           │
│  ┌──────▼──────────────▼──────────────▼──────────────▼───────┐  │
│  │             Domain Services (Eloquent + Business Logic)   │  │
│  │   SuratService, DisposisiService, PelayananService, etc.  │  │
│  └──────┬──────────────┬──────────────┬──────────────┬───────┘  │
│         │              │              │              │           │
│  ┌──────▼──────────────▼──────────────▼──────────────┬───────┐  │
│  │   Eloquent Models (User, Unit, SuratMasuk, etc.)  │       │  │
│  └──────┬────────────────────────────────────────────┘       │  │
└─────────┼──────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MySQL 8.0                                 │
│  Tables: users, units, surat_masuk, surat_keluar, disposisi,    │
│          permintaan_pelayanan, audit_logs, notifications, ...  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              LOCAL FILE STORAGE (storage/app/private/)           │
│  /surat/{tahun}/{nomor_surat}.pdf                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Alur Autentikasi & Otorisasi

### 2.1 Alur Registrasi (Public Form)

```
┌──────────┐         ┌──────────┐         ┌──────────────┐         ┌──────────────┐
│  User    │         │  Form    │         │   Laravel    │         │  Superadmin  │
│ (belum   │         │ Register │         │   Backend    │         │              │
│ daftar)  │         │          │         │              │         │              │
└────┬─────┘         └────┬─────┘         └──────┬───────┘         └──────┬───────┘
     │                    │                      │                       │
     │ 1. Buka            │                      │                       │
     │ /register          │                      │                       │
     ├───────────────────►│                      │                       │
     │                    │                      │                       │
     │ 2. Isi form        │                      │                       │
     │ (username, nama,   │                      │                       │
     │ email, password,   │                      │                       │
     │ unit, role)        │                      │                       │
     ├───────────────────►│                      │                       │
     │                    │                      │                       │
     │                    │ 3. POST /register    │                       │
     │                    ├─────────────────────►│                       │
     │                    │                      │                       │
     │                    │                      │ 4. Validate           │
     │                    │                      │ 5. Create user        │
     │                    │                      │    status=pending     │
     │                    │                      │ 6. Send notif         │
     │                    │                      ├──────────────────────►│
     │                    │                      │                       │
     │                    │ 7. Return "Pendaftaran berhasil,        │
     │                    │    menunggu approval"  │                       │
     │                    │◄─────────────────────┤                       │
     │                    │                      │                       │
     │ 8. Tampil pesan    │                      │                       │
     │◄───────────────────┤                      │                       │
     │                    │                      │                       │
     │                    │                      │              9. Admin buka
     │                    │                      │              /admin/users/pending
     │                    │                      │              Review data
     │                    │                      │              Klik "Approve"
     │                    │                      │              atau "Reject"
     │                    │                      │              ◄──────────┤
     │                    │                      │                       │
     │                    │                      │ 10. Update status     │
     │                    │                      │     user=active       │
     │                    │                      │ 11. Send email        │
     │                    │                      │     "Akun disetujui"  │
     │                    │                      ├──────────────────────►│
     │ 12. Email notif    │                      │                       │
     │◄─────────────────────────────────────────┤                       │
     │                    │                      │                       │
     │ 13. Login pakai    │                      │                       │
     │ username/password  │                      │                       │
     ├───────────────────────────────────────►│                       │
     │                    │                      │ 14. Auth success      │
     │                    │                      │ 15. Redirect /dashboard│
     │◄─────────────────────────────────────────┤                       │
     │                    │                      │                       │
```

### 2.2 Alur Login

```
User → /login → Isi username + password → POST /login
  → Validasi (Laravel default auth)
  → Cek status user = 'active'
  → Buat session (regenerate session ID)
  → Set session['active_year'] = current year
  → Set session['active_unit_id'] = user.unit_id
  → Redirect ke /dashboard
```

### 2.3 Alur Logout

```
User klik tombol Logout → POST /logout
  → Invalidate session
  → Regenerate CSRF token
  → Redirect ke /login
```

### 2.4 Middleware Stack (sesuai urutan eksekusi)

```
Global:
1. EncryptCookies
2. AddQueuedCookiesToResponse
3. StartSession
4. ShareErrorsFromSession
5. VerifyCsrfToken
6. SubstituteBindings

Route Groups:
- /admin/* → 'auth', 'role:superadmin'
- /tu/* → 'auth', 'role:admin_tu|superadmin'
- /surat/* → 'auth', 'verified_unit'
- /pelayanan/* → 'auth'
- /notifications → 'auth'
- /profile → 'auth'
- /register, /login, / → guest middleware
```

---

## 3. Alur Modul Surat

### 3.1 Alur Tambah Surat Masuk

```
┌──────────────┐    ┌──────────────┐    ┌────────────────┐    ┌────────────┐
│  Admin TU /  │    │  Form Tambah │    │   SuratMasuk   │    │  Storage   │
│  Kepala Unit │    │  Surat Masuk │    │   Controller   │    │  (Local)   │
└──────┬───────┘    └──────┬───────┘    └────────┬───────┘    └─────┬──────┘
       │                   │                     │                  │
       │ 1. Klik menu      │                     │                  │
       │ "Surat Masuk"     │                     │                  │
       ├──────────────────►│                     │                  │
       │                   │                     │                  │
       │ 2. Tampil form    │                     │                  │
       │◄──────────────────┤                     │                  │
       │                   │                     │                  │
       │ 3. Isi field &    │                     │                  │
       │ upload file       │                     │                  │
       │                   │                     │                  │
       │ 4. Klik "Simpan"  │                     │                  │
       ├──────────────────►│                     │                  │
       │                   │ 5. POST /surat-     │                  │
       │                   │    masuk            │                  │
       │                   ├────────────────────►│                  │
       │                   │                     │                  │
       │                   │                     │ 6. Validate      │
       │                   │                     │    (FormRequest) │
       │                   │                     │ 7. Upload file   │
       │                   │                     ├─────────────────►│
       │                   │                     │                  │
       │                   │                     │ 8. Store file    │
       │                   │                     │    path in DB    │
       │                   │                     │ 9. Save record   │
       │                   │                     │ 10. Create       │
       │                   │                     │     AuditLog     │
       │                   │                     │ 11. Auto-generate│
       │                   │                     │     no_urut      │
       │                   │                     │ 12. Return       │
       │                   │                     │     success      │
       │                   │ 13. Redirect to     │                  │
       │                   │     /surat-masuk    │                  │
       │                   │     with flash msg  │                  │
       │                   │◄────────────────────┤                  │
       │ 14. Tampil        │                     │                  │
       │     notifikasi    │                     │                  │
       │◄──────────────────┤                     │                  │
       │                   │                     │                  │
```

### 3.2 Alur Disposisi (Multi-Route hingga Rektor ACC)

```
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ Surat    │  │  Staf    │  │ Kabag/   │  │ Wakil    │  │  Rektor  │  │  Target  │
│ Masuk    │  │  TU      │  │ Ka.Unit  │  │ Rektor   │  │  (ACC)   │  │  Unit    │
│ Tercatat │  │          │  │          │  │          │  │          │  │          │
└────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │             │             │             │
     │ 1. Surat    │             │             │             │             │
     │ masuk baru  │             │             │             │             │
     │             │             │             │             │             │
     │ 2. Disposisi│             │             │             │             │
     │ ke Staf TU  │             │             │             │             │
     ├────────────►│             │             │             │             │
     │ (Isi:       │             │             │             │             │
     │ "Tolong     │             │             │             │             │
     │ proses")    │             │             │             │             │
     │             │             │             │             │             │
     │             │ 3. Review & │             │             │             │
     │             │ disposisi   │             │             │             │
     │             │ ke Kabag    │             │             │             │
     │             ├────────────►│             │             │             │
     │             │             │             │             │             │
     │             │             │ 4. Review & │             │             │
     │             │             │ disposisi   │             │             │
     │             │             │ ke Warek    │             │             │
     │             │             ├────────────►│             │             │
     │             │             │             │             │             │
     │             │             │             │ 5. Review & │             │
     │             │             │             │ disposisi   │             │
     │             │             │             │ ke Rektor   │             │
     │             │             │             ├────────────►│             │
     │             │             │             │             │             │
     │             │             │             │             │ 6. ACC      │
     │             │             │             │             │             │
     │             │             │             │             │ 7. Forward  │
     │             │             │             │             │ ke unit     │
     │             │             │             │             │ target      │
     │             │             │             │             ├────────────►│
     │             │             │             │             │             │
     │             │             │             │             │ 8. Unit     │
     │             │             │             │             │ proses &    │
     │             │             │             │             │ arsipkan    │
     │             │             │             │             │             │
     │             │             │             │             │ 9. Status:  │
     │             │             │             │             │  Selesai    │
     │             │             │             │             │             │
     ▼             ▼             ▼             ▼             ▼             ▼
TIMELINE DISPOSISI (tersimpan di DB):
[2026-08-27 09:00] Dari: External → Kepada: Staf TU (Isi: "Tolong proses")
[2026-08-27 10:30] Dari: Staf TU → Kepada: Kabag (Isi: "Mohon ACC")
[2026-08-27 14:00] Dari: Kabag → Kepada: Warek (Isi: "Setuju, mohon approval")
[2026-08-27 15:30] Dari: Warek → Kepada: Rektor (Isi: "Mohon ACC final")
[2026-08-28 08:00] Dari: Rektor → Kepada: Unit Farmasi (Isi: "Disetujui, mohon ditindaklanjuti")
[2026-08-28 16:00] Status: Selesai (diarsipkan oleh Unit Farmasi)
```

### 3.3 Alur Approval Surat Keluar (Wajib Rektor)

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Admin TU /   │  │  Surat       │  │  Rektor      │  │  Status      │
│ Kepala Unit  │  │  Keluar DB   │  │  (Superadmin)│  │  Tracking    │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │                │
       │ 1. Submit draft │                  │                │
       │ POST /surat-    │                  │                │
       │ keluar          │                  │                │
       ├────────────────►│                  │                │
       │                 │ 2. status:       │                │
       │                 │    draft →       │                │
       │                 │    menunggu_acc  │                │
       │                 │ 3. Send notif    │                │
       │                 ├─────────────────►│                │
       │                 │                  │                │
       │                 │                  │ 4. Review di   │
       │                 │                  │ /approval/     │
       │                 │                  │ pending        │
       │                 │                  │                │
       │ 5. Email notif  │                  │                │
       │ "Surat keluar   │                  │                │
       │  submitted"     │                  │                │
       │◄────────────────┤                  │                │
       │                 │                  │                │
       │                 │                  │ 6a. Klik ACC   │
       │                 │                  │  → status:     │
       │                 │                  │    disetujui   │
       │                 │                  │ 6b. ATAU Klik  │
       │                 │                  │ Tolak + alasan │
       │                 │                  │  → status:     │
       │                 │                  │    ditolak     │
       │                 │                  │  → kembali ke  │
       │                 │                  │    draft       │
       │                 │                  │                │
       │ 7. Notif hasil  │                  │                │
       │ ACC/Tolak       │                  │                │
       │◄────────────────────────────────────┤                │
       │                 │                  │                │
       │ 8a. Jika ACC:   │                  │                │
       │ Tombol "Cetak   │                  │                │
       │ PDF" aktif      │                  │                │
       │ 8b. Jika Tolak: │                  │                │
       │ Edit & resubmit │                  │                │
       │                 │                  │                │
```

### 3.4 Alur Cetak Lembar Disposisi

```
User → Surat Masuk → Rincian → Klik "Cetak Lembar Disposisi"
  → GET /surat-masuk/{id}/cetak-disposisi
  → Controller ambil data: surat + timeline disposisi + info unit
  → Render view PDF (Blade template) dengan library DomPDF
  → Stream download file PDF
  → Audit log: "Cetak disposisi #XYZ"
```

---

## 4. Alur Modul Permintaan Pelayanan

### 4.1 Alur Pengajuan

```
Pengaju (semua role) → /pelayanan/create
  → Isi form (Judul, Jenis, Aplikasi, Detail, Lampiran)
  → POST /pelayanan
  → Validate (judul max 100 char, tidak diskrit, file opsional max 10MB)
  → Save record, status = 'waiting'
  → Notif ke semua admin_tu + kepala_unit unit yang handle jenis pelayanan tsb
  → Redirect ke /pelayanan/{id} dengan flash success
  → Tampil rincian dengan badge "Waiting"
```

### 4.2 Alur Update Progress oleh Handler

```
Admin TU / handler (assigned) → /pelayanan/{id}
  → Klik "Tambah Progress"
  → Form: Komentar + Ubah Status (waiting/accepted/in_progress/rejected/closed)
  → POST /pelayanan/{id}/progress
  → Save progress record (table pelayanan_progress)
  → Update status pelayanan
  → Notif ke pengaju
  → Tampil di timeline Riwayat Progress
```

### 4.3 Tabel Status Pelayanan

| Status | Warna Badge | Deskripsi |
|---|---|---|
| `waiting` | Kuning (waiting) | Baru diajukan, belum ada handler. |
| `accepted` | Hijau (accepted) | Handler menerima tiket. |
| `in_progress` | Biru (in_progress) | Sedang dalam pengerjaan. |
| `rejected` | Merah (rejected) | Ditolak dengan alasan. |
| `closed` | Abu-abu (closed) | Tiket ditutup, diarsipkan. |

---

## 5. Alur Toggle Ganti Tahun

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│  User        │         │  Header      │         │  Daftar      │
│  (semua)     │         │  Dropdown    │         │  Surat/      │
│              │         │  Tahun       │         │  Rekap       │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ 1. Klik dropdown       │                        │
       │ Pilih tahun            │                        │
       ├───────────────────────►│                        │
       │                        │                        │
       │                        │ 2. POST /session/     │
       │                        │    set-year            │
       │                        │ 3. Save session[       │
       │                        │     active_year]       │
       │                        │                        │
       │                        │ 4. Inertia reload      │
       │                        │    with new prop       │
       │                        ├───────────────────────►│
       │                        │                        │
       │                        │ 5. List difilter       │
       │                        │    by active_year      │
       │                        │                        │
       │ 6. Daftar terupdate    │                        │
       │◄───────────────────────────────────────────────┤
       │                        │                        │
```

---

## 6. Alur Notifikasi In-App

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Event      │  │  Listener   │  │  Database    │  │  UI Header   │
│  Trigger    │  │  (Create    │  │  Table       │  │  (Bell Icon) │
│             │  │  Notif)     │  │ notifications│  │              │
└──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
       │                │                │                │
       │ Surat baru     │                │                │
       │ / Disposisi    │                │                │
       │ / Approval     │                │                │
       │ / Pelayanan    │                │                │
       │                │                │                │
       │ 1. Event fired │                │                │
       ├───────────────►│                │                │
       │                │ 2. Determine   │                │
       │                │    recipients  │                │
       │                │ 3. INSERT      │                │
       │                ├───────────────►│                │
       │                │                │                │
       │                │                │ 4. Polling     │
       │                │                │    every 30s   │
       │                │                ├───────────────►│
       │                │                │                │
       │                │                │ 5. GET         │
       │                │                │    /api/       │
       │                │                │    notifications│
       │                │                │    /unread     │
       │                │                │                │
       │                │                │ 6. Update bell │
       │                │                │    badge count │
       │                │                │◄───────────────┤
       │                │                │                │
       │                │                │ 7. If new,     │
       │                │                │    show toast  │
       │                │                │ "Surat baru    │
       │                │                │  dari..."      │
       │                │                │                │
```

### 6.1 Tipe Notifikasi

| Tipe | Trigger | Penerima |
|---|---|---|
| `surat_masuk_baru` | Surat masuk baru tercatat | Admin TU, Kepala Unit |
| `disposisi_baru` | Disposisi ditujukan ke user | User penerima disposisi |
| `disposisi_diteruskan` | Disposisi diteruskan oleh user | User asal disposisi (sebagai info) |
| `surat_keluar_approved` | Surat keluar disetujui Rektor | Pengaju surat |
| `surat_keluar_rejected` | Surat keluar ditolak Rektor | Pengaju surat |
| `pelayanan_baru` | Permintaan pelayanan baru | Admin TU, Kepala Unit terkait |
| `pelayanan_progress` | Handler update progress | Pengaju pelayanan |
| `user_pending_approval` | User baru daftar | Semua superadmin |

---

## 7. Alur Audit Log

```
Setiap Create/Update/Delete di model:
  User → Controller → Eloquent save
    → Observer (SuratMasukObserver, etc.)
    → AuditLogger::log('update', $model, $oldValues, $newValues)
    → INSERT INTO audit_logs (user_id, action, model_type, model_id, before, after, ip, user_agent, created_at)

View Audit Log (superadmin only):
  /admin/audit-logs
    → Filter: user, action, model, date range
    → Pagination
    → Detail: show before/after diff in modal
```

---

## 8. State Diagram

### 8.1 State Surat Masuk

```
   ┌─────────┐
   │  (new)  │
   └────┬────┘
        │ Simpan
        ▼
   ┌─────────┐  Ubah   ┌─────────┐
   │  Aktif  ├────────►│  Aktif  │
   │         │◄────────┤         │
   └────┬────┘  Simpan └─────────┘
        │
        │ Buat Disposisi
        ▼
   ┌─────────┐  Di-Disposisi  ┌─────────┐
   │  Aktif  ├───────────────►│  On     │
   │         │                │  Route  │
   └────┬────┘                └────┬────┘
        │                            │
        │                            │ Rektor ACC + arsipkan
        │                            ▼
        │                       ┌─────────┐
        │                       │  Selesai│
        │                       └─────────┘
        │ Hapus (soft)
        ▼
   ┌─────────┐  Restore (≤30 hari)  ┌─────────┐
   │  Trash  ├─────────────────────►│  Aktif  │
   │         │                       └─────────┘
   └────┬────┘
        │ 30 hari lewat (cron)
        ▼
   ┌─────────┐
   │ Purged  │ (permanent delete)
   └─────────┘
```

### 8.2 State Surat Keluar

```
   ┌─────────┐
   │  Draft  │
   └────┬────┘
        │ Submit
        ▼
   ┌──────────────┐  Tolak+alasan  ┌─────────┐
   │ Menunggu_ACC ├───────────────►│  Draft  │ (revisi)
   │              │◄───────────────┤         │
   └────┬─────────┘                └─────────┘
        │ ACC
        ▼
   ┌──────────────┐  Kirim keluar (off-system)
   │  Disetujui   ├────────────────────► (Done)
   └──────────────┘
```

### 8.3 State Permintaan Pelayanan

```
   ┌─────────┐  Handler terima    ┌──────────┐
   │ Waiting ├───────────────────►│ Accepted │
   └────┬────┘                    └────┬─────┘
        │                              │ Mulai kerja
        │ Tolak langsung               ▼
        │                        ┌──────────────┐
        ▼                        │ In Progress  │
   ┌─────────┐                  └──────┬───────┘
   │Rejected │                         │ Selesai
   └─────────┘                         ▼
                                  ┌─────────┐
                                  │ Closed  │
                                  └─────────┘
```

---

## 9. Sitemap / Struktur Halaman

```
/                          → Redirect ke /login atau /dashboard
/login                     → Form login
/register                  → Form registrasi publik
/forgot-password           → Form input email
/reset-password/{token}    → Form reset password

(dashboard - auth)
/dashboard                 → Dashboard: statistik ringkas + 5 notif terbaru
/profile                   → Edit profil + ganti password

(surat)
/surat-masuk               → Daftar surat masuk
/surat-masuk/create        → Form tambah surat masuk
/surat-masuk/{id}          → Rincian + timeline disposisi
/surat-masuk/{id}/edit     → Form ubah
/surat-masuk/{id}/cetak-disposisi → Generate PDF lembar disposisi

/surat-keluar              → Daftar surat keluar
/surat-keluar/create       → Form tambah surat keluar
/surat-keluar/{id}         → Rincian + status approval
/surat-keluar/{id}/edit    → Form ubah (hanya jika status draft/ditolak)
/surat-keluar/{id}/cetak   → Generate PDF surat keluar

/disposisi                 → Daftar disposisi (semua yang terkait user)
/disposisi/{id}            → Rincian disposisi

/rekap                     → Menu rekap (sub-menu: masuk/keluar/disposisi)
/rekap/surat-masuk         → Rekap surat masuk
/rekap/surat-keluar        → Rekap surat keluar
/rekap/disposisi           → Rekap disposisi

(pelayanan)
/pelayanan                 → Daftar permintaan pelayanan
/pelayanan/create          → Form ajukan pelayanan
/pelayanan/{id}            → Rincian + riwayat progress
/pelayanan/{id}/progress   → Form tambah progress (handler)

(notifikasi)
/notifications             → Pusat notifikasi (semua notif user)

(admin - superadmin only)
/admin/users               → Daftar user
/admin/users/create        → Form tambah user
/admin/users/{id}/edit     → Form ubah user
/admin/users/pending       → Daftar user pending approval

/admin/units               → CRUD unit
/admin/roles               → View only (4 role fixed)
/admin/kode-surat          → CRUD kode surat
/admin/indeks              → CRUD indeks

/admin/audit-logs          → Audit log
/admin/notifications       → Broadcast notifikasi (jika perlu)

(approval)
/approval/pending          → Daftar surat keluar menunggu ACC (Rektor)
/approval/{id}             → Rincian + tombol ACC/Tolak
```

---

## 10. RBAC Matrix (Role-Based Access Control)

| Fitur / Route | superadmin | admin_tu | kepala_unit | staf |
|---|:---:|:---:|:---:|:---:|
| **Manajemen User** | | | | |
| Lihat daftar user | ✅ | ❌ | ❌ | ❌ |
| Tambah user | ✅ | ❌ | ❌ | ❌ |
| Approve user pending | ✅ | ❌ | ❌ | ❌ |
| **Master Data** | | | | |
| Kelola unit | ✅ | ❌ | ❌ | ❌ |
| Kelola kode surat | ✅ | ❌ | ❌ | ❌ |
| Kelola indeks | ✅ | ❌ | ❌ | ❌ |
| **Surat Masuk** | | | | |
| Lihat daftar (semua unit) | ✅ | ✅ | Unit-nya | Unit-nya |
| Tambah | ✅ | ✅ | ✅ | ✅ |
| Ubah | ✅ | ✅ | ✅ (unit-nya) | ❌ |
| Hapus | ✅ | ✅ | ❌ | ❌ |
| Restore dari Trash | ✅ | ✅ | ❌ | ❌ |
| **Surat Keluar** | | | | |
| Buat draft | ✅ | ✅ | ✅ (unit-nya) | ❌ |
| Submit approval | ✅ | ✅ | ✅ | ❌ |
| ACC / Tolak (Rektor) | ✅ | ❌ | ❌ | ❌ |
| Cetak PDF (jika ACC) | ✅ | ✅ | ✅ | ❌ |
| **Disposisi** | | | | |
| Buat disposisi | ✅ | ✅ | ✅ | ✅ |
| ACC / Tolak | ✅ | ✅ | ✅ | ✅ |
| Cetak lembar disposisi | ✅ | ✅ | ✅ | ✅ |
| **Rekap** | | | | |
| Lihat rekap global | ✅ | ✅ | Unit-nya | Unit-nya |
| Export Excel/PDF | ✅ | ✅ | ✅ | ❌ |
| **Pelayanan** | | | | |
| Ajukan | ✅ | ✅ | ✅ | ✅ |
| Lihat semua | ✅ | ✅ | Unit-nya | Miliknya |
| Handle / Update progress | ✅ | ✅ | ✅ | ✅ |
| **Notifikasi** | | | | |
| Terima notif sendiri | ✅ | ✅ | ✅ | ✅ |
| Broadcast notif | ✅ | ❌ | ❌ | ❌ |
| **Audit Log** | | | | |
| Lihat audit log | ✅ | ❌ | ❌ | ❌ |
| **Toggle Ganti Tahun** | ✅ | ✅ | ✅ | ✅ |

---

## 11. Error Handling & Edge Cases

### 11.1 Validasi Form
- Server-side validation (FormRequest) WAJIB untuk semua form.
- Client-side validation (HTML5 + shadcn/ui Form) sebagai UX enhancement, bukan pengganti server.
- Pesan error dalam Bahasa Indonesia.

### 11.2 HTTP Error Codes
| Kode | Kasus | Handling |
|---|---|---|
| 401 | Unauthenticated | Redirect ke /login |
| 403 | Unauthorized (role) | Halaman 403 dengan pesan "Anda tidak memiliki akses." |
| 404 | Resource not found | Halaman 404 generik |
| 422 | Validation error | Kembali ke form dengan error per-field |
| 500 | Server error | Halaman 500 generik, log error ke storage/logs |

### 11.3 Konflik Data
- **Optimistic locking pada disposisi:** Cek `updated_at` saat update disposisi. Jika sudah berubah, tampil pesan "Data sudah diubah oleh user lain. Silakan refresh."
- **Concurrent edit surat keluar:** Sama dengan di atas.

### 11.4 File Upload
- File terlalu besar (>10MB): Tolak dengan pesan.
- File tipe salah (bukan PDF/JPG/PNG): Tolak dengan pesan.
- Upload gagal (network/storage): Tampilkan error, data tidak tersimpan.
- File corrupt saat download: Tampilkan halaman "File tidak bisa dibuka, hubungi admin."

---

## 12. Performance & Caching

### 12.1 Database Query Optimization
- **Eager loading:** Selalu gunakan `with()` untuk relasi (hindari N+1).
- **Index:** Index pada kolom foreign key, kolom yang sering di-filter (status, tanggal, unit_id), dan kolom search (pengirim, perihal).
- **Pagination:** Semua daftar menggunakan `paginate()` (default 25 per page).
- **Select specific columns:** Hindari `SELECT *` jika tidak perlu.

### 12.2 Application Cache
- **Master data** (units, indeks, kode surat): Cache 1 jam (`Cache::remember`).
- **Notifikasi unread count:** Cache 30 detik per user.
- **Rekap statistics:** Cache 5 menit.

### 12.3 Frontend Optimization
- **Lazy load images:** Untuk lampiran file preview.
- **Debounce search input:** 300ms.
- **Inertia deferred props:** Untuk data yang tidak critical (mis: statistik dashboard).
- **Vite build:** Production build dengan minification.

---

## 13. Security Flow

### 13.1 CSRF Protection
- Semua form POST wajib ada `@csrf` token (auto-generated via Inertia).
- Token di-rotate setiap session login.

### 13.2 SQL Injection Prevention
- Gunakan Eloquent ORM atau Query Builder dengan parameter binding.
- **JANGAN** pernah gunakan raw SQL dengan string concatenation.

### 13.3 XSS Prevention
- React auto-escape by default untuk text content.
- Untuk `dangerouslySetInnerHTML` (rich text Pelayanan), sanitize dengan library `DOMPurify`.

### 13.4 File Upload Security
- Whitelist MIME type: `application/pdf`, `image/jpeg`, `image/png`.
- Validasi extension (`.pdf`, `.jpg`, `.jpeg`, `.png`).
- Simpan dengan nama random (hash) untuk hindari path traversal.
- Akses file via route controller dengan authorization check (bukan direct URL).

### 13.5 Rate Limiting
- Endpoint login: 5 attempts/menit per IP.
- Endpoint register: 3 attempts/menit per IP.
- API endpoints: 60 requests/menit per user.

---

## 14. Deployment Flow

### 14.1 Local Development
```
1. Clone repo
2. composer install
3. npm install (via bun)
4. cp .env.example .env
5. php artisan key:generate
6. php artisan migrate --seed
7. composer run dev (jalankan server + queue + vite)
```

### 14.2 Production Deployment (On-Premise)
```
1. Pull code di server RSGM (via git)
2. composer install --optimize-autoloader --no-dev
3. npm install && npm run build
4. php artisan migrate --force
5. php artisan config:cache
6. php artisan route:cache
7. php artisan view:cache
8. php artisan storage:link
9. Setup cron: * * * * * php artisan schedule:run
10. Setup supervisor untuk queue worker
11. Restart php-fpm & nginx
```

### 14.3 Backup Strategy
- **Database:** `mysqldump` harian jam 02:00, retensi 30 hari.
- **Storage:** `rsync storage/app/private/` mingguan ke backup server.
- **Restore procedure:** Dokumentasi di README deployment.

---

**Dokumen ini menjelaskan alur lengkap aplikasi. Untuk detail teknis implementation, lihat BACKEND_STRUCTURE.md dan FRONTEND_GUIDELINES.md.**
