import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Mulai Seeding Database Aurvella Florist ---');

  // 1. User Admin default
  const adminPassword = await bcrypt.hash('admin123', 10);
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: adminPassword,
      name: 'Administrator Aurvella',
      email: 'admin@aurvellaflorist.com',
      role: 'ADMIN',
    },
    create: {
      username: 'admin',
      email: 'admin@aurvellaflorist.com',
      password: adminPassword,
      name: 'Administrator Aurvella',
      role: 'ADMIN',
    },
  });
  console.log('✓ User admin siap:', user.username);

  // 2. Kategori Wajib
  const categoriesData = [
    {
      name: 'Standing Acrylic',
      slug: 'standing-acrylic',
      description: 'Rangkaian bunga standing papan akrilik mewah bernuansa soft pink & gold',
      image: '/images/categories/standing-acrylic.png',
      order: 1,
    },
    {
      name: 'Standing Cermin',
      slug: 'standing-cermin',
      description: 'Standing mirror florist elegan untuk momen pernikahan, engagement, dan grand opening',
      image: '/images/categories/standing-cermin.png',
      order: 2,
    },
    {
      name: 'Standing PVC',
      slug: 'standing-pvc',
      description: 'Papan bunga standing foam PVC modern bernuansa premium untuk ucapan selamat & sukses',
      image: '/images/categories/standing-pvc.png',
      order: 3,
    },
    {
      name: 'Standing Fresh',
      slug: 'standing-fresh',
      description: 'Rangkaian bunga segar alami pilihan dengan keharuman bunga asli dan tampilan megah',
      image: '/images/categories/standing-fresh.png',
      order: 4,
    },
    {
      name: 'Standing Duka Cita',
      slug: 'standing-duka-cita',
      description: 'Standing flower belasungkawa anggun bernuansa putih dan krem untuk penghormatan terbaik',
      image: '/images/categories/standing-duka-cita.png',
      order: 5,
    },
  ];

  const categoriesMap: Record<string, string> = {};

  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        order: cat.order,
        isActive: true,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        order: cat.order,
        isActive: true,
      },
    });
    categoriesMap[cat.slug] = createdCat.id;
  }
  console.log('✓ 5 Kategori wajib siap.');

  // 3. Produk Awal
  const defaultAcrylicSpec = `• Papan akrilik berkualitas tinggi
• Ketebalan papan akrilik 3 mm
• Bentuk papan persegi dengan ukuran 70 × 120 cm
• Warna papan akrilik putih susu elegan
• Menggunakan bunga fresh dan artificial premium
• Standing kayu ukuran 150 cm dengan finishing putih bersih
• Free kartu ucapan & pita eksklusif`;

  const productsData = [
    {
      sku: 'ACR-20261011-A8K2',
      name: 'Standing Acrylic Blooming Pastel',
      slug: 'standing-acrylic-blooming-pastel',
      categorySlug: 'standing-acrylic',
      price: 950000,
      promoPrice: 850000,
      isPromo: true,
      isFeatured: true,
      description:
        'Standing flower akrilik mewah berukuran 70x120 cm dengan bunga mawar pastel, hydrangea, lisianthus, dan aksen daun emas. Sangat cocok untuk grand opening toko dan acara inaugurasi berkelas.',
      specifications: defaultAcrylicSpec,
      imageUrl: '/images/categories/standing-acrylic.png',
    },
    {
      sku: 'ACR-20261011-A9L3',
      name: 'Standing Acrylic Royal Golden Touch',
      slug: 'standing-acrylic-royal-golden-touch',
      categorySlug: 'standing-acrylic',
      price: 1100000,
      promoPrice: null,
      isPromo: false,
      isFeatured: true,
      description:
        'Kombinasi akrilik bening tebal 3mm dengan sentuhan kaligrafi emas dan rangkaian bunga segar nuansa peach, cream, dan baby pink.',
      specifications: defaultAcrylicSpec,
      imageUrl: '/images/categories/standing-acrylic.png',
    },
    {
      sku: 'CRM-20261011-B7M4',
      name: 'Standing Cermin Luxury Arch',
      slug: 'standing-cermin-luxury-arch',
      categorySlug: 'standing-cermin',
      price: 1650000,
      promoPrice: 1450000,
      isPromo: true,
      isFeatured: true,
      description:
        'Standing flower cermin lengkung bingkai emas dengan rimbunan mawar pink, baby breath, dan ornamen mewah. Pilihan utama untuk wedding welcome sign dan engagement.',
      specifications: `• Standing cermin lengkung full body 160 cm
• Bingkai ornamen ukir emas mewah
• Custom tulisan calligraphy cermin
• Rangkaian bunga segar cascading keliling
• Free sewa standing & delivery Bandung`,
      imageUrl: '/images/categories/standing-cermin.png',
    },
    {
      sku: 'PVC-20261011-C9P5',
      name: 'Standing PVC Grand Opening Blush',
      slug: 'standing-pvc-grand-opening-blush',
      categorySlug: 'standing-pvc',
      price: 750000,
      promoPrice: 650000,
      isPromo: true,
      isFeatured: true,
      description:
        'Papan standing modern bahan foam PVC berkualitas anti air dengan printing HD nuansa blush watercolor dan bunga segar di atas dan bawah papan.',
      specifications: `• Papan Foam PVC tebal presisi 80 x 120 cm
• Stand kayu kokoh warna hitam/putih 150 cm
• Bunga segar mawar, gerbera, dan aster
• Desain custom sesuai logo dan nama pengirim`,
      imageUrl: '/images/categories/standing-pvc.png',
    },
    {
      sku: 'FRE-20261011-D3R8',
      name: 'Standing Fresh Cascading Hydrangea',
      slug: 'standing-fresh-cascading-hydrangea',
      categorySlug: 'standing-fresh',
      price: 1250000,
      promoPrice: null,
      isPromo: false,
      isFeatured: true,
      description:
        'Rangkaian standing flower 100% bunga segar asli pilihan dengan hydrangea biru pastel, mawar ecuador, lili wangi, dan cascading baby breath.',
      specifications: `• Bunga segar premium 100% (Hydrangea, Lily, Rose)
• Menggunakan oasis basah tahan hingga 3-4 hari
• Stand tripod besi/kayu estetik 160 cm
• Custom papan ucapan akrilik mini`,
      imageUrl: '/images/categories/standing-fresh.png',
    },
    {
      sku: 'DUK-20261011-E5T6',
      name: 'Standing Duka Cita Serene White Lily',
      slug: 'standing-duka-cita-serene-white-lily',
      categorySlug: 'standing-duka-cita',
      price: 850000,
      promoPrice: 750000,
      isPromo: true,
      isFeatured: true,
      description:
        'Standing flower ungkapan duka cita khidmat dan penuh rasa hormat, didominasi bunga lili putih mekar, mawar putih, krisan, dan daun eucalyptus perak.',
      specifications: `• Papan akrilik / foam putih bersih 70 x 100 cm
• Bunga lili putih mekar & mawar putih segar
• Stand kayu kokoh warna natural/putih
• Format ucapan belasungkawa rapi & sopan`,
      imageUrl: '/images/categories/standing-duka-cita.png',
    },
  ];

  for (const p of productsData) {
    const categoryId = categoriesMap[p.categorySlug];
    if (!categoryId) continue;

    const product = await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        name: p.name,
        slug: p.slug,
        categoryId: categoryId,
        price: p.price,
        promoPrice: p.promoPrice,
        isPromo: p.isPromo,
        isFeatured: p.isFeatured,
        description: p.description,
        specifications: p.specifications,
        isPublished: true,
        isAvailable: true,
      },
      create: {
        sku: p.sku,
        name: p.name,
        slug: p.slug,
        categoryId: categoryId,
        price: p.price,
        promoPrice: p.promoPrice,
        isPromo: p.isPromo,
        isFeatured: p.isFeatured,
        description: p.description,
        specifications: p.specifications,
        isPublished: true,
        isAvailable: true,
      },
    });

    // Buat image jika belum ada
    const existingImg = await prisma.productImage.findFirst({
      where: { productId: product.id },
    });
    if (!existingImg) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: p.imageUrl,
          alt: p.name,
          isPrimary: true,
          order: 0,
        },
      });
    }
  }
  console.log('✓ 6 Produk unggulan berhasil diseed.');

  // 4. Testimoni
  const testimonials = [
    {
      customerName: 'Ibu Sarah Wiratama',
      content:
        'Standing flower akriliknya luar biasa cantik dan elegan! Bunga sangat segar dan pengiriman tepat waktu ke venue di Bandung. Tamu-tamu banyak yang memuji.',
      rating: 5,
      isApproved: true,
    },
    {
      customerName: 'Bpk. Hendra Gunawan',
      content:
        'Pesan untuk grand opening kantor rekan bisnis. Hasilnya mewah sekali dengan aksen gold dan akrilik tebal. Pelayanan admin WhatsApp sangat responsif!',
      rating: 5,
      isApproved: true,
    },
    {
      customerName: 'Jessica & Kevin',
      content:
        'Standing cermin untuk resepsi wedding kami sangat memukau, jadi spot foto terfavorit para tamu. Hasilnya persis sesuai request bahkan lebih cantik aslinya.',
      rating: 5,
      isApproved: true,
    },
    {
      customerName: 'dr. Anita Rahmawati',
      content:
        'Rangkaian bunganya harum dan fresh banget. Free ongkir ke area Bandung Kota beneran aman sampai tujuan tanpa layu sama sekali. Recommended florist!',
      rating: 5,
      isApproved: true,
    },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { customerName: t.customerName },
    });
    if (!existing) {
      await prisma.testimonial.create({ data: t });
    }
  }
  console.log('✓ Testimoni siap.');

  // 5. Site Settings
  const settings = [
    { key: 'business_name', value: 'Aurvella Florist' },
    { key: 'tagline', value: 'Spesialist Standing Flower BANDUNG - Fresh & Artificial | Free Ongkir' },
    { key: 'whatsapp_number', value: '085770187018' },
    { key: 'whatsapp_international', value: '6285770187018' },
    { key: 'address', value: 'Jl. Jamrud No.16, Cisaranten Kulon, Kec. Arcamanik, Kota Bandung, Jawa Barat 40293' },
    { key: 'maps_embed_url', value: 'https://maps.google.com/maps?q=Jl.+Jamrud+No.16,+Cisaranten+Kulon,+Kec.+Arcamanik,+Kota+Bandung,+Jawa+Barat+40293&t=&z=15&ie=UTF8&iwloc=&output=embed' },
    { key: 'maps_direction_url', value: 'https://maps.google.com/?q=Jl.+Jamrud+No.16,+Cisaranten+Kulon,+Kec.+Arcamanik,+Kota+Bandung,+Jawa+Barat+40293' },
    { key: 'free_ongkir_info', value: 'Free Ongkir Area Kota Bandung & Sekitarnya (S&K Berlaku)' },
    { key: 'sameday_info', value: 'Same Day Delivery: Pesan sebelum jam 14:00 WIB untuk pengiriman hari ini' },
    { key: 'service_hours', value: 'Layanan WhatsApp 24/7 (Pengiriman 08:00 - 20:00 WIB)' },
    { key: 'instagram_url', value: 'https://instagram.com/aurvellaflorist' },
    { key: 'shopee_url', value: 'https://shopee.co.id/aurvellaflorist' },
    { key: 'tiktok_url', value: 'https://tiktok.com/@aurvellaflorist' },
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }
  console.log('✓ Pengaturan website siap.');

  // 6. Social Links (Link Tree)
  const links = [
    {
      title: 'WhatsApp Fast Response (Order & Konsultasi)',
      url: 'https://wa.me/6285770187018?text=Halo%20Aurvella%20Florist,%20saya%20ingin%20tanya%20standing%20flower',
      type: 'WHATSAPP',
      description: 'Layanan 24/7 fast respond via WhatsApp resmi',
      order: 1,
    },
    {
      title: 'Katalog Lengkap & Pricelist Standing Flower',
      url: 'https://drive.google.com',
      type: 'GOOGLE_DRIVE',
      description: 'Unduh file PDF pricelist dan spesifikasi standing flower',
      order: 2,
    },
    {
      title: 'Pricelist Standing Acrylic Premium',
      url: 'https://drive.google.com',
      type: 'GOOGLE_DRIVE',
      description: 'Koleksi papan akrilik 3mm dengan fresh & artificial flower',
      order: 3,
    },
    {
      title: 'Katalog Standing Fresh & Cermin Wedding',
      url: 'https://drive.google.com',
      type: 'GOOGLE_DRIVE',
      description: 'Pilihan standing cermin & bunga segar untuk resepsi & pembukaan usaha',
      order: 4,
    },
    {
      title: 'Instagram @aurvellaflorist',
      url: 'https://instagram.com/aurvellaflorist',
      type: 'INSTAGRAM',
      description: 'Lihat dokumentasi pengiriman dan portofolio harian kami',
      order: 5,
    },
    {
      title: 'Toko Resmi Shopee',
      url: 'https://shopee.co.id/aurvellaflorist',
      type: 'SHOPEE',
      description: 'Pemesanan aman melalui Shopee dengan voucher garansi',
      order: 6,
    },
    {
      title: 'TikTok Official',
      url: 'https://tiktok.com/@aurvellaflorist',
      type: 'TIKTOK',
      description: 'Video behind-the-scene perangkaian standing flower',
      order: 7,
    },
    {
      title: 'Lokasi Workshop (Google Maps)',
      url: 'https://maps.google.com/?q=Jl.+Jamrud+No.16,+Cisaranten+Kulon,+Kec.+Arcamanik,+Kota+Bandung,+Jawa+Barat+40293',
      type: 'MAPS',
      description: 'Kunjungi workshop kami di Jl. Jamrud Arcamanik Bandung',
      order: 8,
    },
  ];

  for (const l of links) {
    const existing = await prisma.socialLink.findFirst({
      where: { title: l.title },
    });
    if (!existing) {
      await prisma.socialLink.create({ data: l });
    }
  }
  console.log('✓ Tautan Link Tree siap.');

  console.log('--- SEEDING SELESAI DENGAN SUKSES ---');
}

main()
  .catch((e) => {
    console.error('Error saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
