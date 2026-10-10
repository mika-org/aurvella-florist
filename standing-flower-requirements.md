# PROMPT PEMBUATAN WEBSITE STANDING FLOWER BANDUNG

## 1. Gambaran Umum Proyek

Buat aplikasi website profesional untuk bisnis standing flower di Bandung yang menyediakan katalog produk, informasi layanan, harga promo, testimoni, kontak WhatsApp, Google Maps, formulir pesan, serta halaman Link Tree khusus untuk menggabungkan berbagai tautan bisnis.

Website harus memiliki dua bagian utama:

1. **Frontend Public:** Website yang dapat diakses pelanggan untuk melihat produk dan melakukan pemesanan.
2. **Admin Dashboard:** Panel admin untuk mengelola produk, kategori, harga, promo, SKU, testimoni, informasi bisnis, pesan masuk, dan tautan Link Tree.

Gunakan teknologi berikut:

- Next.js dengan App Router dan TypeScript.
- PostgreSQL sebagai database.
- Prisma ORM untuk pengelolaan database.
- Zod untuk validasi data frontend dan backend.
- Tailwind CSS untuk styling.
- GSAP untuk animasi interaktif.
- React Hook Form dan Zod untuk formulir.
- Lucide React untuk ikon.
- Next.js Image untuk optimasi gambar.

Gunakan versi library yang kompatibel dan stabil. Jangan menggunakan Docker. Buat aplikasi dengan struktur kode yang rapi, modular, mudah dipelihara, aman, dan siap dikembangkan lebih lanjut.

## 2. Identitas dan Desain Website

Buat desain website dengan karakteristik:

- Elegan, feminin, segar, profesional, dan berkelas.
- Warna utama pink lembut, putih, dan emas sebagai aksen.
- Hindari penggunaan warna pink dan emas secara berlebihan.
- Gunakan tipografi yang elegan tetapi tetap mudah dibaca.
- Layout bersih, whitespace cukup, dan hierarki visual yang jelas.
- Card menggunakan shadow tipis dan border minimal.
- Responsive pada desktop, tablet, dan smartphone.
- Animasi halus, tidak berlebihan, dan tidak mengganggu performa.
- Hindari tampilan generik seperti template website hasil generate AI.

Gunakan gambar `hero-banner-2.jpg` yang sudah tersedia sebagai gambar utama pada hero banner. Jangan mengganti gambar tersebut dengan gambar hasil generate atau gambar lain.

Gunakan gambar lokal dari folder `public/images/` jika tersedia. Siapkan struktur aset yang konsisten dan fallback gambar jika suatu aset belum tersedia.

## 3. Struktur Halaman Public

Buat halaman berikut:

- `/` — Homepage.
- `/produk` — Daftar seluruh produk.
- `/produk/[slug]` — Detail produk.
- `/kategori/[slug]` — Produk berdasarkan kategori.
- `/link` — Link Tree bisnis.
- `/kontak` — Informasi kontak dan pengiriman pesan.
- `/admin/login` — Login admin.
- `/admin` — Dashboard admin.

Buat navbar responsif dengan logo bisnis, navigasi kategori atau produk, informasi layanan, tombol WhatsApp, dan akses menuju Link Tree.

### A. Hero Banner

Gunakan gambar `public/images/hero-banner-2.jpg` sebagai gambar hero.

Tampilkan headline utama:

**Spesialist Standing Flower BANDUNG**

Subheadline:

**Fresh & Artificial | Free Ongkir**

Tambahkan informasi singkat mengenai layanan standing flower untuk berbagai kebutuhan, seperti ucapan selamat, perayaan, pembukaan usaha, dan duka cita.

Elemen hero banner:

- Gambar utama `hero-banner-2.jpg`.
- Judul dan subjudul yang mudah dibaca.
- Tombol CTA `Lihat Katalog`.
- Tombol CTA `Pesan via WhatsApp`.
- Informasi promo yang menonjol.
- Harga promo dan harga normal dengan efek coret jika produk promo tersedia.
- Ornamen bunga yang bergerak perlahan di sekitar banner.
- Animasi bunga dan elemen dekoratif dengan GSAP.
- Ornamen tidak menutupi teks, CTA, maupun informasi harga.
- Layout tetap optimal pada mobile.

Gunakan animasi masuk yang halus saat halaman dimuat. Hindari animasi yang terlalu ramai atau menyebabkan pergeseran layout.

