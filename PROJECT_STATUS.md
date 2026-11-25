# Status Proyek

## Status

Tahap: Integrasi dan pengujian akhir (fungsi utama dan API restore teruji di Chrome/origin QA; beberapa pengujian perangkat dan alur UI masih terbuka).

Tanggal pembaruan: 25 November 2026

## Status Modul

| Modul | Status implementasi | Bukti/status pengujian akhir |
| --- | --- | --- |
| Setup & Architecture | Tersedia | Struktur halaman dan modul diperiksa; situs disajikan dari server lokal pada dua origin QA terpisah. |
| UI/UX & Website Design | Tersedia | HTML/CSS diperiksa. Chrome desktop diuji; breakpoint/perangkat lain belum diuji. |
| Visitor Form & Signature | Tersedia | Di Chrome: validasi form kosong, gambar dengan mouse, simpan, halaman sukses, serta tampilan record dashboard lulus. |
| Database & Data Management | Tersedia | Simpan/panggil data dan API batch IndexedDB diuji di origin QA; database kedua origin dibersihkan dan diverifikasi kosong. |
| Admin Dashboard | Tersedia | Jumlah, keadaan kosong, pencarian cocok/tidak cocok, detail field/NIS, dan record ter-restore lulus. Tampilan error database belum diuji runtime. |
| Export CSV | Belum tersedia | Tidak ditemukan implementasi CSV; kebutuhan masih terbuka. |
| Export/Backup JSON | Tersedia | Dashboard membentuk dan membaca ulang backup 1 record; status unduhan dimulai. File unduhan tidak diverifikasi di disk. Validator dan signature diuji terpisah. |
| Restore JSON | Tersedia | Validasi file lulus; skenario API IndexedDB lulus: database kosong, konflik atomik, lewati benturan, verifikasi record/signature, dan abort. Pemilihan file/konfirmasi restore dashboard belum diuji. |
| Integrasi | Sebagian besar alur inti lulus | Form → Canvas → IndexedDB → dashboard lulus. Restore teruji pada API yang dipakai UI, tetapi input file dan konfirmasi UI belum. |
| Final Testing | Belum tuntas | GitHub Pages, perangkat acara/touch, error UI, unduhan file, dan jaringan terputus belum diuji. |

## Lingkungan dan Pengujian

- Browser: Google Chrome di Windows pada komputer ini. Perangkat acara tidak diidentifikasi/tersedia; input Canvas diuji dengan mouse, bukan layar sentuh fisik.
- Origin QA 1: `http://127.0.0.1:5501/` — form validasi, tanda tangan mouse, simpan, halaman sukses, dashboard, pencarian, detail, ekspor JSON, dan keadaan kosong setelah pembersihan.
- Origin QA 2: `http://127.0.0.1:5502/` — dashboard kosong, API restore IndexedDB, verifikasi dashboard, dan pembersihan. Port berbeda memberikan origin/database terpisah.
- Server lokal: Python `http.server`; halaman lokal berfungsi saat koneksi internet normal. Pemutusan jaringan nyata tidak diuji; ini bukan klaim offline.
- Tidak ditemukan URL GitHub Pages/repository dalam proyek; deployment tidak dilakukan.
- Tidak ada data dari `localhost:5500` yang dibaca atau diubah. Empat record QA dibersihkan setelah mendapat persetujuan dan kedua origin uji diverifikasi kosong.

## Ringkasan Hasil Restore

- Backup 2 record ke database kosong: 2 ditambahkan; jumlah menjadi 2.
- Field `id`, `name`, `position`, `nis`, `signature`, dan `createdAt` cocok untuk kedua record, termasuk NIS `0001001` dan signature data URL.
- Batch berisi ID lama dan ID baru dengan kebijakan baku: ditolak; jumlah tetap 2, ID baru tidak ada, record lama tidak berubah.
- Batch yang sama dengan `skipExisting: true`: 1 ditambahkan, 1 dilewati; jumlah menjadi 3. Record lama tidak tertimpa dan semua field/signature record baru cocok.
- Abort IndexedDB sebelum commit: record yang sedang ditulis tidak tersimpan; jumlah tetap 3.
- Dashboard menampilkan ketiga record hasil restore dan detailnya. Signature data URL ditampilkan oleh elemen gambar.
- File rusak, versi 99, jumlah/field/signature invalid, dan ID duplikat ditolak validator. Uji format dilakukan di Node.js; UI pemilih file tidak berhasil diotomasi.

## Batasan dan Keputusan

- Restore diuji melalui API IndexedDB aktual, tetapi bukan melalui pemilihan file dan dialog konfirmasi pada dashboard. Error baca database dashboard juga belum disimulasikan.
- GitHub Pages, Edge/browser tambahan, layar sentuh, persistensi setelah browser ditutup, file unduhan pada disk, dan operasi saat internet benar-benar terputus belum dinyatakan lulus.
- Tidak ada keputusan arsitektur/skema yang diubah. Tidak ada perubahan kode aplikasi pada putaran ini.
- CSV belum tersedia dan tetap menjadi celah terhadap spesifikasi MVP.
- Catatan rinci: `docs/BACKUP_RESTORE_TESTS.md`.
