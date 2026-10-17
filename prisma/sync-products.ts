import fs from 'fs';
import path from 'path';
import prisma from '../src/lib/prisma';

const FOLDER_CATEGORY_MAP: Record<string, { slug: string; name: string; prefix: string; description: string; defaultImage: string }> = {
  'Bunga Papan Dukacita': {
    slug: 'bunga-papan-dukacita',
    name: 'Bunga Papan Dukacita',
    prefix: 'BPD',
    description: 'Rangkaian bunga papan duka cita khidmat dan megah dengan aneka ukuran untuk penghormatan serta simpati mendalam di Bandung.',
    defaultImage: '/products/Bunga Papan Dukacita/Dukacita 2x1,5 meter 1000k.jpg',
  },
  'Standing Acrylik Artificial': {
    slug: 'standing-acrylic',
    name: 'Standing Acrylic',
    prefix: 'ACR',
    description: 'Rangkaian bunga standing papan akrilik mewah bernuansa soft pink & gold berkelas untuk peresmian dan selebrasi.',
    defaultImage: '/products/Standing Acrylik Artificial/Standing Acrylik Artificial 800K.jpg',
  },
  'Standing Cermin-Miror Artificial': {
    slug: 'standing-cermin',
    name: 'Standing Cermin',
    prefix: 'CRM',
    description: 'Standing mirror florist estetik elegan untuk momen wedding, lamaran, peresmian butik, dan grand opening.',
    defaultImage: '/products/Standing Cermin-Miror Artificial/Standing Cermin_Miror 850k.jpg',
  },
  'Standing Dukacita Fresh Flower': {
    slug: 'standing-duka-cita',
    name: 'Standing Duka Cita',
    prefix: 'DUK',
    description: 'Standing flower belasungkawa bunga segar anggun bernuansa putih dan krem untuk ungkapan simpati mendalam.',
    defaultImage: '/products/Standing Dukacita Fresh Flower/1000k.jpg',
  },
  'Standing Flower Fresh': {
    slug: 'standing-fresh',
    name: 'Standing Fresh',
    prefix: 'FRE',
    description: 'Rangkaian bunga segar alami pilihan dengan keharuman bunga asli mawar, krisan, lily, dan hydrangea berkelas.',
    defaultImage: '/products/Standing Flower Fresh/1500k.jpg',
  },
  'Standing Flower PVC Artificial': {
    slug: 'standing-pvc',
    name: 'Standing PVC',
    prefix: 'PVC',
    description: 'Papan bunga standing foam PVC modern bernuansa premium, warna cerah tahan lama untuk ucapan sukses dan grand opening.',
    defaultImage: '/products/Standing Flower PVC Artificial/Standing PVC Hologram Artificial 600K.jpg',
  },
};

function parsePrice(fileName: string): { price: number; promoPrice?: number; isPromo: boolean } {
  const lower = fileName.toLowerCase();
  
  if (lower.includes('satuan 700k sepasang 1300k')) {
    return { price: 700000, promoPrice: 650000, isPromo: true };
  }
  if (lower.includes('2000k')) return { price: 2000000, isPromo: false };
  if (lower.includes('1700k')) return { price: 1700000, isPromo: false };
  if (lower.includes('1500k')) return { price: 1500000, isPromo: false };
  if (lower.includes('1350k')) return { price: 1350000, isPromo: false };
  if (lower.includes('1300k')) return { price: 1300000, isPromo: false };
  if (lower.includes('1200k')) return { price: 1200000, isPromo: false };
  if (lower.includes('1000k')) return { price: 1000000, isPromo: false };
  if (lower.includes('950k')) return { price: 950000, isPromo: false };
  if (lower.includes('900k')) return { price: 900000, isPromo: false };
  if (lower.includes('850k')) return { price: 850000, isPromo: false };
  if (lower.includes('800k')) return { price: 800000, isPromo: false };
  if (lower.includes('750k')) return { price: 750000, isPromo: false };
  if (lower.includes('700k')) return { price: 700000, isPromo: false };
  if (lower.includes('650k')) return { price: 650000, isPromo: false };
  if (lower.includes('600k')) return { price: 600000, isPromo: false };
  if (lower.includes('550k')) return { price: 550000, isPromo: false };
  if (lower.includes('500k')) return { price: 500000, isPromo: false };
  if (lower.includes('400k')) return { price: 400000, isPromo: false };

  const match = lower.match(/(\d+)k/);
  if (match) {
    return { price: parseInt(match[1], 10) * 1000, isPromo: false };
  }

  return { price: 750000, isPromo: false };
}