### B. Section Pilih Kategori

Tampilkan kategori produk dalam bentuk kartu visual dengan gambar PNG untuk masing-masing kategori.

Kategori yang wajib tersedia:

1. Standing Acrylic.
2. Standing Cermin.
3. Standing VPC.
4. Standing Fresh.
5. Standing Duka Cita.

Setiap kategori memiliki:

- Gambar PNG.
- Nama kategori.
- Deskripsi singkat.
- Jumlah produk jika diperlukan.
- Tautan untuk melihat produk kategori tersebut.

Sediakan aset kategori pada struktur seperti berikut:

- `public/images/categories/standing-acrylic.png`
- `public/images/categories/standing-cermin.png`
- `public/images/categories/standing-vpc.png`
- `public/images/categories/standing-fresh.png`
- `public/images/categories/standing-duka-cita.png`

Jika file gambar belum tersedia, gunakan placeholder lokal yang konsisten dan mudah diganti melalui pengaturan aset.

**Interaksi animasi kategori menggunakan GSAP:**

- Ketika kategori dipilih, berikan animasi zoom-out atau scale-down pada kartu kategori yang dipilih.
- Kategori yang dipilih harus terlihat jelas sebagai kategori aktif.
- Kartu lain dapat sedikit mengecil atau mengalami perubahan opacity.
- Gunakan easing yang lembut dan durasi singkat.
- Jangan membuat semua kartu hilang atau terlalu kecil.
- Pastikan interaksi tetap berfungsi pada perangkat sentuh.
- Sediakan state kategori aktif yang sinkron dengan navigasi atau filter produk.
- Hormati preferensi `prefers-reduced-motion`.

Gunakan GSAP dengan benar melalui `useRef`, `useEffect` atau `useGSAP` jika tersedia, serta lakukan cleanup animasi untuk mencegah memory leak.

### C. Section Produk Unggulan

Tampilkan daftar produk unggulan pada homepage.

Setiap kartu produk menampilkan:

- Foto produk.
- Nama produk.
- Kategori.
- SKU.
- Harga normal.
- Harga promo jika tersedia.
- Label promo jika aktif.
- Tombol `Lihat Detail`.
- Tombol `Pesan via WhatsApp`.

Jika terdapat promo, harga normal harus ditampilkan dengan strikethrough dan harga promo harus lebih menonjol.

Jangan menampilkan harga promo yang tidak valid atau lebih tinggi dari harga normal. Semua harga diambil dari database, bukan ditulis secara hardcoded di komponen.

Tambahkan filter kategori dan navigasi menuju halaman katalog lengkap.

### D. Section Informasi Layanan

Buat section informasi layanan dengan tampilan sederhana dan ikon yang sesuai.

Informasi yang ditampilkan:

1. **Free Ongkir Bandung** — Gratis ongkos kirim sesuai area layanan dan ketentuan bisnis.
2. **Same Day Delivery** — Pesan hari ini, pengiriman hari ini sesuai jam operasional, ketersediaan produk, dan konfirmasi pesanan.
3. **Pelayanan 24/7** — Pelanggan dapat menghubungi bisnis kapan saja. Jelaskan secara transparan apabila waktu produksi atau pengiriman memiliki ketentuan khusus.
4. **Fresh & Artificial Flower** — Pilihan bunga segar dan bunga artificial.
5. **Produk Berkualitas** — Material dan rangkaian bunga dipilih sesuai standar produk.

Jangan menjanjikan gratis ongkir untuk semua wilayah di luar ketentuan yang dikonfigurasi admin.

### E. Section Testimoni

Buat section testimoni pelanggan dengan tampilan elegan.

Fitur:

- Nama pelanggan.
- Foto atau avatar opsional.
- Isi testimoni.
- Rating opsional.
- Tanggal testimoni.
- Status publikasi.

Gunakan carousel yang responsif jika diperlukan. Animasi harus halus dan tidak berjalan terlalu cepat.

Testimoni ditampilkan setelah section layanan atau produk unggulan, serta **wajib berada di atas section Contact Us** pada homepage.

Hanya testimoni yang telah disetujui admin yang dapat ditampilkan ke publik.

### F. Section Contact Us dan WhatsApp

Nomor WhatsApp bisnis:

**085770187018**

Gunakan nomor internasional `6285770187018` untuk tautan WhatsApp.

Buat tombol WhatsApp dengan format URL:

