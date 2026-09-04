# Panduan Penggunaan Aplikasi — SIM Surat RSGM UNIMUS

**Versi:** 1.0 — 2026-09-04
**Untuk:** Staf, Admin TU, Kepala Unit, Superadmin
**Referensi:** `docs/PRD.md`, `docs/APP_FLOW.md`

---

## 1. Pengenalan

**SIM Surat RSGM UNIMUS** adalah sistem informasi manajemen surat terpusat untuk RSGM Universitas Muhammadiyah Semarang. Aplikasi ini menggantikan pencatatan manual dengan alur digital:

| Modul           | Fungsi                                                            |
| --------------- | ----------------------------------------------------------------- |
| Surat Masuk     | Catat, ubah, rincian, hapus, dan disposisikan surat yang diterima |
| Surat Keluar    | Buat draft, ajukan approval Rektor, cetak PDF resmi               |
| Disposisi       | Teruskan surat antar user/unit, arsipkan jika selesai             |
| IT Helpdesk     | Lapor kendala IT (hardware/jaringan/aplikasi) dan pantau tiket    |
| Rekap & Laporan | Rekap surat masuk/keluar + export Excel                           |
| Notifikasi      | Lonceng di header + pusat notifikasi                              |
| Admin           | Kelola user, unit, audit log (khusus Superadmin)                  |

### 1.1 Peran Pengguna

| Role          | Hak akses ringkas                                                                                    |
| ------------- | ---------------------------------------------------------------------------------------------------- |
| `staf`        | Catat surat masuk, terima/teruskan disposisi, lapor kendala IT, lihat rekap unitnya                  |
| `admin_tu`    | Semua hal staf + kelola surat masuk/keluar penuh, hapus/restore, export rekap, kelola tiket helpdesk |
| `kepala_unit` | Seperti admin TU untuk unitnya + approve surat unitnya                                               |
| `superadmin`  | Akses penuh: approval akhir surat keluar (sebagai Rektor), kelola user/unit, audit log               |

### 1.2 Akun Demo (data seeder)

| Role        | Username      | Password   |
| ----------- | ------------- | ---------- |
| Superadmin  | `superadmin`  | `password` |
| Admin TU    | `admin_tu`    | `password` |
| Kepala Unit | `kepala_unit` | `password` |
| Staf IT     | `staf_it`     | `password` |

> Ganti password demo ini segera di production via menu Profil.

---

## 2. Memulai

### 2.1 Login

1. Buka halaman `/login`.
2. Isi **Username** dan **Password**.
3. Klik **Masuk**.
4. Jika berhasil, Anda diarahkan ke `/dashboard`.
5. Jika gagal, muncul pesan generik _"Username atau password salah"_ — periksa kembali username, status akun (harus `active`), dan caps lock.

### 2.2 Registrasi Akun Baru (dengan Approval)

1. Buka `/register`.
2. Isi: **Username** (unik), **Nama Lengkap**, **Email** (unik), **Password** (min. 8 karakter + konfirmasi), **Unit** (dropdown), **Role** (hanya _Kepala Unit_ atau _Staf_).
3. Klik **Daftar**.
4. Akun berstatus `pending` (belum bisa login). Muncul pesan _"Pendaftaran berhasil, menunggu approval"_.
5. Superadmin menyetujui via **Manajemen User → Menunggu Persetujuan** (lihat §8.1).
6. Setelah disetujui, login seperti biasa.

### 2.3 Lupa Password

1. Di halaman login, klik **Lupa Password** (`/forgot-password`).
2. Masukkan email terdaftar → sistem mengirim link reset (berlaku 60 menit).
3. Buka link → isi password baru → simpan → login kembali.

### 2.4 Logout

Klik ikon **Keluar** di sidebar bawah (atau menu user di header) → session dihapus → kembali ke `/login`.

---

## 3. Navigasi Umum

### 3.1 Menu Sidebar

