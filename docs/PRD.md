# Product Requirements Document (PRD)
## SIM SURAT RSGM UNIMUS

**Versi:** 1.0
**Tanggal:** 2026-08-27
**Owner:** Mahasiswa KP / Tim Pengembang
**Target user:** RSGM Universitas Muhammadiyah Semarang (UNIMUS)
**Stack:** Laravel 12 + Inertia.js 2 + React 18 + TypeScript + Tailwind + shadcn/ui + MySQL

---

## 1. Latar Belakang

Rumah Sakit Gigi dan Mulut (RSGM) UNIMUS saat ini masih menggunakan sistem manajemen surat manual/setengah-manual berbasis SIMSURAT lama. Proses pencatatan surat masuk, surat keluar, disposisi, dan rekap dilakukan secara terpisah sehingga:

- Sulit menelusuri posisi surat (di mana surat itu sekarang, siapa yang sedang menanganinya).
- Disposisi tidak tercatat rapi; rawan hilang/tidak terdokumentasi.
- Rekapitulasi bulanan/tahunan memakan waktu lama karena harus merekap ulang dari buku arsip.
- Tidak ada notifikasi otomatis saat ada surat/disposisi baru.
- Koordinasi antara unit, kepala unit, wakil rektor, dan rektor tidak terpusat.

**Tujuan produk:** Membangun sistem informasi manajemen surat RSGM UNIMUS yang terpusat, terdokumentasi, real-time, dan mudah digunakan oleh seluruh unit di RSGM.

---

## 2. Tujuan & Sasaran

### 2.1 Tujuan Bisnis
1. Mendigitalisasi seluruh alur surat masuk, keluar, disposisi, dan rekap RSGM UNIMUS.
2. Mengurangi waktu pencarian dan rekapitulasi surat dari rata-rata 30 menit menjadi < 2 menit.
3. Memastikan setiap surat memiliki jejak audit (audit trail) yang lengkap: siapa buat, siapa disposisi, kapan, isi disposisi apa.
4. Mempermudah approval Rektor atas surat keluar dengan alur yang jelas dan terdokumentasi.

### 2.2 Sasaran Pengguna
- **Staf TU RSGM:** Mencatat surat masuk/keluar, mengelola disposisi harian, generate rekap.
- **Kepala Unit:** Menerima disposisi, ACC/tolak, meneruskan ke bawahan, melihat rekap unit.
- **Wakil Rektor / Rektor:** Final approval surat keluar, ACC/tolak disposisi akhir, melihat rekap global.
- **Staf biasa:** Menerima disposisi, menindaklanjuti, mengarsipkan.
- **Admin (Superadmin):** Mengelola user, role, master data (unit, kode, indeks).

---

## 3. Ruang Lingkup

### 3.1 In-Scope (Fase 1 — MVP)
- Modul **Surat** (masuk, keluar, disposisi, rekap, cetak lembar disposisi).
- Modul **Permintaan Pelayanan** (helpdesk internal multi-jenis: IT, Umum, Medis, Pemeliharaan).
- Autentikasi (login username + password, role-based access, register + approval).
- Notifikasi in-app (lonceng di header).
- Master data: User, Unit, Role, Kode Surat, Indeks.
- Rekap dengan filter + export Excel & PDF.
- Cetak Lembar Disposisi (PDF landscape A4).

### 3.2 In-Scope (Fase 2)
- Modul **Pengadaan/Penawaran** (pencatatan surat penawaran dari vendor; bukan procurement cycle penuh).
- Multi-tahun (toggle ganti tahun arsip).
- Dashboard analitik (grafik jumlah surat per bulan).

### 3.3 Out-of-Scope (Tidak dibangun)
- Integrasi dengan SIMRS, e-Office UNIMUS, SSO kepegawaian.
- Aplikasi native mobile (Android/iOS). Sistem web-responsive saja.
- PWA offline.
- 2FA / multi-factor authentication.
- Multi-tenant (sistem single-tenant untuk RSGM UNIMUS saja).
- Migrasi data dari SIMSURAT lama (fresh start; data lama menjadi arsip fisik).

---

## 4. Personas & Role

