# Database & Data Management API

Modul: `assets/js/modules/database.js`  
Database: `digital-guestbook` versi `1`  
Object store: `visitors`, `keyPath: "id"`

## Struktur record

Satu record memakai field yang ditetapkan di spesifikasi: `id`, `name`, `position`, `nis`, `signature`, dan `createdAt`. NIS disimpan sebagai string. API ini tidak menambah field atau membuat nilai otomatis; pemanggil menyiapkan ID unik dan waktu pencatatan. Nilai `signature` mengikuti representasi gambar yang dipilih modul tanda tangan.

## API

Semua operasi mengembalikan `Promise`. Operasi tulis selesai hanya setelah transaksi berhasil commit.

| Fungsi | Parameter | Hasil Promise |
| --- | --- | --- |
| `openGuestbookDatabase()` | — | `IDBDatabase` terbuka; caller wajib memanggil `.close()` setelah pemakaian langsung. |
| `addVisitor(visitor)` | Objek record pengunjung, wajib memiliki `id` | ID record yang ditambahkan. ID duplikat menghasilkan error. |
| `getAllVisitors()` | — | Array seluruh record. |
| `getVisitorById(id)` | ID key | Record, atau `undefined` jika tidak ditemukan. |
| `updateVisitor(visitor)` | Objek record lengkap, wajib memiliki `id` | ID record yang ditulis. Menggunakan `put`, sehingga ID yang belum ada akan dibuat. |
| `deleteVisitor(id)` | ID key | `undefined`; ID yang tidak ditemukan tidak menghasilkan error. |
| `addVisitorsSafely(visitors, options)` | Daftar record lengkap dan `{ skipExisting }` | `{ added, skipped }`; seluruh penambahan commit atomik, atau semuanya batal. Konflik default membatalkan transaksi. |

Contoh:

```js
import {
  addVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  deleteVisitor,
  GuestbookDatabaseError,
} from './modules/database.js';

const visitor = {
  id: crypto.randomUUID(),
  name: 'Alya Putri',
  position: 'XI-2',
  nis: '0012345',
  signature: 'data:image/png;base64,...',
  createdAt: new Date().toISOString(),
};

try {
  await addVisitor(visitor);
  const allVisitors = await getAllVisitors();
  const saved = await getVisitorById(visitor.id);
  await updateVisitor({ ...saved, position: 'XI-3' });
  await deleteVisitor(visitor.id);
} catch (error) {
  if (error instanceof GuestbookDatabaseError) {
    console.error(error.operation, error.message, error.cause);
  }
}
```

## Error

Penolakan Promise memakai `GuestbookDatabaseError`, dengan `name`, `message`, `operation` (`open`, `add`, `getAll`, `get`, `update`, atau `delete`), dan `cause` bila browser menyediakan error asal. Pesan operasi database dapat ditampilkan sebagai kegagalan simpan/muat; detail `cause` cocok untuk log pengembang. Validasi argumen (`visitor` tanpa `id` atau ID kosong) juga melempar error yang sama. Jangan menelan rejection karena itu berarti operasi belum dipastikan berhasil.

Operasi memakai transaksi `readonly` untuk baca dan `readwrite` untuk perubahan. Gunakan modul ini sebagai satu-satunya jalur akses store `visitors`; jangan membuat penyimpanan tandingan di `localStorage` atau variabel aplikasi.

`addVisitorsSafely` ditambahkan untuk restore: API CRUD satu record tidak dapat menjamin seluruh backup berhasil atau batal sebagai satu kesatuan. Opsi `skipExisting: true` memeriksa ID dan menambahkan data yang tidak bentrok dalam transaksi yang sama; record lama tidak pernah ditimpa.