const FLORAL_ELEGANT_NAMES: Record<string, string[]> = {
  'Bunga Papan Dukacita': [
    'Serene Solace', 'Eternal Memory', 'Sacred Peace', 'Rest in Heaven', 'Graceful Tribute',
    'Pure Condolence', 'Divine White', 'Noble Remembrance', 'Everlasting Solace', 'Grand Sympathy',
    'Celestial Peace', 'Sacred Lily Tribute', 'Imperial Tribute Suite', 'Royal Condolence Deluxe'
  ],
  'Standing Acrylik Artificial': [
    'Sweet Orchid Elegance', 'Pastel Charm Blossom', 'Soft Blush Serenade', 'Blossom White Grace',
    'Royal Golden Touch', 'Peach Garden Melody', 'Rose Radiance Deluxe', 'Glamour Bloom Splendor',
    'Floral Symphony Pink', 'Aurvella Deluxe Classic', 'Luxury Rose Arch Golden', 'Majestic Pink Bloom',
    'Opulent Blossom Arch', 'Crystal Elegance Suite', 'Grand Imperial Rose Board', 'Grand Royal Blossom Board',
    'Grand Golden Orchid Board'
  ],
  'Standing Cermin-Miror Artificial': [
    'Mirror Floral Arch Classic', 'Mirror Champagne Romance', 'Mirror Ivory Grace Arch',
    'Mirror Gold Accent Chic', 'Mirror Rose Garden Bliss', 'Mirror Pastel Bliss Deluxe',
    'Mirror Blushing Bride Curve', 'Mirror Velvet Luxe Arch', 'Mirror Pearl White Glow',
    'Mirror Luxury Golden Curve', 'Mirror Royal Grandeur', 'Mirror Floral Garland Luxe',
    'Mirror Elegance Blossom Arch', 'Mirror Grand Imperial Suite', 'Mirror Royal Cathedral Arch'
  ],
  'Standing Dukacita Fresh Flower': [
    'White Lily of Solace', 'Serene Peace Tribute', 'Pure Devotion Memorial', 'Gentle Comfort Bouquet',
    'Angelic Whisper Arch', 'Solace Bloom Eternal', 'Silent Hope Tribute', 'Eternal Grace White',
    'Sacred White Majesty', 'Deep Reverence Memorial', 'Tranquil Memory Arch', 'Peaceful Rest Cascade',
    'Heavenly Rest Sanctuary', 'Serenade of Peace', 'White Blossom Arch Deluxe', 'Sacred Tribute Grand',
    'Noble Condolence Bloom', 'Graceful Heritage Memorial', 'Majesty White Symphony', 'Everlasting Love Solace',
    'Pure Sanctuary Lily', 'Grand Memorial Tribute', 'Royal Tribute White Lily', 'Divine Peace Cascade',
    'Imperial Solace Grand Arch', 'Golden Lily Arch Memorial', 'Grand Majesty Eternal', 'Supreme Honor Memorial',
    'Cathedral White Deluxe', 'Imperial Grandeur White Cascade'
  ],
  'Standing Flower Fresh': [
    'Classic Rose Radiance', 'Blooming Sunshine Gerbera', 'Peach Blossom Romance', 'Vibrant Garden Fiesta',
    'Pastel Radiance Hydrangea', 'Ruby Blossom Deluxe', 'Royal Orchid Cascade', 'Sunset Melody Warmth',
    'Elegance Mix Fresh Flora', 'Celebration Joy Garden', 'Golden Sunrise Splendor', 'Grand Opening Delight',
    'Spectacular Bloom Arch', 'Majestic Flora Deluxe', 'Imperial Grace Lily Mix', 'Cascading Waterfall Flora',
    'Opulent Romance Roses', 'Grandeur Celebration Stand', 'Royal Extravaganza Blossom', 'Empress Garden Masterpiece',
    'Imperial Masterpiece Stand', 'Royal Palace Deluxe Grand', 'Harmony Duo (Sepasang Spesial)', 'Peresmian Gunting Pita Grand Opening'
  ],
  'Standing Flower PVC Artificial': [
    'PVC Rose Bloom Pastel', 'PVC Soft Blush Sweet', 'PVC Lavender Dream Chic', 'PVC Ruby Red Celebration',
    'PVC Pink Champagne Arch', 'PVC White Peony Classic', 'PVC Sunset Pastel Modern', 'PVC Golden Arch Luxury',
    'PVC Blossom Breeze Cheerful', 'PVC Peach Romance Bloom', 'PVC Crimson Velvet Grand', 'PVC Royal Magenta Vibrant',
    'PVC Grand Opening Scarlet', 'PVC Golden Ribbon Festive', 'PVC Elegant Scarlet Crown', 'PVC Pastel Celebration Joy',
    'PVC Emerald Glow Modern', 'PVC Royal Blue Accent Chic', 'PVC Coral Radiance Festive', 'PVC Luxury Crown Festive',
    'PVC Hologram Shimmer Sparkle', 'PVC Hologram Iridescent Dream', 'PVC Hologram Aurora Glow',
    'PVC Hologram Prism Luxe', 'PVC Hologram Diamond Sparkle', 'PVC Hologram Rainbow Radiance'
  ]
};