### 4.1 Role Hierarchy
| Role | Kode | Akses |
|---|---|---|
| Superadmin | `superadmin` | Full akses. Kelola user, master data, semua modul. |
| Admin TU | `admin_tu` | Kelola surat masuk/keluar, disposisi, rekap. Tidak bisa kelola user/role. |
| Kepala Unit | `kepala_unit` | Approve surat dari unit-nya, terima disposisi, disposisi ke staf, lihat rekap unit. |
| Staf | `staf` | Catat surat, terima disposisi, arsipkan, ajukan permintaan pelayanan. |

### 4.2 Definisi Personas

#### Persona 1: Siti Aminah — Staf TU RSGM
- **Peran:** `admin_tu`
- **Unit:** Tata Usaha
- **Kebutuhan:** Mencatat surat masuk harian, membuat nomor surat keluar, mendisposisi ke kepala unit.
- **Pain point saat ini:** Input manual, nomor surat sering duplikat, disposisi via kertas fisik.

#### Persona 2: Dr. Arifah Pujiati — Kepala Unit IT
- **Peran:** `kepala_unit`
- **Unit:** IT Rumah Sakit
- **Kebutuhan:** Menerima disposisi, menyetujui, meneruskan ke staf, ACC surat keluar dari unit IT.
- **Pain point saat ini:** Kertas disposisi hilang, tidak ada tracking siapa yang sedang menindaklanjuti.

#### Persona 3: Prof. Dr. Budi Santoso — Rektor UNIMUS
- **Peran:** `superadmin` + approval override
- **Unit:** Pimpinan Universitas (bukan unit RSGM)
- **Kebutuhan:** Final approval semua surat keluar RSGM, ACC disposisi akhir, monitoring rekap global.
- **Pain point saat ini:** Harus tanda tangan fisik satu per satu; tidak bisa delegasi dengan rapi.

#### Persona 4: Andi Wijaya — Staf Poli Gigi
- **Peran:** `staf`
- **Unit:** Poli Gigi
- **Kebutuhan:** Menerima disposisi dari kepala unit, menindaklanjuti, mengajukan permintaan pelayanan IT.
- **Pain point saat ini:** Tidak tahu ada surat untuknya karena tidak ada notifikasi.

---

## 5. Fitur & Kebutuhan Fungsional

### 5.1 Autentikasi & Otorisasi

#### FR-AUTH-01: Registrasi Publik (dengan Approval)
- **Deskripsi:** User bisa daftar melalui form registrasi publik.
- **Field input:** Username (unique), Nama Lengkap, Email (unique), Password (min 8 char, konfirmasi), Unit (dropdown), **Role** (dropdown: Kepala Unit atau Staf saja; Superadmin & Admin TU hanya via superadmin).
- **Status awal:** `pending` (akun non-aktif).
- **Notifikasi ke superadmin:** Ada user baru pending.
- **Aksi superadmin:** Approve (ubah status ke `active`, assign role final) atau Reject (hapus akun).
- **Login:** Hanya akun `active` yang bisa login.

#### FR-AUTH-02: Login
- **Field:** Username + Password.
- **Validasi:** Username exists & akun `active` & password match.
- **Output:** Session login, redirect ke dashboard.
- **Error handling:** Pesan generik "Username atau password salah" (tidak bocorin apakah username ada).

#### FR-AUTH-03: Logout
- **Trigger:** Tombol logout di header.
- **Output:** Session dihapus, redirect ke halaman login.

#### FR-AUTH-04: Lupa Password
- **Flow:** Input email → sistem kirim link reset ke email (token berlaku 60 menit) → user set password baru.
- **Catatan:** Menggunakan Laravel default password reset.

#### FR-AUTH-05: Ganti Password (Sendiri)
- **Trigger:** Menu "Profil" → "Ganti Password".
- **Field:** Password lama, password baru, konfirmasi.
- **Validasi:** Password lama harus benar.

#### FR-AUTH-06: Role-Based Access Control
- Setiap route dilindungi middleware `role:<role>` atau `permission:<permission>`.
- Contoh: hanya `superadmin` yang bisa akses route `/admin/users`.
- UI: Menu yang tidak boleh diakses user di-hide (bukan disabled).

### 5.2 Modul Surat

#### 5.2.1 Surat Masuk

##### FR-SM-01: Tambah Surat Masuk
- **Akses:** `admin_tu`, `kepala_unit`, `staf` (semua role kecuali superadmin).
- **Field input:**
  - Tanggal Terima (date, default hari ini)
  - Tanggal Surat (date)
  - Nomor Surat (text, manual)
  - Pengirim (text, autocomplete dari history)
  - Perihal (text)
  - Keterangan (textarea, opsional)
  - Indeks (dropdown dari master indeks, opsional)
  - File Surat (upload PDF/JPG/PNG, max 10MB)