`https://wa.me/6285770187018`

Pesan WhatsApp dapat dibuat otomatis berdasarkan produk yang dipilih, misalnya berisi nama produk, SKU, dan tautan detail produk.

Tampilkan:

- Nomor WhatsApp.
- Tombol chat WhatsApp.
- Alamat bisnis.
- Jam layanan atau informasi operasional.
- Tautan Instagram, Shopee, dan TikTok jika telah dikonfigurasi.

Semua informasi bisnis harus dapat diperbarui dari admin dashboard.

### G. Section Google Maps

Buat section lokasi bisnis yang menampilkan:

- Alamat lengkap.
- Google Maps embed.
- Tombol `Buka di Google Maps`.
- Tombol petunjuk arah.

URL embed dan URL petunjuk arah harus dapat dikonfigurasi melalui admin.

Gunakan iframe yang aman, responsive, dan memiliki `title` yang deskriptif. Jangan menampilkan alamat atau koordinat palsu. Jika data lokasi belum diisi, tampilkan placeholder yang informatif.

### H. Section Kirim Pesan

Buat formulir pesan pelanggan dengan field:

- Nama.
- Nomor WhatsApp.
- Email, opsional.
- Subjek pesan.
- Isi pesan.

Validasi seluruh input menggunakan Zod pada server. Gunakan React Hook Form untuk pengalaman input yang baik.

Fitur:

- Validasi field wajib.
- Validasi nomor WhatsApp.
- Validasi format email.
- Pesan kesalahan yang jelas.
- Loading state saat mengirim.
- Notifikasi berhasil atau gagal.
- Simpan pesan ke database.
- Lindungi endpoint dari spam dengan rate limiting dan honeypot atau mekanisme anti-spam yang sesuai.

Pesan masuk harus tersedia di halaman admin untuk ditinjau dan dikelola.

### I. Footer

Footer berisi:

- Logo dan nama bisnis.
- Deskripsi singkat.
- Navigasi website.
- Kategori produk.
- WhatsApp.
- Instagram, Shopee, dan TikTok.
- Alamat lengkap.
- Tautan Google Maps.
- Link Tree.
- Copyright dengan tahun yang dinamis.

## 4. Halaman Detail Produk

Buat halaman detail produk yang SEO-friendly menggunakan URL slug.

Tampilkan:

- Galeri gambar produk.
- Nama produk.
- SKU.
- Kategori.
- Deskripsi produk.
- Harga normal.
- Harga promo.
- Status ketersediaan.
- Tombol WhatsApp.
- Produk terkait.
- Informasi layanan dan pengiriman.

### Deskripsi Default Produk Standing Flower

Sediakan deskripsi default yang dapat digunakan untuk produk yang sesuai:

- Papan akrilik berkualitas.
- Ketebalan papan 3 mm.
- Bentuk papan persegi dengan ukuran 70 × 120 cm.
- Warna papan akrilik putih susu.
- Menggunakan bunga fresh berkualitas.
- Standing kayu ukuran 150 cm dengan warna putih.

Deskripsi tersebut harus dapat diedit per produk dari admin dashboard. Jangan menerapkan spesifikasi akrilik dan bunga fresh secara otomatis ke produk yang tidak menggunakan material atau jenis bunga tersebut.

Sediakan field deskripsi dan spesifikasi produk yang fleksibel agar setiap produk dapat mempunyai karakteristik berbeda.

## 5. Sistem SKU Otomatis

Setiap produk harus memiliki SKU yang unik dan dibuat secara otomatis ketika produk baru disimpan.

Ketentuan:

- SKU tidak boleh duplikat.
- SKU tidak dibuat dari nama produk saja karena nama produk dapat sama.
- SKU harus tetap unik ketika dua admin membuat produk secara bersamaan.
- SKU dibuat di sisi server.
- Database harus mempunyai unique constraint pada field SKU.
- SKU yang telah diterbitkan tidak berubah ketika nama produk diedit.
- Admin dapat melihat dan menyalin SKU.
- Jika admin mempunyai kebutuhan khusus, sediakan mekanisme penggantian SKU secara manual dengan validasi unik.

Contoh format SKU:

- `ACR-20261011-A8K2`
- `CRM-20261011-B7M4`
- `VPC-20261011-C9P5`
- `FRE-20261011-D3R8`
- `DUK-20261011-E5T6`

