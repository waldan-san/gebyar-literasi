# Format Backup, Ekspor, dan Pemulihan

## Format file

Backup adalah JSON UTF-8 lokal dengan `format: "digital-guestbook-backup"` dan `version: 1`. Atribut `createdAt` menyimpan waktu pembuatan, `visitorCount` menyimpan jumlah record, dan `visitors` memuat seluruh record. Setiap record tetap memakai skema yang ada (`id`, `name`, `position`, `nis`, `signature`, `createdAt`); tanda tangan disimpan sebagai data URL gambar Base64. File tidak dikirim ke layanan online.

## Validasi sebelum pemulihan

Pemilih menerima JSON. Aplikasi membaca file dan memeriksa format, versi yang didukung, daftar record, enam field wajib, jenis nilai, tanggal, tanda tangan bila ada, dan keunikan ID. File rusak, tidak lengkap, atau versi lain ditolak sebelum database disentuh. Setelah lolos, jumlah data dan benturan ID dilaporkan; pemilihan file sendiri belum mengubah data.

## Konflik ID

Pemulihan hanya menambahkan record; tidak mengganti atau menghapus record lama. Pilihan baku adalah membatalkan seluruh pemulihan bila setidaknya satu ID sudah ada. Pilihan kedua secara eksplisit melewati ID yang bentrok dan menambahkan sisanya. Keduanya meminta konfirmasi sebelum penulisan. Penambahan dikerjakan dalam satu transaksi IndexedDB; kegagalan membatalkan seluruh transaksi. Untuk file tanpa konflik, pemulihan menggabungkan semua record ke database yang ada.

## Pemulihan data dari laptop acara

1. Di laptop acara, buka dashboard admin dan tekan **Buat backup JSON** setelah acara.
2. Pastikan file backup terlihat di folder unduhan. Salin file tersebut melalui media lokal yang aman.
3. Di laptop pengembangan, buka proyek pada origin/profil browser yang menyimpan database tujuan, lalu dashboard admin.
4. Pilih file backup. Pastikan jumlah record dan benturan sesuai ringkasan.
5. Pilih kebijakan konflik. Untuk membatalkan saat ada benturan, gunakan pilihan baku. Untuk menggabungkan data unik, pilih opsi lewati benturan.
6. Konfirmasi pemulihan dan periksa jumlah pengunjung serta detail/tanda tangan pada dashboard.

Backup yang diunduh adalah salinan berisi data pribadi dan tanda tangan; simpan dan pindahkan dengan menjaga privasi. Browser menentukan lokasi file hasil unduhan.