- **Validasi:** Tanggal Surat ≤ Tanggal Terima; File wajib.
- **Output:** Surat masuk tersimpan, nomor urut sistem tergenerate otomatis, redirect ke daftar dengan notifikasi sukses.
- **Auto-generate nomor urut:** Per-tahun, sequential, `0001, 0002, ...` (display only; bukan nomor surat resmi).

##### FR-SM-02: Daftar Surat Masuk
- **Filter:** Tanggal (range), Pengirim, Perihal (search), Indeks.
- **Pagination:** 10/25/50 per halaman.
- **Kolom:** No (urut), Tanggal Terima, Pengirim, Tanggal Surat, No Surat, Perihal, Indeks, **Aksi** (Ubah, Rincian, Buat Disposisi).
- **Hak akses:** User hanya melihat surat yang terkait dengan unit-nya ATAU yang di-disposisi ke unit-nya.

##### FR-SM-03: Ubah Surat Masuk
- **Trigger:** Tombol "Ubah" di daftar.
- **Field:** Sama dengan tambah, kecuali file (opsional replace).
- **Audit:** Perubahan dicatat di log aktivitas.

##### FR-SM-04: Rincian Surat Masuk
- **Trigger:** Tombol "Rincian" di daftar.
- **Tampilan:** Semua field surat + history disposisi (timeline) + history perubahan (audit log).
- **Aksi tambahan:** Cetak Lembar Disposisi (jika ada disposisi aktif).

##### FR-SM-05: Hapus Surat Masuk (Soft Delete)
- **Trigger:** Tombol "Hapus" (hanya `admin_tu` & `superadmin`).
- **Konfirmasi:** Modal "Apakah Anda yakin ingin menghapus? Data akan masuk ke Trash selama 30 hari."
- **Soft delete:** `deleted_at` di-set. Data bisa direstore dari Trash dalam 30 hari. Setelah 30 hari, sistem auto-purge via scheduled job.

#### 5.2.2 Surat Keluar

##### FR-SK-01: Tambah Surat Keluar
- **Akses:** `admin_tu`, `kepala_unit` (kepala unit hanya bisa untuk unit-nya).
- **Field input:**
  - Nomor Surat (auto-generate: `[KodeUnit]/[Indeks][NomorUrut]/[BulanRomawi]/[Tahun]`, bisa di-override)
  - Indeks (dropdown; **jika pilih "ST" → muncul field tambahan**: Tanggal Mulai Penugasan, Tanggal Selesai Penugasan, Penanda Tangan Surat, dan Kode hanya "KP" atau "KM"**)
  - Tanggal Surat (date)
  - Kepada (text, autocomplete)
  - Perihal (text)
  - Penanda Tangan Surat (text)
  - Tembusan (textarea, opsional)
  - Keterangan (textarea, opsional)
  - File Surat (upload, max 10MB)
- **Auto-generate format:** Contoh: `001/UNIMUS/Pan.S/KP/VII/2026` (untuk Surat Tugas, kode KP).
- **Bulan Romawi:** I, II, III, IV, V, VI, VII, VIII, IX, X, XI, XII.

##### FR-SK-02: Daftar Surat Keluar
- **Filter:** Tanggal (range), Kepada, Perihal, Indeks, Status Approval.
- **Kolom:** No, Tanggal Surat, Nomor Surat, Kepada, Perihal, Indeks, **Status** (Draft/Menunggu ACC/Disetujui/Ditolak), **Aksi**.

##### FR-SK-03: Approval Surat Keluar (Wajib Rektor)
- **Flow:**
  1. `admin_tu` atau `kepala_unit` buat surat keluar → status `draft`.
  2. Submit → status `menunggu_acc`, kirim notifikasi ke Rektor (superadmin) + Kepala Unit asal.
  3. Rektor (superadmin) review → ACC (status `disetujui`) atau Tolak (status `ditolak` + alasan).
  4. Jika ACC, surat siap kirim keluar (user bisa download/cetak).
  5. Jika Tolak, kembali ke `draft` dengan komentar penolakan, pengaju bisa revisi.