| Menu            | URL                | Keterangan                             |
| --------------- | ------------------ | -------------------------------------- |
| Dashboard       | `/dashboard`       | Statistik ringkas + notifikasi terbaru |
| Surat Masuk     | `/surat-masuk`     | Daftar surat masuk                     |
| Surat Keluar    | `/surat-keluar`    | Daftar surat keluar + status approval  |
| Disposisi       | `/disposisi`       | Daftar disposisi yang terkait Anda     |
| IT Helpdesk     | `/helpdesk`        | Dashboard tiket tim IT                 |
| Lapor Kendala   | `/helpdesk/create` | Form laporan staf                      |
| Notifikasi      | `/notifications`   | Semua notifikasi Anda                  |
| Rekap & Laporan | `/rekap`           | Sub-menu rekap masuk/keluar            |
| Manajemen User  | `/admin/users`     | Khusus `superadmin`/`admin_tu`         |

Menu yang tidak sesuai role Anda otomatis disembunyikan (bukan dinonaktifkan).

### 3.2 Header: Toggle Tahun Arsip, Lonceng, Profil

- **Toggle Tahun** (dropdown di header): filter semua daftar surat/rekap berdasarkan tahun arsip. Default tahun berjalan. Pilihan tersimpan di session dan berlaku lintas halaman.
- **Lonceng Notifikasi**: badge angka = jumlah belum dibaca. Klik untuk melihat 10 terbaru; klik item untuk menandai dibaca. Halaman penuh di `/notifications`.
- **Profil** (`/profile`): ubah nama/email + ganti password (wajib isi password lama).

---

## 4. Modul Surat Masuk

### 4.1 Melihat Daftar (`/surat-masuk`)

- Kolom: No urut, Tanggal Terima, Pengirim, Tanggal Surat, No Surat, Perihal, Indeks, Aksi.
- Gunakan **filter** (rentang tanggal, pengirim, perihal, indeks) dan **pencarian** untuk menemukan surat.
- Daftar otomatis difilter tahun aktif (lihat Toggle Tahun) dan unit Anda (kecuali superadmin/admin TU yang melihat semua).

### 4.2 Menambah Surat Masuk (`/surat-masuk/create`)

Semua role aktif bisa mencatat. Langkah:

1. Klik **Tambah Surat** di halaman daftar.
2. Isi form:
    - **Tanggal Terima** (default hari ini)
    - **Tanggal Surat** (harus ≤ Tanggal Terima)
    - **Nomor Surat** (dari pengirim, manual)
    - **Pengirim**, **Perihal**, **Keterangan** (opsional)
    - **Indeks** (dropdown master, opsional)
    - **File Surat** (wajib; PDF/JPG/PNG, maks 10 MB)
3. Klik **Simpan** → nomor urut sistem tergenerate otomatis per-tahun → kembali ke daftar dengan pesan sukses.

### 4.3 Melihat Rincian (`/surat-masuk/{id}`)

Klik **Rincian** pada baris surat. Tersedia:

- Semua field surat + tombol **Download File**.
- **Timeline disposisi** kronologis (tanggal-jam, dari → kepada, isi).
- **Riwayat perubahan** (audit).
- Tombol **Cetak Lembar Disposisi** (PDF landscape A4 dengan kop RSGM) jika ada disposisi.
- Form **Buat Disposisi** inline (lihat §6.1).

### 4.4 Mengubah (`/surat-masuk/{id}/edit`)

1. Klik **Ubah** → form terisi data lama.
2. File bersifat opsional (kosongkan jika tidak diganti).
3. Simpan → perubahan dicatat di audit log.
4. Hak: `superadmin`/`admin_tu` bebas; `kepala_unit` hanya unitnya; `staf` tidak bisa mengubah.

### 4.5 Menghapus & Restore (Soft Delete)

1. Klik **Hapus** (hanya `admin_tu`/`superadmin`) → konfirmasi modal _"Data akan masuk Trash 30 hari"_.
2. Data berstatus soft-delete (`deleted_at` terisi), bisa di-restore dalam 30 hari via tombol **Restore**.
3. Lewat 30 hari, sistem auto-purge permanen via scheduled job.

