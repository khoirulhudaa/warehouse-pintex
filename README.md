# StokGudang — Sistem Manajemen Stok Gudang

Aplikasi manajemen inventaris multi-gudang berbasis **Laravel + Inertia.js + React**. Dibangun untuk mendemonstrasikan CRUD dengan relasi antar tabel (one-to-many, many-to-many dengan pivot), transaksi database, serta desain UI yang bersih dan modern.

## Tech Stack

- **Backend:** Laravel 13, MySQL/SQLite
- **Frontend:** React + Inertia.js, Tailwind CSS
- **Auth:** Laravel Breeze

## Fitur

- **Dashboard** — ringkasan total produk, total stok, jumlah gudang, dan alert stok menipis
- **Manajemen Produk** — CRUD produk dengan relasi ke Kategori & Supplier, pencarian, indikator status stok
- **Pergerakan Stok** — pencatatan stok masuk/keluar/penyesuaian per gudang, dengan validasi otomatis dan riwayat transaksi
- **Manajemen Gudang, Kategori, dan Supplier** — CRUD lengkap dengan relasi ke data produk

## Struktur Relasi Database

```
Category  ──┐
            ├──< Product >──┬──< Warehouse   (many-to-many, pivot: quantity)
Supplier  ──┘               │
                             └──< StockMovement (mencatat histori, auto-update stok pivot)
```

## Cara Menjalankan (Local Setup)

### 1. Clone repository

```bash
git clone <url-repo-ini>
cd warehouse-app
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Setup environment

```bash
cp .env.example .env
php artisan key:generate
```

Project ini menggunakan **SQLite** secara default agar mudah dijalankan tanpa setup database server terpisah. Pastikan `.env` berisi:

```
DB_CONNECTION=sqlite
```

Buat file database-nya:

```bash
touch database/database.sqlite
```
*(Windows CMD: `type nul > database\database.sqlite`)*

> Ingin pakai MySQL? Cukup ubah `DB_CONNECTION=mysql` beserta kredensial di `.env`, lalu buat database-nya secara manual — tidak ada perubahan kode yang diperlukan karena project ini menggunakan Eloquent ORM.

### 4. Migrasi database + isi data contoh

```bash
php artisan migrate:fresh --seed
```

Perintah ini akan membuat seluruh tabel dan mengisi data contoh (kategori, supplier, gudang, produk, beserta histori stok awal).

### 5. Jalankan aplikasi

Buka dua terminal:

```bash
# Terminal 1 — compile frontend
npm run dev
```

```bash
# Terminal 2 — jalankan server
php artisan serve
```

Buka browser ke **http://127.0.0.1:8000**

### 6. Login

Gunakan akun demo yang sudah dibuat otomatis oleh seeder:

```
Email    : admin@warehouse.test
Password : password
```

Atau buat akun baru sendiri melalui halaman **Register**.

## Struktur Proyek yang Relevan

```
app/
├── Models/              → Category, Supplier, Warehouse, Product, StockMovement
└── Http/Controllers/    → Controller CRUD tiap entitas + logika transaksi stok

database/
├── migrations/          → Skema tabel & pivot
└── seeders/             → Data contoh untuk demo

resources/js/
├── Layouts/AppLayout.jsx
├── Components/UI.jsx    → Komponen reusable (Modal, Button, Input, dll)
└── Pages/               → Dashboard, Products, Categories, Suppliers, Warehouses, StockMovements

routes/web.php           → Definisi seluruh route aplikasi
```

## Catatan Teknis

- Setiap pencatatan pergerakan stok (`StockMovement`) memperbarui kolom `quantity` pada tabel pivot `product_warehouse` secara **transactional** (`DB::transaction`), termasuk validasi agar stok tidak bisa menjadi negatif.
- Menghapus sebuah pergerakan stok akan otomatis membalikkan efeknya terhadap stok gudang terkait.

## Screenshot

*(tambahkan screenshot dashboard, halaman produk, dan form pergerakan stok di sini)*

---

Dibuat sebagai portofolio pribadi untuk mendemonstrasikan kemampuan fullstack development dengan Laravel & React.