- **Notifikasi:** Setiap perubahan status kirim notifikasi in-app ke pengaju dan Rektor.

##### FR-SK-04: Generate PDF Surat Keluar
- **Trigger:** Tombol "Cetak PDF" di detail surat keluar yang sudah disetujui.
- **Output:** PDF A4 dengan kop RSGM, format surat resmi, tanda tangan digital Rektor (placeholder + tanda tangan image).
- **Library:** `barryvdh/laravel-dompdf` atau `spatie/laravel-pdf`.

#### 5.2.3 Disposisi Surat Masuk

##### FR-DISP-01: Buat Disposisi
- **Akses:** `admin_tu`, `kepala_unit`, `staf` (semua yang menerima surat).
- **Field input:**
  - Dari (auto: user yang sedang login)
  - Kepada (dropdown user/unit)
  - Isi Disposisi (textarea)
- **Default:** Alur **Staf → Atasan → Rektor (ACC)**. Multi-route hingga Rektor.
- **Catatan:** Pada Aksi "Diarsipkan" hanya untuk surat yang tidak dilanjutkan disposisinya.

##### FR-DISP-02: Tipe Aksi Disposisi
- **Di Disposisi:** Lanjutkan disposisi ke user/unit lain. Muncul field "Kepada" + "Isi Disposisi".
- **Di Arsipkan:** Tutup disposisi (tidak diteruskan). Hanya untuk surat yang tidak perlu ditindaklanjuti lebih lanjut. Status surat → `selesai`.

##### FR-DISP-03: Timeline Disposisi
- **Tampilan:** Rincian disposisi menunjukkan timeline kronologis: `Tanggal Jam - Dari (Kepada) - Status - Isi`.
- **Visual:** Card dengan icon (email untuk dikirim, check untuk ACC, X untuk ditolak).

##### FR-DISP-04: Notifikasi Disposisi
- Setiap disposisi baru → notifikasi in-app ke penerima.
- Setiap ACC/tolak dari Rektor → notifikasi ke pengaju awal + semua yang terkait di chain disposisi.

##### FR-DISP-05: Cetak Lembar Disposisi
- **Trigger:** Tombol "Cetak Lembar Disposisi" di detail surat.
- **Output:** PDF landscape A4 dengan:
  - Kop RSGM UNIMUS
  - Tanggal cetak
  - Info surat (Nomor, Pengirim, Tanggal, Perihal)
  - Tabel disposisi: Dari → Kepada → Isi → Tanda tangan
- **Library:** Sama dengan PDF surat keluar.

#### 5.2.4 Rekap Surat

##### FR-REK-01: Rekap Surat Masuk
- **Filter:** Tanggal range, Unit, Pengirim, Indeks.
- **Tampilan:** Tabel dengan total di footer (jumlah surat).
- **Export:** Excel (.xlsx) dan PDF.
- **Akses:** `admin_tu`, `kepala_unit` (unit-nya saja), `superadmin` (semua).

##### FR-REK-02: Rekap Surat Keluar
- Sama dengan REK-01, dengan field: Nomor Surat, Kepada, Status Approval, Tanggal ACC.

##### FR-REK-03: Rekap Disposisi
- Tabel disposisi: Surat (No, Perihal), Dari, Kepada, Isi, Status (Selesai/Menunggu/Diarsipkan), Tanggal.

### 5.3 Modul Permintaan Pelayanan

#### FR-PP-01: Ajukan Permintaan Pelayanan
- **Akses:** Semua role bisa ajukan.
- **Field:**
  - Judul Usulan (text, max 100 char, required, tidak boleh diskrit)
  - Jenis Pelayanan (dropdown: Pendaftaran, Rawat Jalan, Rawat Inap, Farmasi, Radiologi, dII)
  - Aplikasi (dropdown: Trouble / Permintaan Pengembangan Fitur / dII)
  - Detail Permintaan Pelayanan (rich text: Latar Belakang, Tujuan Usulan, Penjelasan Masalah, Contoh Kasus, Solusi yang Diinginkan)
  - File Lampiran (opsional, max 10MB per file, multiple)
- **Status awal:** `waiting` setelah klik "Kirim".

