# Panduan Tipografi Aurvella Florist: Playfair Display & Plus Jakarta Sans

Dokumen ini berisi panduan penggunaan dan pemetaan tipografi untuk **Aurvella Florist** (*Spesialis Standing Flower Mewah & Elegan*) dengan mengadopsi gaya **Classic Editorial Luxury** menggunakan kombinasi **Playfair Display** dan **Plus Jakarta Sans**.

---

## 1. Karakter & Konsep Font

* **Heading / Judul Utama:** `Playfair Display` (Serif)
  * **Karakter:** Memiliki kontras garis tebal-tipis yang tinggi, anggun, tegas, dan bernuansa majalah *wedding/fashion* premium.
  * **Kesan Visual:** Menghadirkan *editorial luxury* yang sangat cocok disandingkan dengan produk berbahan akrilik, cermin (*standing mirror*), maupun bunga segar.
  * **Fungsi:** Judul utama, *tagline*, nama kategori, dan headline banner promo.

* **Body Text / Katalog & Detail:** `Plus Jakarta Sans` (Sans-serif)
  * **Karakter:** Modern, bersih, ergonomis, dan buatan desainer Indonesia.
  * **Kesan Visual:** Memberikan keseimbangan modern dan bersih agar teks panjang serta angka tetap terasa ringan dan mudah dipindai di HP.
  * **Fungsi:** Deskripsi produk, nominal harga, tombol navigasi, petunjuk pemesanan, dan isi pesan ucapan.

---

## 2. Pemetaan Penempatan Font (Placement Guide)

### A. Elemen Website (UI/UX Web)

| Elemen Website | Font | Ukuran & Bobot (*Weight*) | Catatan Style |
| :--- | :--- | :--- | :--- |
| **Hero Title (H1)** | `Playfair Display` | 42px–54px / Bold (700) | Memberikan kesan glamor dan elegan di tampilan awal website. |
| **Judul Seksi / Kategori (H2/H3)** | `Playfair Display` | 28px–36px / SemiBold (600) | Digunakan pada seksi *"Katalog Standing Flower"*, *"Rangkaian Akrilik"*, dll. |
| **Eyebrow / Sub-header** | `Plus Jakarta Sans` | 12px–14px / SemiBold (600) | Uppercase, `letter-spacing: 0.12em` (Contoh: *"SPECIALIST STANDING FLOWER BANDUNG"*). |
| **Nama Produk Katalog** | `Plus Jakarta Sans` | 16px–18px / Bold (700) | Sangat jelas dan mudah dipindai calon pembeli saat men-scroll katalog. |
| **Harga Produk & Badge Promo** | `Plus Jakarta Sans` | 16px–20px / ExtraBold (800) | Angka nominal (Rp) dan badge (*"Free Ongkir"*, *"Best Seller"*) terlihat kontras. |
| **Navigasi & Tombol CTA** | `Plus Jakarta Sans` | 14px–16px / SemiBold (600) | Digunakan pada menu header dan tombol *"Pesan via WhatsApp"*. |
| **Kutipan Testimoni** | `Playfair Display` | 20px–24px / Italic (400) | Menambah sentuhan manis, personal, dan estetik pada ulasan pembeli. |

---

### B. Produk Fisik & Media Cetak (Print Assets)

1. **Papan Ucapan Akrilik, Cermin & PVC:**
   * **Judul Utama & Nama Acara** (*Happy Wedding*, *Congratulations*, *Grand Opening*, Nama Pasangan): Gunakan `Playfair Display` agar huruf stiker cutting atau ukiran terlihat anggun dan *high-end*.
   * **Isi Ucapan & Nama Pengirim:** Gunakan `Plus Jakarta Sans` agar terbaca dengan jelas dari jarak pandang tamu undangan.

2. **Kartu Ucapan Bunga (*Greeting Card* & Hangtag):**
   * **Header / Logo Card:** `Playfair Display` (Gaya *boutique florist*).
   * **Isi Pesan Pelanggan:** `Plus Jakarta Sans` (Tetap rapi dan jelas meskipun kalimat ucapan cukup panjang).

3. **Pita Bunga, Stiker Kemasan, & Nota Pembelian:**
   * **Nama Brand ("Aurvella Florist"):** `Playfair Display`.
   * **Informasi Kontak / WhatsApp / Instagram:** `Plus Jakarta Sans`.

---

### C. Media Sosial & Pemasaran Digital

1. **Instagram Feed & Story Banner:**
   * **Headline Promo** (*"Wedding Flower Package"*, *"Special Discount"*): `Playfair Display`.
   * **Keterangan Paket & Call-To-Action (CTA):** `Plus Jakarta Sans`.

2. **Katalog WhatsApp Business:**
   * Gunakan `Plus Jakarta Sans` untuk rincian harga dan pesan otomatis agar nyaman dibaca di layar smartphone berukuran kecil.

---

## 3. Panduan Kode (HTML & CSS)

### Embed Google Fonts (HTML)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Aturan CSS Root & Class

```css
:root {
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

/* Headings */
h1, h2, h3, h4, .font-heading {
  font-family: var(--font-heading);
  font-weight: 700;
  letter-spacing: 0.01em;
}

/* Body & Elements */
body, p, button, input, select, .font-body {
  font-family: var(--font-body);
}

/* Contoh Style Judul Hero */
.hero-title {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.2;
}

/* Contoh Style Tombol WA */
.btn-whatsapp {
  font-family: var(--font-body);
  font-weight: 600;
}
```

---

## 4. Ringkasan Prinsip Hirarki

* **Playfair Display:** Menekankan elemen visual utama yang ingin ditonjolkan (*brand identity*, keanggunan ucapan, headline promo).
* **Plus Jakarta Sans:** Menjamin kepraktisan, kecepatan pembacaan (*readability*), dan fungsionalitas transaksi calon pembeli.