---

## 5. Modul Surat Keluar

### 5.1 Melihat Daftar (`/surat-keluar`)

Kolom: No, Tanggal Surat, Nomor Surat, Kepada, Perihal, Indeks, **Status** (`Draft` / `Menunggu ACC` / `Disetujui` / `Ditolak`), Aksi. Filter tersedia untuk tanggal, kepada, perihal, indeks, dan status.

### 5.2 Menambah Surat Keluar (`/surat-keluar/create`)

Hak: `admin_tu`, `kepala_unit` (unitnya), `superadmin`. `staf` tidak bisa membuat.

1. Klik **Tambah Surat Keluar**.
2. Isi form:
    - **Indeks** (dropdown). **Khusus "ST" (Surat Tugas)**: muncul field tambahan — Tanggal Mulai/Selesai Penugasan, Penanda Tangan, dan Kode hanya `KP`/`KM`.
    - **Nomor Surat**: auto-generate format `[KodeUnit]/[Indeks][NoUrut]/[BulanRomawi]/[Tahun]`, mis. `001/UNIMUS/Pan.S/KP/VII/2026`. Bisa di-override manual. Gunakan tombol **Preview Nomor** untuk cek.
    - **Tanggal Surat, Kepada, Perihal, Penanda Tangan, Tembusan** (opsional), **Keterangan** (opsional), **File** (maks 10 MB).
3. Klik **Simpan** → status awal `draft`.

### 5.3 Alur Approval (Wajib Rektor/Superadmin)

```
Draft → [Submit] → Menunggu ACC → [Rektor: ACC] → Disetujui
                               → [Rektor: Tolak + alasan] → Draft (revisi)
```

1. Di halaman rincian surat berstatus `draft`, klik **Submit untuk Approval** → status `menunggu_acc`, notifikasi terkirim ke Rektor + Kepala Unit asal.
2. Rektor (superadmin) membuka rincian → klik **Setujui** atau **Tolak** (wajib isi alasan).
3. Pengaju menerima notifikasi hasil. Jika ditolak → perbaiki via **Ubah** (hanya saat `draft`/`ditolak`) → submit ulang.
4. Jika disetujui → tombol **Cetak PDF** aktif (surat resmi A4 dengan kop RSGM).

---

## 6. Modul Disposisi

### 6.1 Membuat Disposisi

Semua penerima surat bisa mendisposisikan. Dua cara:

- **Dari rincian surat masuk**: isi form inline (Kepada + Isi Disposisi) → kirim.
- **Via daftar disposisi** (`/disposisi`): buat disposisi lanjutan dari disposisi yang ditujukan ke Anda.

Field:

- **Dari**: otomatis user login.
- **Kepada**: dropdown user/unit tujuan.
- **Isi Disposisi**: instruksi tindak lanjut.
- Alur default: **Staf → Atasan → Rektor (ACC)** → diteruskan ke unit target.

### 6.2 Dua Tipe Aksi

| Aksi                     | Kapan dipakai                          | Efek                                             |
| ------------------------ | -------------------------------------- | ------------------------------------------------ |
| **Disposisi** (teruskan) | Surat perlu ditindaklanjuti pihak lain | Disposisi baru ke tujuan; surat tetap `on route` |
| **Arsipkan**             | Surat tidak perlu diteruskan lagi      | Disposisi ditutup; status surat → `selesai`      |

### 6.3 Melihat & Mencetak

- Daftar (`/disposisi`): semua disposisi terkait Anda.
- Rincian (`/disposisi/{id}`): timeline kronologis dengan ikon status.
- Setiap disposisi baru → notifikasi in-app ke penerima; ACC/tolak Rektor → notifikasi ke seluruh rantai.
- **Cetak Lembar Disposisi** (`/surat-masuk/{id}/cetak-disposisi`): PDF landscape A4 berisi kop RSGM, info surat, dan tabel disposisi dari → kepada → isi → tanda tangan.

