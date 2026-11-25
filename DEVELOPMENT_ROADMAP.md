# DEVELOPMENT ROADMAP

## Digital Guestbook – SMAN 1 Boyolangu

### 1. Development Strategy

Pengembangan dilakukan secara bertahap.

Prioritas utama adalah menghasilkan website yang stabil dan dapat digunakan pada hari acara.

Jangan mengerjakan semua fitur sekaligus.

Setiap tahap harus diperiksa sebelum melanjutkan ke tahap berikutnya.

### 2. Phase 1 – Requirement Analysis

Tujuan:
Memastikan seluruh kebutuhan sudah jelas.

Tugas:

- Membaca seluruh dokumentasi.
- Memeriksa struktur halaman.
- Memastikan kebutuhan data.
- Memastikan kebutuhan tanda tangan.
- Menentukan strategi penyimpanan.
- Memastikan pilihan deployment.

Output:

- Rancangan final.
- Daftar fitur MVP.
- Struktur proyek.

Jangan membuat kode sebelum rancangan disetujui pengguna.

### 3. Phase 2 – UI/UX Design

Tujuan:
Membuat desain halaman website.

Tugas:

- Membuat Welcome Page.
- Membuat Registration Page.
- Membuat Success Page.
- Membuat Admin Dashboard.
- Menerapkan palet warna.
- Menerapkan typography.
- Memastikan tampilan responsif.

Output:
Desain halaman yang konsisten dengan konsep Vintage Editorial – Historical Atlas.

### 4. Phase 3 – Core Functionality

Tujuan:
Membangun fungsi utama.

Tugas:

- Membuat formulir pengunjung.
- Membuat validasi.
- Membuat area tanda tangan.
- Membuat tombol hapus tanda tangan.
- Membuat proses penyimpanan.
- Membuat halaman konfirmasi.
- Memastikan formulir dapat digunakan berulang kali.

Output:
Alur pengisian buku tamu berfungsi.

### 5. Phase 4 – Data Management

Tujuan:
Membuat pengelolaan data pengunjung.

Tugas:

- Membuat database IndexedDB.
- Menyimpan data pengunjung.
- Menyimpan tanda tangan.
- Membuat daftar pengunjung.
- Membuat pencarian.
- Membuat detail data.
- Membuat penghapusan data.

Output:
Data pengunjung dapat dikelola melalui dashboard.

### 6. Phase 5 – Backup and Export

Tujuan:
Menjaga keamanan data.

Tugas:

- Membuat ekspor CSV.
- Membuat backup JSON.
- Membuat restore JSON.
- Membuat validasi file backup.
- Membuat konfirmasi tindakan.
- Menguji pemulihan data.

Output:
Data dapat dicadangkan dan dipulihkan.

### 7. Phase 6 – Deployment

Tujuan:
Menyiapkan website untuk digunakan pada acara.

Tugas:

- Menentukan penggunaan Vercel atau versi lokal.
- Menyiapkan file final.
- Menguji website pada laptop pengembang.
- Memindahkan website ke laptop acara.
- Menguji penyimpanan pada browser laptop acara.
- Menguji akses dashboard.
- Menguji backup.

Output:
Website siap digunakan pada laptop acara.

### 8. Phase 7 – Final Testing

Lakukan pengujian berikut:

#### A. Pengujian Pengunjung

- [ ] Welcome Page tampil dengan benar.
- [ ] Tombol Isi Buku Tamu berfungsi.
- [ ] Formulir dapat diisi.
- [ ] Validasi bekerja.
- [ ] Tanda tangan dapat dibuat.
- [ ] Tanda tangan dapat dihapus.
- [ ] Data berhasil disimpan.
- [ ] Halaman konfirmasi tampil.
- [ ] Formulir siap digunakan pengunjung berikutnya.

#### B. Pengujian Data

- [ ] Data tetap tersedia setelah reload.
- [ ] Data tidak tertukar.
- [ ] NIS dengan angka nol di depan tetap benar.
- [ ] Tanda tangan dapat ditampilkan kembali.
- [ ] Jumlah pengunjung sesuai.

#### C. Pengujian Admin

- [ ] Dashboard dapat diakses.
- [ ] Daftar pengunjung tampil.
- [ ] Pencarian berfungsi.
- [ ] Detail data dapat dilihat.
- [ ] CSV dapat diekspor.
- [ ] JSON dapat diunduh.
- [ ] JSON dapat dipulihkan.
- [ ] Penghapusan memerlukan konfirmasi.

#### D. Pengujian Perangkat

- [ ] Website berjalan pada laptop pengembang.
- [ ] Website berjalan pada laptop acara.
- [ ] Browser yang digunakan mendukung IndexedDB.
- [ ] Penyimpanan tidak hilang setelah browser ditutup.
- [ ] Backup berhasil disimpan di lokasi yang aman.
- [ ] Website tetap berfungsi sesuai kebutuhan ketika koneksi internet bermasalah.

### 9. Event Operation Procedure

Sebelum acara:

1. Buka website pada laptop acara.
2. Pastikan browser menggunakan profil yang benar.
3. Uji pengisian satu data percobaan.
4. Pastikan tanda tangan tersimpan.
5. Uji dashboard.
6. Hapus data percobaan setelah pengujian.
7. Buat backup awal jika diperlukan.

Saat acara:

1. Tampilkan Welcome Page.
2. Arahkan pengunjung mengisi formulir.
3. Pastikan data berhasil disimpan.
4. Kembalikan website ke halaman awal.
5. Ulangi untuk pengunjung berikutnya.

Setelah acara:

1. Buka dashboard admin.
2. Periksa jumlah data.
3. Ekspor CSV.
4. Buat backup JSON.
5. Simpan salinan backup pada media penyimpanan terpisah.
6. Pastikan file backup dapat dibuka dan dipulihkan.

### 10. Risk Management

| Risiko                       | Penanganan                                                  |
| ---------------------------- | ----------------------------------------------------------- |
| Internet terputus            | Siapkan versi lokal atau mekanisme offline yang sudah diuji |
| Data hilang                  | Backup JSON secara berkala                                  |
| Laptop berganti              | Pindahkan backup dan uji restore                            |
| Tanda tangan tidak tersimpan | Uji penyimpanan Canvas sebelum acara                        |
| Pengunjung mengisi dua kali  | Berikan konfirmasi setelah penyimpanan                      |
| Website sulit digunakan      | Sederhanakan formulir dan tombol                            |
| Waktu pengembangan terbatas  | Utamakan fitur MVP                                          |

### 11. Development Rules

- Kerjakan satu tahap dalam satu waktu.
- Jelaskan hasil setiap tahap.
- Jangan melewati pengujian.
- Jangan menambah fitur tanpa alasan.
- Jangan mengubah spesifikasi utama tanpa persetujuan.
- Jika menemukan masalah, jelaskan penyebab dan solusi.
- Prioritaskan stabilitas dibandingkan fitur tambahan.

### 12. Final Goal

Hasil akhir adalah website buku tamu digital yang:

- Menarik dan sesuai tema acara.
- Mudah digunakan pengunjung.
- Mendukung tanda tangan digital.
- Menyimpan data dengan baik.
- Memiliki dashboard admin.
- Memiliki fitur backup dan restore.
- Siap digunakan pada laptop acara.
- Dapat diselesaikan sesuai deadline.
