# Project Setup & Architecture

## Struktur

```text
index.html
assets/
  css/base.css
  js/app.js
  js/config.js
  js/modules/database.js
  js/modules/signature-canvas.js
docs/ARCHITECTURE.md
```

## Konvensi

- File dan folder menggunakan `kebab-case`.
- Modul JavaScript menggunakan ES modules dan `kebab-case.js`.
- Fungsi menggunakan `camelCase` dan nama yang menjelaskan tindakan atau factory.
- Konstanta konfigurasi menggunakan `UPPER_SNAKE_CASE`.
- Data pengunjung mengikuti field yang ditetapkan spesifikasi: `id`, `name`, `position`, `nis`, `signature`, `createdAt`.

## Fitur yang sudah tersedia

Form pengunjung, dashboard admin, export JSON, backup, restore terkontrol, dan tanda tangan sudah terhubung. CSV masih tercatat sebagai kebutuhan proyek dan berada di luar modul pekerjaan ini.

## Penyimpanan

Database: `digital-guestbook`, versi `1`.

Object store: `visitors`, dengan `id` sebagai `keyPath`. CRUD dan migrasi lanjutan ditambahkan pada tahap fitur terkait.