#### FR-PP-02: Daftar Permintaan Pelayanan
- **Filter:** Waktu, Jenis Pelayanan, Status, Pengirim.
- **Kolom:** No, Waktu, Jenis Pelayanan, Judul Usulan, Status, Pengirim, **Aksi** (Rincian).
- **Pagination:** 10/25/50 per halaman.
- **Akses:** User lihat miliknya; admin TU & kepala unit lihat semua unit-nya; superadmin lihat semua.

#### FR-PP-03: Rincian Permintaan Pelayanan
- **Tampilan:** Info pengajuan + Deskripsi Usulan + **Riwayat Progress** (timeline update dari handler).
- **Status badge:** Waiting (kuning) / Accepted (hijau) / Rejected (merah) / In Progress (biru).

#### FR-PP-04: Update Progress oleh Handler
- **Akses:** User yang di-assign sebagai handler oleh admin TU.
- **Field:** Komentar progress (textarea), Ubah status (next status).
- **Notifikasi:** Ke pengaju setiap update.

#### FR-PP-05: Tutup Permintaan
- **Trigger:** Handler atau pengaju close tiket.
- **Output:** Status `closed`, tiket diarsipkan.

### 5.4 Master Data

#### FR-MD-01: Kelola User (Superadmin)
- **Field:** Username, Nama Lengkap, Email, Password, Unit, Role, Status (active/pending/rejected).
- **Aksi:** Lihat, Tambah, Ubah, Hapus (soft), Approve/Reject (untuk status pending).

#### FR-MD-02: Kelola Unit (Superadmin)
- **Field:** Kode Unit (unique, max 10 char), Nama Unit, Keterangan.
- **Default unit RSGM UNIMUS:**
  - `TUS` — Tata Usaha
  - `IT` — IT Rumah Sakit
  - `PGI` — Poli Gigi
  - `PBM` — Poli Bedah Mulut
  - `RAD` — Radiologi
  - `FAR` — Farmasi
  - `LAB` — Laboratorium
  - `IGD` — Instalasi Gawat Darurat
  - `RI` — Rawat Inap
  - `KEU` — Keuangan
  - `PEM` — Pemeliharaan
  - `DOK` — Rekam Medis

#### FR-MD-03: Kelola Role (Superadmin)
- Hanya 4 role: `superadmin`, `admin_tu`, `kepala_unit`, `staf`. Tidak bisa tambah/hapus role.

#### FR-MD-04: Kelola Kode Surat (Superadmin)
- **Field:** Kode (mis: `UNIMUS`, `RSGM`), Keterangan.
- **Tujuan:** Untuk auto-generate nomor surat.

#### FR-MD-05: Kelola Indeks (Superadmin)
- **Field:** Kode Indeks (mis: `ST`, `SK`, `UND`), Nama Indeks.
- **Tambahan:** Jika kode = `ST`, hanya izinkan Kode Turunan `KP` (Keterangan Penugasan) atau `KM` (Keterangan Menghadiri).
- **Default indeks:** B, ST (KP/KM), SK, UND, PEM, NOTA, PENG, LAP, EDAR, REK.

### 5.5 Notifikasi

#### FR-NOTIF-01: Notifikasi In-App
- **Trigger:** Surat masuk baru, disposisi baru, ACC/tolak approval, permintaan pelayanan baru, update progress.
- **Tampilan:** Lonceng di header dengan badge jumlah unread. Dropdown list 10 terbaru.
- **Mark as read:** Klik notifikasi → otomatis mark read.
- **Real-time:** Polling setiap 30 detik (Inertia deferred prop + interval refresh).

#### FR-NOTIF-02: Pusat Notifikasi
- Halaman `/notifications` menampilkan semua notifikasi user (paginated, filter by type).

### 5.6 Toggle Ganti Tahun
- **Akses:** `admin_tu`, `kepala_unit`, `staf` (semua user login).
- **Lokasi:** Dropdown di header (default: tahun sekarang).
- **Fungsi:** Filter semua daftar (surat masuk/keluar/disposisi/rekap) berdasarkan tahun arsip.
- **Tahun aktif:** Disimpan di session, persist across page navigation.

### 5.7 Audit Log
- **Trigger:** Setiap create/update/delete pada Surat, Disposisi, User.
- **Field log:** User, Action, Model, Before, After, IP, User Agent, Timestamp.
- **Akses:** Hanya superadmin yang bisa lihat di `/admin/audit-logs`.

---

## 6. Kebutuhan Non-Fungsional