Prefix menyesuaikan kategori, tanggal menunjukkan tanggal pembuatan, dan suffix dibuat dari karakter acak yang aman.

Buat fungsi generator SKU terpisah, validasi input, serta mekanisme retry apabila terjadi konflik unique constraint.

Jangan hanya memeriksa SKU di frontend. Database harus menjadi sumber validasi akhir.

## 6. Halaman Link Tree

Buat halaman publik `/link` yang berfungsi sebagai satu halaman untuk menggabungkan seluruh tautan bisnis.

Desain:

- Background elegan dengan warna pink lembut, putih, dan aksen emas.
- Profil bisnis, logo, dan deskripsi singkat.
- Animasi kupu-kupu, bunga, dan daun bergerak secara halus.
- Tombol link dengan desain konsisten.
- Responsive pada perangkat mobile.
- Tetap ringan dan mudah digunakan.

### Jenis tautan yang didukung

1. Instagram.
2. Shopee.
3. TikTok.
4. Google Drive.
5. Website utama.
6. WhatsApp.
7. Google Maps.
8. Tautan khusus lainnya.

Admin harus dapat menambahkan banyak tautan Google Drive dengan field:

- Judul tautan.
- URL Google Drive.
- Deskripsi opsional.
- Ikon atau gambar opsional.
- Urutan tampilan.
- Status aktif atau nonaktif.

Contoh judul:

- Pricelist Standing Flower.
- Katalog Produk.
- Katalog Standing Fresh.
- Portofolio.
- Panduan Pemesanan.

Contoh tersebut hanya data awal dan bukan tautan yang sudah tersedia. Admin harus memasukkan URL sebenarnya.

Fitur pengelolaan tautan:

- Tambah, edit, hapus tautan.
- Mengatur urutan dengan drag-and-drop atau kontrol urutan.
- Mengaktifkan dan menonaktifkan tautan.
- Memilih jenis tautan.
- Memvalidasi URL menggunakan Zod.
- Menampilkan tautan aktif saja pada halaman publik.
- Membuka tautan eksternal dengan konfigurasi keamanan yang sesuai.

Gunakan animasi GSAP untuk kupu-kupu, bunga, dan daun dengan gerakan yang lembut, seperti floating, sway, atau perpindahan kecil. Batasi jumlah elemen animasi agar tidak mengganggu performa.

Pada perangkat mobile, kurangi ornamen dan intensitas animasi. Hormati `prefers-reduced-motion`.

## 7. Admin Dashboard

Buat halaman admin dengan autentikasi yang aman dan tampilan dashboard responsif.

### A. Login Admin

- Login menggunakan email atau username dan password.
- Password disimpan menggunakan hash yang aman, bukan plaintext.
- Gunakan session atau mekanisme autentikasi yang aman.
- Proteksi seluruh route admin.
- Validasi input menggunakan Zod.
- Tambahkan rate limiting untuk percobaan login.
- Jangan mengandalkan penyembunyian menu di frontend sebagai satu-satunya kontrol akses.

Gunakan solusi autentikasi yang kompatibel dengan Next.js App Router, misalnya Auth.js, atau implementasi session yang telah diaudit dengan baik.

### B. Dashboard Utama

Tampilkan ringkasan:

- Total produk.
- Total kategori.
- Produk promo aktif.
- Total testimoni yang dipublikasikan.
- Pesan masuk yang belum dibaca.
- Jumlah tautan aktif.

Sediakan navigasi sidebar yang sederhana dan responsif.

### C. Manajemen Produk

Fitur:

- Tambah produk.
- Edit produk.
- Hapus produk.
- Upload gambar produk.
- Kelola galeri gambar.
- Pilih kategori.
- Input nama dan slug.
- SKU otomatis.
- Harga normal.
- Harga promo.
- Status produk.
- Deskripsi.
- Spesifikasi produk.
- SEO title dan meta description.
- Status publikasi.
- Pengurutan produk.

Gunakan validasi Zod di sisi server untuk setiap proses CRUD.

Harga disimpan menggunakan tipe database yang sesuai untuk nilai uang, seperti Decimal, bukan floating-point yang berpotensi menimbulkan ketidakakuratan.

### D. Manajemen Kategori

Admin dapat:

- Menambah, mengedit, dan menghapus kategori.
- Mengatur nama kategori.
- Mengatur slug.
- Mengunggah gambar PNG kategori.
- Mengatur deskripsi.
- Mengatur urutan kategori.
- Mengaktifkan atau menonaktifkan kategori.