function formatPriceDisplay(num: number): string {
  if (num >= 1000000) {
    const jt = num / 1000000;
    return `${jt.toString().replace('.', ',')} Juta`;
  }
  return `${Math.round(num / 1000)}K`;
}

function generateCleanName(folder: string, fileName: string, index: number, price: number): string {
  const pool = FLORAL_ELEGANT_NAMES[folder] || [];
  const elegantName = pool[index] || `Collection No. ${index + 1}`;
  
  if (folder === 'Bunga Papan Dukacita') {
    const matchSize = fileName.match(/(\d+x[\d,]+)\s*meter/i);
    const sizeStr = matchSize ? ` ${matchSize[1]}m` : '';
    return `Bunga Papan Dukacita${sizeStr} - ${elegantName} (${formatPriceDisplay(price)})`;
  }

  if (folder === 'Standing Acrylik Artificial') {
    if (fileName.toLowerCase().includes('120x70cm')) {
      return `Standing Papan Acrylic Grand 120x70cm - ${elegantName} (${formatPriceDisplay(price)})`;
    }
    return `Standing Acrylic - ${elegantName} (${formatPriceDisplay(price)})`;
  }

  if (folder === 'Standing Cermin-Miror Artificial') {
    return `Standing Cermin - ${elegantName} (${formatPriceDisplay(price)})`;
  }

  if (folder === 'Standing Dukacita Fresh Flower') {
    return `Standing Duka Cita Fresh - ${elegantName} (${formatPriceDisplay(price)})`;
  }

  if (folder === 'Standing Flower Fresh') {
    if (fileName.toLowerCase().includes('gunting pita')) {
      return `Standing Flower Fresh Peresmian Gunting Pita (${formatPriceDisplay(price)})`;
    }
    if (fileName.toLowerCase().includes('satuan 700k')) {
      return `Standing Flower Fresh Harmony Duo - Satuan 700K / Sepasang 1.3M`;
    }
    return `Standing Flower Fresh - ${elegantName} (${formatPriceDisplay(price)})`;
  }

  if (folder === 'Standing Flower PVC Artificial') {
    if (fileName.toLowerCase().includes('hologram')) {
      return `Standing PVC Hologram - ${elegantName} (${formatPriceDisplay(price)})`;
    }
    return `Standing PVC Artificial - ${elegantName} (${formatPriceDisplay(price)})`;
  }

  return `${folder} - ${elegantName} (${formatPriceDisplay(price)})`;
}