---

## 7. Modul IT Helpdesk (Lapor Kendala IT)

### 7.1 Mengajukan Laporan — Halaman Form Staf (`/helpdesk/create`)

Semua user aktif bisa melapor:

1. Buka **Lapor Kendala** di sidebar.
2. Isi form:
    - **Nama Pelapor**: terisi otomatis dari akun login.
    - **Unit / Bagian**: dropdown (Pendaftaran, Rekam Medis, IGD, Radiologi, Rawat Jalan, Rawat Inap, Farmasi, CSSD, Keuangan, Integrasi, TU, dll).
    - **Kategori Kendala**: `Hardware` / `Jaringan` / `Aplikasi SIM-RS` / `Lainnya`.
    - **Jenis Permintaan**: `Perbaikan` / `Konsultasi` / `Instalasi Baru`.
    - **Deskripsi Kendala**: textarea wajib — jelaskan gejala, kapan terjadi, perangkat terkait.
    - **File Pendukung**: opsional, maks 5 MB per file (JPEG/PNG/PDF), mis. foto error.
3. Klik **Kirim Laporan** → tiket masuk antrean IT berstatus **Baru** (badge merah) dengan kode unik mis. `#0125` (sequential per tahun, reset tiap tahun baru).

### 7.2 Dashboard Tim IT (`/helpdesk`)

Untuk tim IT / admin:

