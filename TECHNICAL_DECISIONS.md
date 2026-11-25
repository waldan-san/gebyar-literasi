## Backup dan Restore

- JSON backup memakai `format: digital-guestbook-backup`, versi `1`, dan seluruh record termasuk signature.
- Restore menambahkan saja. Konflik default membatalkan seluruh transaksi; opsi lewati benturan menambahkan ID unik dalam transaksi atomik.
- API `addVisitorsSafely` diperlukan karena fungsi CRUD satu record yang tersedia tidak dapat menjamin restore semua-atau-tidak-sama-sekali.

## Catatan Verifikasi Akhir — 25 November 2026

- Tidak ada keputusan teknis yang diubah. Skema database versi 1 dan kebijakan restore tambah-saja tetap berlaku.
- Pemeriksaan sintaks empat modul aplikasi serta validasi format backup lokal lulus. Lihat `docs/BACKUP_RESTORE_TESTS.md` untuk matriks bukti.
- API IndexedDB diuji di Chrome pada origin kosong terpisah `127.0.0.1:5502`: restore kosong, konflik atomik, opsi lewati, verifikasi seluruh field/signature, dan abort semuanya lulus. Restore melalui pemilih file/konfirmasi UI dashboard belum diuji.
- Alur form → Canvas dengan mouse → IndexedDB → dashboard diuji pada `127.0.0.1:5501`; validasi, detail, pencarian, dan keadaan kosong dashboard juga diperiksa. Origin `localhost:5500` tidak disentuh agar database pengguna tetap aman.
- Implementasi CSV belum ditemukan meskipun masih tercantum dalam spesifikasi MVP. Ini dicatat sebagai pekerjaan yang belum tersedia, bukan keputusan untuk menghapus kebutuhan tersebut.
- URL GitHub Pages/repository dan perangkat acara/touch tidak tersedia. Server lokal diuji ketika koneksi jaringan aktif; jaringan yang benar-benar terputus belum diuji. Tidak ada deployment atau klaim dukungan offline.
- Tidak ada perubahan kode aplikasi pada putaran ini; perubahannya terbatas pada catatan status dan bukti pengujian.