function getSpecificationsForProduct(folder: string): string {
  if (folder === 'Bunga Papan Dukacita') {
    return `• Papan bunga duka cita ukuran standar/jumbo Bandung
• Rangkaian bunga segar di bagian atas & bawah papan
• Material styrofoam padat berlatar beludru/spon berkualitas
• Tulisan ucapan belasungkawa rapi, jelas, dan proporsional
• Penyangga bambu kokoh anti-angin untuk peletakan outdoor/indoor
• Free ongkir area Bandung & sekitarnya
• Laporan foto lokasi setelah pesanan tiba di rumah duka`;
  }
  if (folder === 'Standing Acrylik Artificial') {
    return `• Papan akrilik berkualitas tinggi (ketebalan 3 mm)
• Rangkaian bunga artificial premium bernuansa estetik & tahan lama
• Standing tripod kayu solid kokoh ukuran 150 cm finishing rapi
• Free custom lettering nama/tulisan ucapan sesuai permintaan
• Free kartu ucapan & pita eksklusif
• Cocok untuk grand opening, inaugurasi, wedding, dan peresmian`;
  }
  if (folder === 'Standing Cermin-Miror Artificial') {
    return `• Cermin lengkung (arch mirror) berkelas dengan pantulan jernih
• Rangkaian bunga artificial impor kualitas terbaik & lebat
• Penyangga easel kayu elegan dengan kestabilan tinggi
• Free custom stiker kaligrafi / lettering nama pengantin / brand toko
• Sempurna untuk welcome sign pernikahan, bridal shower, & grand opening
• Free kartu ucapan dan pengiriman aman`;
  }
  if (folder === 'Standing Dukacita Fresh Flower') {
    return `• 100% bunga segar alami pilihan (Lily putih, Mawar putih, Krisan, Aster)
• Nuansa warna putih, krem, dan hijau dedaunan anggun berkelas
• Standing besi/kayu kokoh ukuran 150 cm
• Free pita ucapan belasungkawa & selempang nama pengirim
• Pengiriman cepat same-day ke seluruh rumah duka di Bandung & Cimahi
• Free kartu ucapan eksklusif`;
  }
  if (folder === 'Standing Flower Fresh') {
    return `• 100% bunga potong segar pilihan kualitas premium
• Kombinasi mawar, gerbera, krisan, lily, dan dedaunan segar
• Standing besi/kayu kuat setinggi 150 cm dengan hiasan pita satin
• Tersedia untuk ucapan selamat, grand opening, wisuda, & anniversary
• Free kartu ucapan & print pita banner nama pengirim
• Free ongkir area Kota Bandung`;
  }
  return `• Bahan foam PVC tebal anti-air dan tahan segala cuaca
• Rangkaian bunga artificial cerah, awet, dan tidak akan layu
• Desain modern minimalis estetik kekinian
• Penyangga kayu kokoh ukuran 150 cm
• Free custom tulisan ucapan & logo perusahaan
• Free ongkir Bandung`;
}

function getDescriptionForProduct(folder: string, name: string): string {
  if (folder === 'Bunga Papan Dukacita') {
    return `${name} merupakan karangan bunga papan duka cita khidmat dan megah persembahan Aurvella Florist Bandung. Dirangkai dengan bunga segar pilihan dan tulisan ucapan belasungkawa yang anggun, memberikan penghormatan terbaik bagi almarhum/almarhumah serta ketenangan bagi keluarga yang ditinggalkan.`;
  }
  if (folder === 'Standing Acrylik Artificial') {
    return `${name} adalah standing flower akrilik mewah bernuansa modern estetik. Menggunakan papan akrilik bening/putih susu berkualitas dipadukan dengan bunga artificial premium yang tahan lama, sangat tepat untuk memeriahkan momen grand opening, peresmian bisnis, atau pernikahan sahabat Anda.`;
  }
  if (folder === 'Standing Cermin-Miror Artificial') {
    return `${name} hadir sebagai welcome board cermin berhias bunga artificial mewah. Kombinasi cermin elegan dengan rangkaian bunga estetik menjadikannya pusat perhatian dan spot foto favorit di setiap acara pernikahan, engagement, maupun butik grand opening.`;
  }
  if (folder === 'Standing Dukacita Fresh Flower') {
    return `${name} dirangkai khusus dengan aneka bunga segar alami bernuansa putih dan hijau lembut. Memberikan kesan damai, khidmat, dan penuh rasa simpati mendalam untuk pengiriman ke rumah duka atau kediaman keluarga di Bandung.`;
  }
  if (folder === 'Standing Flower Fresh') {
    return `${name} merupakan rangkaian bunga segar alami dengan kombinasi warna semarak dan aroma harum bunga asli. Pilihan sempurna untuk merayakan pembukaan usaha baru, ucapan selamat & sukses, serta hari bahagia rekan bisnis Anda di Bandung.`;
  }
  return `${name} dirancang dengan bahan PVC foam modern tahan cuaca dan bunga artificial cerah berkualitas tinggi. Awet dipajang berhari-hari untuk memeriahkan acara pesta, selebrasi peresmian cabang, maupun ucapan selamat sukses.`;
}

