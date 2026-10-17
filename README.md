# Aurvella Florist Bandung — Website Standing Flower Profesional

Website profesional untuk bisnis **Aurvella Florist** di Bandung yang menyediakan katalog produk standing flower, informasi layanan unggulan, harga promo, ulasan testimoni, kontak WhatsApp resmi, peta workshop Google Maps, formulir kirim pesan, tautan Link Tree bisnis (`/link`), serta **Admin Dashboard** lengkap.

---

## 🌸 Fitur Utama

### 1. Frontend Public
- **Hero Banner Interaktif:** Menggunakan visual utama `hero-banner-2.jpg`, ornamen bunga melayang bertenaga **GSAP**, badge promo diskon, serta tombol CTA langsung.
- **Section Pilih Kategori:** 5 Kategori wajib (*Standing Acrylic, Standing Cermin, Standing PVC, Standing Fresh, Standing Duka Cita*) dengan animasi interaktif GSAP saat diklik.
- **Produk Unggulan & Filter:** Katalog pilihan dengan harga normal, harga promo (strikethrough), label promo aktif, dan tombol pesan via WhatsApp otomatis.
- **Informasi Layanan 24/7 & Garansi:** Free Ongkir Bandung, Same Day Delivery, pelayanan 24/7, fresh & artificial flower, serta jaminan kualitas produk.
- **Ulasan Testimoni Pelanggan:** Carousel ulasan yang telah diverifikasi dan disetujui admin (*wajib di atas kontak*).
- **Kontak & Lokasi Workshop:** Nomor WhatsApp bisnis `085770187018`, formulir pesan pelanggan dengan validasi Zod & proteksi anti-spam honeypot, serta iframe embed Google Maps.
- **Halaman Link Tree Eksklusif (`/link`):** Desain feminin lembut dengan animasi kupu-kupu dan kelopak bunga melayang GSAP, mendukung banyak tautan Google Drive pricelist/portofolio, marketplace, dan WhatsApp.
- **Halaman Detail Produk (`/produk/[slug]`):** SEO-friendly, galeri foto, SKU generator otomatis, spesifikasi material lengkap, dan direct WhatsApp order.

### 2. Admin Dashboard (`/admin`)
- **Autentikasi Aman:** Password hashing dengan bcrypt dan manajemen session JWT / HTTP-only cookies (`jose`).
- **Dashboard Ringkasan:** Statistik real-time total produk, kategori, produk promo aktif, testimoni disetujui, dan pesan baru.
- **Manajemen Produk:** Tambah, edit, hapus, kelola harga promo, status unggulan, deskripsi, spesifikasi akrilik default, dan SKU otomatis dengan prefix dinamis (`ACR-`, `CRM-`, `PVC-`, `FRE-`, `DUK-`).
- **Manajemen Kategori:** CRUD kategori produk, gambar PNG, dan proteksi penghapusan jika kategori masih memiliki produk.
- **Manajemen Testimoni:** Persetujuan ulasan (tayang / sembunyikan) dan penambahan ulasan baru.
- **Manajemen Pesan Masuk:** Tinjau pesan formulir, update status (Baru, Dibaca, Diproses, Selesai), dan balas langsung ke WhatsApp pengirim.
- **Manajemen Link Tree:** Kelola tombol tautan `/link` termasuk file Google Drive, urutan tampilan, dan status aktif.
- **Pengaturan Website:** Konfigurasi nama bisnis, WhatsApp, alamat, jam operasional, Google Maps embed, dan sosmed secara dinamis tanpa hardcode.

---

## 🛠️ Teknologi yang Digunakan

- **Runtime & Package Manager:** Node.js (v20+) & npm
- **Framework:** Next.js (App Router) & React
- **Bahasa:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma ORM
- **Validasi:** Zod & React Hook Form
- **Styling:** Tailwind CSS
- **Animasi:** GSAP & @gsap/react
- **Ikon:** Lucide React
- **Autentikasi:** bcryptjs & jose (JWT)

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### 1. Kloning dan Instal Dependensi

```bash
cd aurvella-florist
npm install
```

### 2. Konfigurasi Lingkungan (`.env`)

Buat atau periksa file `.env` di direktori root:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:5432/<database>?schema=public"
JWT_SECRET="your-super-secret-jwt-key-aurvella-florist-2026"
```

### 3. Sinkronisasi Database Prisma

Sinkronkan skema database PostgreSQL menggunakan Prisma:

```bash
npx prisma db push
```

### 4. Menjalankan Seed Data Awal

Jalankan script seed untuk membuat akun admin default, 5 kategori wajib, produk unggulan, pengaturan bisnis, testimoni, dan tautan Link Tree:

```bash
npx tsx prisma/seed.ts
```

### 5. Kredensial Admin Default

- **URL Login:** `http://localhost:3000/admin/login`
- **Username:** `admin` (atau `admin@aurvellaflorist.com`)
- **Password:** `admin123`

### 6. Menjalankan Server Pengembangan

```bash
npm run dev
```

Buka peramban di `http://localhost:3000`.

---

## 📁 Struktur Rute Website

| Rute URL | Keterangan |
| :--- | :--- |
| `/` | Beranda utama dengan 7 section lengkap |
| `/produk` | Katalog seluruh standing flower & filter kategori |
| `/produk/[slug]` | Detail produk, spesifikasi, & pesan WhatsApp |
| `/kategori/[slug]` | Daftar produk berdasarkan kategori terpilih |
| `/link` | Halaman Link Tree bisnis dengan animasi GSAP |
| `/kontak` | Informasi kontak, formulir pesan, & Google Maps |
| `/admin/login` | Halaman login administrator |
| `/admin` | Ringkasan metrik dashboard admin |
| `/admin/produk` | Manajemen CRUD katalog & promo produk |
| `/admin/kategori` | Manajemen kategori produk & gambar PNG |
| `/admin/testimoni` | Manajemen & moderasi testimoni pelanggan |
| `/admin/pesan` | Manajemen kotak masuk pesan formulir |
| `/admin/link` | Manajemen tautan Link Tree & Google Drive |
| `/admin/pengaturan` | Pengaturan profil bisnis, WhatsApp, & Maps |

---

## 🌐 Panduan Deployment

Aplikasi ini siap dideploy ke platform cloud modern seperti Vercel, Node.js VPS, atau Railway:

1. Pastikan environment variable `DATABASE_URL` dan `JWT_SECRET` telah diset di dashboard hosting.
2. Build command: `npm run build`
3. Output direktori: `.next`
4. Jalankan migrasi / db push pada saat deployment build step jika diperlukan: `npx prisma generate && npx prisma db push`.
