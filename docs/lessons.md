# Lessons Learned — SIM SURAT RSGM UNIMUS

## 2026-08-27 — Planning Phase

### Insights from Interrogation
1. **Jangan asumsikan alur disposisi**: Banyak variasi (multi-level vs single, free forward vs approval-based). Harus ditanyakan eksplisit.
2. **Kontradiksi jawaban**: User awalnya bilang "no register publik" lalu berubah. Wajib konfirmasi ulang jawaban kontradiktif.
3. **Username dengan role**: User awalnya sebut "username mencakup role" tapi ternyata maksudnya role dipilih saat register, bukan format username dengan prefix.
4. **Konteks RSGM spesifik**: Referensi screenshot dari SIMSURAT lama + Farmagitechs/Evoluz. Wajib klarifikasi apakah modul berbeda atau sistem sama.

### Best Practices yang Diterapkan
- Interogasi bertingkat (batch 5-5 pertanyaan, dari foundational ke detail)
- Setiap jawaban langsung dikonfirmasi implikasinya
- Opsi jawaban saling eksklusif dengan "recommended" flag
- Free text input sebagai escape hatch
- Tidak langsung tulis dokumentasi sampai semua asumsi terkunci

### Hal yang Bisa Diperbaiki di Masa Depan
- Tanyakan soal **kebutuhan training** user (admin/operator).
- Tanyakan soal **budget** untuk server/procurement.
- Tanyakan soal **timeline launch** yang diharapkan.
- Tanyakan soal **stakeholder lain** yang perlu di-interview (kepala TU, rektor).