Cegah penghapusan kategori jika masih digunakan produk, kecuali tersedia mekanisme relasi ulang yang aman.

### E. Manajemen Promo

Admin dapat mengatur:

- Harga normal.
- Harga promo.
- Periode promo jika diperlukan.
- Status aktif atau nonaktif.

Pastikan harga promo valid dan tidak lebih besar daripada harga normal. Promo yang sudah berakhir tidak boleh ditampilkan sebagai promo aktif.

### F. Manajemen Testimoni

Admin dapat menambah, mengedit, menghapus, menyetujui, dan menyembunyikan testimoni.

### G. Manajemen Pesan

Admin dapat melihat:

- Nama pengirim.
- Nomor WhatsApp.
- Email.
- Subjek.
- Isi pesan.
- Tanggal pesan.
- Status pesan: baru, dibaca, ditindaklanjuti, selesai.

Sediakan pencarian, filter status, pagination, dan detail pesan.

### H. Pengaturan Website

Sediakan halaman pengaturan untuk mengelola:

- Nama bisnis.
- Logo.
- Deskripsi bisnis.
- Nomor WhatsApp.
- Alamat lengkap.
- Jam operasional.
- Informasi free ongkir.
- Ketentuan same-day delivery.
- Instagram.
- Shopee.
- TikTok.
- URL Google Maps embed.
- URL petunjuk arah.
- Informasi footer.
- SEO metadata.

### I. Manajemen Link Tree

Admin dapat mengelola seluruh tautan yang ditampilkan di halaman `/link`, termasuk menambahkan banyak tautan Google Drive dengan judul berbeda.

## 8. Database dan Prisma

Gunakan PostgreSQL dan Prisma ORM.

Buat schema Prisma yang terstruktur dengan nama model dan field konsisten. Gunakan `snake_case` untuk pemetaan nama tabel database melalui `@@map` dan nama kolom melalui `@map` jika diperlukan.

Minimal buat model:

- `Admin`
- `Category`
- `Product`
- `ProductImage`
- `Testimonial`
- `ContactMessage`
- `SocialLink`
- `SiteSetting`

Tambahkan field audit seperti `created_at` dan `updated_at` jika relevan.

Relasi utama:

- Satu kategori mempunyai banyak produk.
- Satu produk dapat mempunyai banyak gambar.
- Admin mengelola produk, kategori, testimoni, pesan, dan tautan.
- Pengaturan website menyimpan informasi bisnis yang diperlukan.

Persyaratan database:

- SKU unik.
- Slug produk unik.
- Slug kategori unik.
- Index pada field yang sering digunakan untuk pencarian dan filter.
- Foreign key dan kebijakan penghapusan yang tepat.
- Migration Prisma yang dapat dijalankan pada lingkungan development dan production.
- Seed data untuk lima kategori awal.

Jangan menyimpan password, secret, atau kredensial sensitif dalam tabel pengaturan website.

## 9. Validasi dengan Zod

Buat schema Zod terpisah berdasarkan kebutuhan, misalnya:

- `productSchema`
- `categorySchema`
- `testimonialSchema`
- `contactMessageSchema`
- `socialLinkSchema`
- `adminLoginSchema`
- `siteSettingSchema`

Gunakan validasi pada server untuk semua operasi tulis, termasuk operasi admin.

Validasi setidaknya:

- Field wajib.
- Panjang teks.
- Format slug.
- Format URL.
- Format email.
- Format nomor WhatsApp.
- Harga tidak negatif.
- Harga promo tidak melebihi harga normal.
- SKU unik melalui pemeriksaan database.
- Tipe dan ukuran file gambar.
- Jenis file upload yang diizinkan.

Jangan menganggap validasi frontend cukup untuk mengamankan database.

## 10. Struktur Folder

Gunakan struktur modular seperti berikut dan sesuaikan jika ada kebutuhan teknis yang lebih baik.

```text
src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── produk/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── kategori/[slug]/page.tsx
│   │   ├── link/page.tsx
│   │   └── kontak/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   ├── page.tsx
│   │   ├── produk/
│   │   ├── kategori/
│   │   ├── testimoni/
│   │   ├── pesan/
│   │   ├── link/
│   │   └── pengaturan/
│   └── api/
├── components/
│   ├── layout/
│   ├── sections/
│   ├── products/
│   ├── categories/
│   ├── forms/
│   ├── animations/
│   └── ui/
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── validations/
│   └── utils/
├── services/
├── hooks/
└── types/

prisma/
├── schema.prisma
└── seed.ts

public/
└── images/
    ├── hero-banner-2.jpg
    └── categories/
```