### 6.1 Performa
- Halaman daftar (dengan pagination) load < 1 detik untuk 1000 records.
- Notifikasi polling tidak membebani server (debounce + cache).

### 6.2 Keamanan
- Password di-hash dengan `bcrypt` (Laravel default).
- CSRF protection aktif untuk semua form (Laravel default).
- SQL injection prevention via Eloquent/Query Builder (parameterized queries).
- File upload: validate MIME type (PDF, JPG, PNG), max 10MB, antivirus scan opsional.
- Rate limiting: 60 requests/menit per IP untuk endpoint publik.
- Session timeout: 120 menit idle.
- HTTPS wajib di production.

### 6.3 Ketersediaan
- Target uptime: 99% selama jam kerja (08.00-16.00 WIB).
- Backup database harian (mysqldump), retensi 30 hari.

### 6.4 Maintainability
- Code style: Laravel Pint (PHP), ESLint + Prettier (TS/React).
- Test coverage target: 70% untuk backend services.
- Dokumentasi kode: PHPDoc untuk semua public methods.

### 6.5 Usability
- Mobile-first responsive (test di viewport 375px, 768px, 1280px).
- Bahasa UI: Bahasa Indonesia.
- Aksesibilitas: WCAG 2.1 Level A minimal (label, alt text, contrast ratio 4.5:1).

### 6.6 Skalabilitas
- Single server, support 100 user concurrent.
- File storage: local filesystem (`storage/app/private/surat/`).

---

## 7. Asumsi & Batasan

### 7.1 Asumsi
- Server on-premise RSGM (Linux Ubuntu 22.04, PHP 8.2, MySQL 8.0, Nginx).
- Browser target: Chrome/Edge/Firefox versi terbaru.
- Koneksi intranet RSGM stabil.
- Admin IT RSGM akan handle deployment & backup.
- User familiar dengan komputer dasar; tidak perlu training intensif.

### 7.2 Batasan
- Single bahasa (Indonesia); tidak support i18n.
- Single timezone (Asia/Jakarta).
- Tidak ada integrasi eksternal.
- Tidak ada PWA / native app.

---

## 8. Risiko & Mitigasi

| Risiko | Dampak | Probabilitas | Mitigasi |
|---|---|---|---|
| User lupa password | Login gagal | Tinggi | Fitur "Lupa Password" via email + admin bisa reset manual. |
| Rektor tidak aktif lama | Surat keluar tertahan | Sedang | Wakil Rektor bisa di-assign sebagai backup approver (configurable). |
| File corrupt/hilang | Surat tidak bisa dibuka | Rendah | Backup storage harian; validasi upload. |
| Concurrent edit disposisi | Data race condition | Rendah | Optimistic locking dengan `updated_at` check. |
| Resistensi user dari sistem lama | Adoption rendah | Tinggi | Training singkat + manual book + champion per unit. |

---

## 9. Metrik Sukses

### 9.1 Metrik Adopsi
- 90% user aktif login dalam 1 bulan setelah launch.
- 100% surat masuk/keluar tercatat di sistem dalam 1 bulan.

### 9.2 Metrik Operasional
- Rata-rata waktu rekap bulanan < 2 jam (dari 2 hari sebelumnya).
- 0 surat hilang/tidak terlacak.

### 9.3 Metrik Kepuasan
- User satisfaction score ≥ 4/5 dalam survey 3 bulan setelah launch.

---

## 10. Glosarium

| Istilah | Definisi |
|---|---|
| **Surat Masuk** | Surat yang diterima RSGM dari pihak eksternal/internal. |
| **Surat Keluar** | Surat yang dikirim RSGM ke pihak eksternal/internal. |
| **Disposisi** | Perintah/instruksi dari atasan terkait surat yang perlu ditindaklanjuti. |
| **Indeks** | Kode klasifikasi surat (ST=Surat Tugas, SK=Surat Keputusan, dll). |
| **Rekap** | Ringkasan/laporan jumlah surat dalam periode tertentu. |
| **Kode Unit** | Kode singkat untuk unit RSGM (TUS, IT, PGI, dll). |
| **Permintaan Pelayanan** | Tiket helpdesk untuk permintaan layanan internal (IT, Umum, Medis, dll). |

---

**Dokumen ini adalah sumber kebenaran tunggal untuk ruang lingkup produk. Setiap perubahan harus melalui proses review dan update versi.**
