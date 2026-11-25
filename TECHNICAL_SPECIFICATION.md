# TECHNICAL SPECIFICATION

## Digital Guestbook – SMAN 1 Boyolangu

### 1. Technology Direction

Gunakan teknologi yang sederhana, gratis, dan mudah dipindahkan.

Rekomendasi utama:

- HTML.
- CSS.
- JavaScript.
- IndexedDB.
- Canvas API.

Framework seperti React boleh dipertimbangkan apabila benar-benar memberikan manfaat dan tidak memperlambat pengerjaan.

Jangan menggunakan teknologi kompleks tanpa kebutuhan yang jelas.

### 2. Application Architecture

Website terdiri dari:

1. Frontend:
   - Menampilkan halaman.
   - Mengelola formulir.
   - Mengelola tanda tangan.
   - Menampilkan dashboard.

2. Local Storage:
   - IndexedDB untuk menyimpan data pengunjung.
   - Menyimpan tanda tangan sebagai gambar atau Blob.
   - Menyimpan data secara persisten pada browser.

3. Export and Backup:
   - CSV untuk ekspor data tabel.
   - JSON untuk backup lengkap termasuk tanda tangan.
   - JSON harus dapat digunakan untuk restore data.

### 3. Guest Data Structure

Setiap pengunjung memiliki data:

- id: ID unik.
- name: Nama lengkap.
- position: Jabatan atau kelas.
- nis: NIS dalam format string.
- signature: Data tanda tangan.
- createdAt: Waktu pencatatan.

Ketentuan:

- ID harus unik.
- Waktu pencatatan dibuat otomatis.
- NIS disimpan sebagai teks.
- Tanda tangan harus dapat ditampilkan kembali.
- Data harus memiliki struktur yang konsisten.

### 4. Form Validation

Validasi:

- Nama wajib diisi.
- Jabatan/Kelas wajib diisi.
- NIS mengikuti kebijakan pengisian yang disepakati; dapat dibuat opsional untuk pengunjung non-siswa.
- Tanda tangan wajib tersedia.
- Tidak boleh menyimpan formulir kosong.
- Berikan pesan kesalahan yang jelas.

Setelah berhasil disimpan:

- Tampilkan halaman konfirmasi.
- Kosongkan data formulir untuk pengunjung berikutnya.
- Jangan menyimpan ulang data yang sama hanya karena tombol ditekan dua kali.

### 5. Digital Signature

Gunakan Canvas API.

Kebutuhan:

- Menggambar menggunakan mouse.
- Mendukung touchpad.
- Mendukung layar sentuh jika memungkinkan.
- Tombol clear untuk menghapus tanda tangan.
- Tanda tangan disimpan bersama data pengunjung.
- Tanda tangan dapat ditampilkan di dashboard.
- Tanda tangan tetap tersedia setelah halaman dimuat ulang.

Perhatikan:

- Koordinat tanda tangan harus mengikuti ukuran canvas.
- Perubahan ukuran layar tidak boleh membuat area tanda tangan rusak.
- Pastikan tanda tangan tidak hilang sebelum data berhasil disimpan.

### 6. IndexedDB

Gunakan IndexedDB sebagai penyimpanan utama.

Ketentuan:

- Data tetap ada setelah browser ditutup dan dibuka kembali.
- Gunakan struktur database yang konsisten.
- Tangani kegagalan penyimpanan.
- Tampilkan pesan jika penyimpanan gagal.
- Jangan menghapus data lama ketika menambahkan pengunjung baru.
- Sediakan mekanisme backup.

PENTING:
IndexedDB terikat pada origin dan profil browser. Data pada localhost, file lokal, dan alamat Vercel dapat berada di penyimpanan yang berbeda.

Data tidak otomatis berpindah antarlaptop.

### 7. Admin Dashboard

Fitur minimum:

- Melihat total pengunjung.
- Melihat seluruh data pengunjung.
- Mencari berdasarkan nama.
- Melihat detail data.
- Melihat tanda tangan.
- Mengekspor CSV.
- Backup JSON.
- Restore JSON.
- Mencetak daftar pengunjung.
- Menghapus data dengan konfirmasi.

Keamanan:

- Dashboard admin tidak boleh langsung ditampilkan pada halaman pengunjung.
- Boleh menggunakan PIN sederhana untuk mencegah akses tidak sengaja.
- Jangan mengklaim PIN frontend sebagai sistem keamanan kuat.
- Jangan menyimpan data sensitif secara tidak perlu.

### 8. Backup and Restore

#### CSV Export

CSV digunakan untuk menyimpan data tabel.

Kolom:

- ID.
- Nama.
- Jabatan/Kelas.
- NIS.
- Waktu pencatatan.

Tanda tangan tidak wajib dimasukkan ke CSV.

#### JSON Backup

JSON digunakan untuk pencadangan lengkap.

Harus mencakup:

- Seluruh data pengunjung.
- ID.
- Nama.
- Jabatan/Kelas.
- NIS.
- Tanda tangan.
- Waktu pencatatan.
- Versi format backup.

#### JSON Restore

Sebelum restore:

- Validasi struktur file.
- Berikan konfirmasi kepada admin.
- Jangan menghapus data lama secara diam-diam.
- Sediakan pilihan strategi penggabungan atau penggantian data.
- Tampilkan hasil restore.

### 9. Deployment Strategy

Pilihan pertama: Website statis melalui Vercel.

Kelebihan:

- Mudah diakses melalui browser.
- Tidak perlu instalasi pada laptop pengunjung.
- Dapat dibuka melalui alamat website.

Keterbatasan:

- Membutuhkan internet untuk membuka website jika belum disiapkan untuk offline.
- Data IndexedDB tetap berada di browser perangkat yang digunakan.
- Tidak ada sinkronisasi otomatis antarlaptop.

Pilihan cadangan: Versi lokal.

Versi lokal harus dapat dijalankan pada laptop acara melalui browser dan server lokal sederhana apabila diperlukan.

Jangan menganggap membuka file HTML langsung selalu memberikan perilaku penyimpanan yang sama dengan website yang di-host.

### 10. Offline and Internet Considerations

Tentukan sejak awal apakah website harus tetap berjalan ketika internet terputus.

Jika offline menjadi kebutuhan:

- Siapkan mekanisme caching atau local hosting.
- Jangan mengandalkan Google Maps untuk fungsi utama.
- Pastikan fitur formulir, tanda tangan, penyimpanan, dan dashboard berjalan tanpa internet.
- Uji skenario pemutusan internet.

Website materi dan Google Maps merupakan fitur pendukung, bukan fitur inti buku tamu.

### 11. Technical Restrictions

- Jangan membuat backend jika tidak diperlukan.
- Jangan menggunakan database berbayar.
- Jangan mengirim data ke layanan eksternal.
- Jangan menambahkan login kompleks.
- Jangan menggunakan library besar tanpa alasan.
- Jangan membuat fitur yang tidak diperlukan untuk acara satu hari.

### 12. Technical Acceptance Criteria

Website dinyatakan layak secara teknis jika:

- Formulir dapat diisi.
- Validasi berfungsi.
- Tanda tangan dapat dibuat.
- Data dapat disimpan.
- Data tetap ada setelah reload.
- Data dapat diekspor.
- Backup dan restore berhasil.
- Dashboard dapat digunakan.
- Tidak ada data pengunjung yang tertukar.
- Website dapat dijalankan pada laptop acara.