async function main() {
  console.log('=== MEMULAI SINKRONISASI DAFTAR PRODUK & KATEGORI ===');
  const productsDir = path.join(process.cwd(), 'public', 'products');
  const folders = fs.readdirSync(productsDir);

  // 1. Pastikan Kategori ada di Database
  const categoryIdMap: Record<string, string> = {};

  let catOrder = 1;
  for (const [folderKey, meta] of Object.entries(FOLDER_CATEGORY_MAP)) {
    const cat = await prisma.category.upsert({
      where: { slug: meta.slug },
      update: {
        name: meta.name,
        description: meta.description,
        image: meta.defaultImage,
        order: catOrder,
        isActive: true,
      },
      create: {
        name: meta.name,
        slug: meta.slug,
        description: meta.description,
        image: meta.defaultImage,
        order: catOrder,
        isActive: true,
      },
    });
    categoryIdMap[meta.slug] = cat.id;
    console.log(`✓ Kategori '${cat.name}' (${cat.slug}) siap.`);
    catOrder++;
  }

  // 2. Kumpulkan semua gambar dari masing-masing folder
  const allProductsToInsert: any[] = [];
  let globalOrder = 1;

  for (const folder of folders) {
    const meta = FOLDER_CATEGORY_MAP[folder];
    if (!meta) continue;

    const folderPath = path.join(productsDir, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const files = fs.readdirSync(folderPath).filter(f => /\.(jpe?g|png|webp)$/i.test(f));
    console.log(`Memproses folder "${folder}": ${files.length} file gambar.`);

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const { price, promoPrice, isPromo } = parsePrice(fileName);
      const name = generateCleanName(folder, fileName, i, price);
      
      const cleanSlug = `${meta.slug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`.slice(0, 75);
      const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const sku = `${meta.prefix}-20261017-${String(globalOrder).padStart(4, '0')}-${uniqueSuffix}`;
      
      const isFeatured = i < 4;
      const showOnHero = (folder === 'Standing Acrylik Artificial' || folder === 'Standing Flower Fresh' || folder === 'Standing Cermin-Miror Artificial') && i < 2;
      
      const computedPromoPrice = isPromo && promoPrice ? promoPrice : (i === 1 || i === 3 ? Math.round(price * 0.9 / 10000) * 10000 : null);
      const hasPromo = computedPromoPrice !== null && computedPromoPrice < price;

      const specifications = getSpecificationsForProduct(folder);
      const description = getDescriptionForProduct(folder, name);

      const imageUrl = `/products/${folder}/${fileName}`;

      allProductsToInsert.push({
        sku,
        name,
        slug: `${cleanSlug}-${uniqueSuffix.toLowerCase()}`,
        description,
        specifications,
        price,
        promoPrice: hasPromo ? computedPromoPrice : null,
        isPromo: hasPromo,
        promoStart: hasPromo ? new Date() : null,
        promoEnd: hasPromo ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) : null,
        isFeatured,
        showOnHero,
        isAvailable: true,
        isPublished: true,
        order: globalOrder,
        seoTitle: `${name} | Aurvella Florist Bandung`,
        seoDescription: `Beli ${name} harga mulai Rp ${price.toLocaleString('id-ID')} gratis ongkir area Bandung. Hubungi Aurvella Florist sekarang.`,
        categoryId: categoryIdMap[meta.slug],
        imageUrl,
      });

      globalOrder++;
    }
  }

  console.log(`Total produk baru: ${allProductsToInsert.length}`);

  // 3. Bersihkan produk lama di database
  console.log('Membersihkan data produk lama di database...');
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();

  // 4. Masukkan produk baru
  console.log('Menyimpan 126 produk baru ke database...');
  for (const p of allProductsToInsert) {
    await prisma.product.create({
      data: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        description: p.description,
        specifications: p.specifications,
        price: p.price,
        promoPrice: p.promoPrice,
        isPromo: p.isPromo,
        promoStart: p.promoStart,
        promoEnd: p.promoEnd,
        isFeatured: p.isFeatured,
        showOnHero: p.showOnHero,
        isAvailable: p.isAvailable,
        isPublished: p.isPublished,
        order: p.order,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        categoryId: p.categoryId,
        images: {
          create: [
            {
              url: p.imageUrl,
              alt: p.name,
              isPrimary: true,
              order: 0,
            },
          ],
        },
      },
    });
  }

  const finalCount = await prisma.product.count();
  const finalCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    select: { name: true, slug: true, _count: { select: { products: true } } }
  });

  console.log(`\n=== SUKSES! Total Produk di Database Sekarang: ${finalCount} ===`);
  console.log('Ringkasan per Kategori:');
  finalCategories.forEach(c => {
    console.log(` - ${c.name} (${c.slug}): ${c._count.products} produk`);
  });
}

main()
  .catch(e => {
    console.error('Error saat sinkronisasi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