Pisahkan akses database, validasi, business logic, dan tampilan UI. Hindari menempatkan seluruh logika ke dalam satu file atau komponen besar.

## 11. Keamanan dan Performa

Terapkan:

- Autentikasi dan otorisasi server-side.
- Password hashing yang aman.
- Validasi input pada server.
- Proteksi route admin.
- Rate limiting pada login dan formulir pesan.
- Sanitasi atau rendering teks yang aman.
- Validasi tipe dan ukuran file upload.
- Proteksi terhadap akses data tanpa otorisasi.
- Penanganan error yang konsisten.
- Optimasi gambar dan lazy loading.
- Pagination untuk daftar produk dan pesan.
- Metadata SEO dan sitemap.
- Structured data produk jika datanya tersedia.
- Responsive design.
- Aksesibilitas dasar, termasuk alt gambar dan navigasi keyboard.

Jangan menaruh secret di kode frontend atau mengirimkan kredensial database ke browser.

Untuk penyimpanan gambar, buat abstraksi penyimpanan yang jelas. Gunakan penyimpanan lokal yang sesuai untuk development dan dokumentasikan konfigurasi penyimpanan production. Jangan mengandalkan direktori lokal yang bersifat sementara jika deployment menggunakan filesystem ephemeral.

## 12. Panduan Implementasi

Kerjakan proyek secara bertahap:

1. Siapkan proyek Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL, dan Zod.
2. Buat schema database dan migration.
3. Buat seed untuk lima kategori awal.
4. Implementasikan autentikasi admin.
5. Buat CRUD kategori dan produk.
6. Implementasikan generator SKU otomatis.
7. Buat frontend homepage beserta seluruh section.
8. Implementasikan halaman katalog dan detail produk.
9. Tambahkan GSAP untuk animasi kategori dan ornamen dekoratif.
10. Buat halaman Link Tree dan pengelolaan tautannya.
11. Buat formulir kontak dan pengelolaan pesan.
12. Buat manajemen testimoni dan pengaturan website.
13. Implementasikan SEO, optimasi performa, dan keamanan.
14. Uji semua fitur, termasuk mobile, sebelum deployment.

## 13. Kriteria Selesai

Proyek dianggap selesai apabila:

- Seluruh section homepage berfungsi dan tersusun sesuai urutan yang ditentukan.
- Hero menggunakan `hero-banner-2.jpg`.
- Kategori mempunyai gambar PNG dan animasi GSAP saat dipilih.
- Harga normal dan promo ditampilkan dengan benar.
- SKU dibuat otomatis dan dijamin unik oleh database.
- Detail produk dapat dikelola melalui admin.
- Link Tree mendukung banyak tautan, termasuk tautan Google Drive dengan judul dan URL yang dapat diedit.
- Ornamen kupu-kupu, bunga, dan daun bergerak secara halus.
- WhatsApp menggunakan nomor bisnis yang telah ditentukan.
- Alamat dan Google Maps dapat dikonfigurasi.
- Formulir pesan tersimpan di database.
- Testimoni dapat dikelola dan disetujui admin.
- Admin dapat mengelola kategori, produk, promo, pesan, tautan, dan informasi bisnis.
- Validasi Zod diterapkan di server.
- Database menggunakan Prisma dan PostgreSQL.
- Tidak ada tombol penting yang hanya bersifat dekoratif.
- Tidak ada data bisnis palsu yang ditampilkan sebagai informasi resmi.
- Tidak ada Docker.
- Proyek memiliki README yang berisi instalasi, konfigurasi `.env`, migrasi, seed, pembuatan admin awal, dan deployment.

**Instruksi akhir:** Bangun aplikasi yang benar-benar berfungsi, bukan sekadar mockup UI. Implementasikan database, autentikasi, CRUD, validasi, animasi, dan integrasi WhatsApp secara nyata. Jika informasi seperti logo, gambar kategori, alamat, pricelist, atau URL sosial media belum tersedia, buat konfigurasi atau placeholder yang jelas agar dapat dilengkapi melalui admin dashboard. Jangan mengarang data bisnis yang belum diberikan.