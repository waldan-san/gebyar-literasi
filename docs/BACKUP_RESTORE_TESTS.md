# Catatan Pengujian Backup dan Restore

Tanggal: 25 November 2026

## Lingkungan

- Browser: Google Chrome pada Windows di komputer ini.
- Server: Python `http.server`; aplikasi disajikan lokal pada dua port terpisah.
- Origin `http://127.0.0.1:5501/`: uji alur pengunjung dan dashboard dengan satu record QA.
- Origin `http://127.0.0.1:5502/`: dashboard awal kosong dan uji API IndexedDB restore dengan fixture QA.
- Kedua database uji diverifikasi kosong sesudah record QA dibersihkan. Origin lama `localhost:5500` tidak disentuh.
- Tidak ada perangkat sentuh/komputer acara yang tersedia. Sinyal pointer diuji dengan mouse.

## Matriks Skenario

| Skenario | Status | Bukti/catatan |
| --- | --- | --- |
| Sintaks empat modul aplikasi | Lulus | `node --check` pada `database.js`, `backup.js`, `app.js`, `admin.js`. |
| Form kosong ditolak | Lulus | Chrome menampilkan error nama, jabatan/kelas, dan tanda tangan wajib. |
| Form, tanda tangan mouse, simpan, sukses, record dashboard | Lulus | Data QA tampil di dashboard setelah navigasi halaman; NIS `0012345` tetap berupa string. |
| Pencarian cocok/tidak cocok, detail, keadaan kosong dashboard | Lulus | Hasil cocok dan pesan tak ditemukan terlihat; detail tampil; dashboard origin QA kosong menampilkan jumlah 0 dan pesan kosong. |
| Restore valid ke database kosong | Lulus (API IndexedDB) | `addVisitorsSafely` menambahkan 2; total menjadi 2. |
| Verifikasi field dan signature pasca-restore | Lulus (API + dashboard) | Enam field tiap record sama, termasuk `nis: "0001001"` dan signature data URL; dashboard menampilkan 3 record pasca-merge. |
| Konflik ID membatalkan batch secara atomik | Lulus (API IndexedDB) | Batch bentrok ditolak; jumlah tetap 2, ID baru tidak ada, data lama tetap sama. |
| Opsi skip ID yang sudah ada | Lulus (API IndexedDB) | Hasil 1 ditambah/1 dilewati; jumlah 3; record lama tidak tertimpa; field dan signature record baru cocok. |
| Abort transaksi sebelum commit | Lulus (transaksi IndexedDB QA) | Transaksi `readwrite` di-abort setelah request add; record tidak ditemukan dan jumlah tetap 3. |
| JSON rusak, versi tak didukung, jumlah/field/signature/ID invalid | Lulus (parser/validator) | Kasus invalid ditolak di Node.js; versi 99 juga ditolak. |
| Pembuatan backup dashboard | Sebagian | Dashboard membentuk dan membaca ulang backup 1 record; status menyatakan unduhan dimulai. File hasil unduhan tidak diverifikasi pada disk. |
| Pemilih file dan restore melalui UI dashboard | Belum diuji | Kontrol pemilih file tidak membuka dialog pada otomasi browser ini; alur restore di dashboard belum dinyatakan lulus. |
| Batal pada konfirmasi restore | Belum diuji | Dialog restore UI tidak dapat dicapai tanpa pemilih file. |
| Error baca database pada dashboard | Belum diuji | Belum ada fault injection aman melalui UI. |
| Persistensi sesudah browser ditutup/dibuka | Belum diuji | Navigasi antarhalaman berhasil; proses tutup dan buka ulang browser tidak dilakukan. |

## Bukti Restore API

Harness sementara memanggil API produksi `addVisitorsSafely`, `getAllVisitors`, `openGuestbookDatabase`, `deleteVisitor`, serta validator backup pada origin kosong. Hasil yang tampak di browser:

```text
PASS Restore ke database kosong — ditambah 2, jumlah sesudahnya 2
PASS Jumlah, seluruh field, dan signature pasca-restore — 2 record; 6 field tiap record cocok
PASS Konflik ID membatalkan batch atomik — jumlah tetap 2; ID baru tidak masuk; record lama tidak berubah
PASS Opsi lewati ID yang sudah ada — ditambah 1, dilewati 1, jumlah 3
PASS Abort transaksi sebelum commit — jumlah tetap 3; record batal tidak ditemukan
PASS Format backup hasil uji — visitorCount 3; 3 signature tervalidasi
```

Record uji memakai signature PNG kecil sebagai fixture untuk memverifikasi data URL yang tersimpan dan dapat dirender. Form pengunjung juga diuji dengan goresan mouse pada Canvas.

## Offline, Deployment, dan Batasan

- Aplikasi berhasil dimuat dan menjalankan alur inti dari server lokal saat internet tidak diputus. Ini hanya menguji server lokal dalam kondisi jaringan aktif.
- Koneksi internet benar-benar terputus belum diuji; tidak ada klaim offline.
- Tidak ditemukan URL GitHub Pages/repository. Tidak ada deployment.
- CSV tidak tersedia pada berkas aplikasi yang diperiksa.

## Pembersihan

Empat record QA pada origin `127.0.0.1:5501` dan `127.0.0.1:5502` dibersihkan setelah persetujuan pengguna. Dashboard origin pertama dan harness origin kedua sama-sama mengonfirmasi jumlah/record QA tersisa 0.