- **3 kartu counter**: Tiket Baru, Diproses (kuning), Selesai (hijau).
- **Tabel tiket**: kolom Tiket (#kode), Unit, Permintaan, Lampiran (ikon/pill), Status (badge warna). Pagination 10/25/50.
- **Filter**: status, unit, kategori, pencarian kode tiket/nama pelapor.

### 7.3 Menangani Tiket (Rincian `/helpdesk/{id}`)

Halaman rincian menampilkan: info tiket, info pelapor, deskripsi, lampiran (preview/download), tindak lanjut, dan **riwayat progress** (timeline).

Alur status oleh tim IT:

1. Status `baru` → klik **Proses** → menjadi `diproses` (pencatat = Anda, waktu diproses tersimpan). Pelapor dapat notifikasi.
2. Status `diproses` → klik **Tandai Selesai** → isi **Tindak Lanjut/Solusi** (wajib) → menjadi `selesai`. Pelapor dapat notifikasi.
3. Alternatif: klik **Tutup** → menjadi `ditutup` (tanpa tindak lanjut / duplikat / dibatalkan).

Lampiran diunduh via tombol **Download** (`/helpdesk/{id}/lampiran/{index}`) dengan pengecekan hak akses.

---

## 8. Modul Admin (Superadmin)

### 8.1 Manajemen User (`/admin/users`)

- **Daftar**: semua user dengan filter role/status/unit.
- **Tambah** (`/admin/users/create`): username, nama, email, password, unit, role, status.
- **Ubah** (`/admin/users/{id}/edit`), **Hapus** (soft), **Detail**.
- **Approval pendaftar** (`/admin/users-pending`): tinjau data → **Approve** (status → `active`) atau **Reject** (hapus akun). Pendaftar menerima notifikasi/email hasil.

### 8.2 Manajemen Unit (`/admin/units`)

CRUD unit: **Kode Unit** (unik, maks 10 char, mis. `TUS`, `IT`, `PGI`), **Nama Unit**, **Keterangan**. Unit dipakai di dropdown form, filter, dan format nomor surat.

### 8.3 Audit Log (`/admin/audit-logs`)

Hanya superadmin. Mencatat setiap create/update/delete Surat, Disposisi, dan User: siapa, aksi apa, model apa, nilai sebelum/sesudah, IP, user agent, waktu. Tersedia filter user/aksi/model/rentang tanggal.

---

## 9. Rekap, Notifikasi, dan Profil

### 9.1 Rekap & Laporan (`/rekap`)

- **Rekap Surat Masuk** (`/rekap/surat-masuk`): filter rentang tanggal, unit, pengirim, indeks. Tabel + total di footer. Tombol **Export Excel** (`/rekap/surat-masuk/export`).
- **Rekap Surat Keluar** (`/rekap/surat-keluar`): filter sama + status approval dan tanggal ACC. Tombol **Export Excel** (`/rekap/surat-keluar/export`).
- Hak: `superadmin`/`admin_tu` melihat semua; `kepala_unit`/`staf` hanya unitnya. Export hanya `superadmin`/`admin_tu`/`kepala_unit`.

### 9.2 Pusat Notifikasi (`/notifications`)

- Semua notifikasi Anda (paginated, filter per tipe). Pemicu: surat masuk baru, disposisi baru, hasil approval, tiket helpdesk baru/update progress, pendaftar baru (untuk superadmin).
- **Tandai dibaca**: klik satu notifikasi (`POST /notifications/{id}/read`) atau **Tandai Semua Dibaca** (`POST /notifications/read-all`).
- Lonceng header me-refresh jumlah belum dibaca berkala (polling ±30 detik).

### 9.3 Profil (`/profile`)

- **Update profil** (`PATCH /profile`): nama, email.
- **Ganti password** (`PUT /profile/password`): password lama + baru + konfirmasi.

---

## 10. Alur Kerja per Peran (Cheat Sheet)

### Staf

1. Login → cek lonceng → kerjakan disposisi di `/disposisi` (teruskan/arsipkan).
2. Catat surat masuk baru bila menerima fisik.
3. Lapor kendala IT via `/helpdesk/create`; pantau status tiket Anda.
4. Lihat rekap unit bila perlu.

### Admin TU

1. Catat seluruh surat masuk/keluar harian.
2. Buat disposisi awal ke kepala unit.
3. Submit surat keluar untuk approval Rektor; cetak PDF setelah disetujui.
4. Kelola tiket helpdesk (proses/selesaikan) bila diberi wewenang.
5. Generate rekap + export Excel tiap akhir bulan.

### Kepala Unit

1. Review disposisi masuk → teruskan ke staf / arsipkan.
2. Buat & submit surat keluar unitnya.
3. Pantau rekap unitnya.

### Superadmin (termasuk peran Rektor)

1. Approve akun pending di `/admin/users-pending`.
2. Review & ACC/tolak surat keluar menunggu approval.
3. Kelola user/unit; audit via `/admin/audit-logs`.
4. Pantau rekap global.

---

## 11. Troubleshooting (Masalah Umum)

| Gejala                             | Penyebab umum                                                      | Solusi                                                                   |
| ---------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| Tidak bisa login                   | Akun masih `pending` / salah password                              | Minta superadmin approve; gunakan Lupa Password                          |
| Halaman 403 "tidak memiliki akses" | Role tidak diizinkan                                               | Minta superadmin sesuaikan role; jangan akses URL langsung               |
| Upload ditolak                     | File > 10 MB (surat) / > 5 MB (helpdesk) atau tipe salah           | Kompres/konversi ke PDF/JPG/PNG lalu ulangi                              |
| Daftar kosong padahal data ada     | Filter tahun arsip salah                                           | Ganti Toggle Tahun di header ke tahun yang benar                         |
| Tombol Ubah/Cetak tidak muncul     | Status tidak memungkinkan (mis. surat keluar sudah `menunggu_acc`) | Tunggu hasil approval / revisi setelah ditolak                           |
| Notifikasi tidak update            | Polling tertunda                                                   | Refresh halaman; buka `/notifications` langsung                          |
| Halaman error 404/500              | URL salah / gangguan server                                        | Kembali via sidebar; hubungi admin IT dengan screenshot + waktu kejadian |

Bantuan lanjutan: hubungi **Admin IT RSGM** (tim helpdesk) dengan menyertakan username, URL halaman, dan screenshot error.
