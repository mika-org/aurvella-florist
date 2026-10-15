import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ProductDef {
  folder: string;
  filename: string;
  categorySlug: string;
  skuPrefix: string;
  name: string;
  slug: string;
  price: number;
  promoPrice?: number;
  isPromo?: boolean;
  isFeatured?: boolean;
  hasExactPriceInImage: boolean;
  description: string;
  specifications: string;
}

const productsToSeed: ProductDef[] = [
  // --- ACRYLICS (15 products) ---
  {
    folder: 'acrylics',
    filename: '770584632_17891757261606034_9140803580430233114_n.jpg',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Mosa Coffee House',
    slug: 'standing-akrilik-mosa-coffee-house',
    price: 700000,
    isFeatured: true,
    hasExactPriceInImage: true,
    description: 'Standing flower akrilik transparan elegan untuk ucapan grand opening, wedding, dan perayaan istimewa dengan rangkaian bunga biru pastel dan hiasan kupu-kupu emas.',
    specifications: '• Papan Akrilik Bening Tebal 3mm (Ukuran 60 x 90 cm)\n• Rangkaian Bunga Segar & Artificial Grade A Nuansa Biru Pastel\n• Standing Kayu Natural Kokoh 150 cm\n• Bebas Custom Tulisan & Logo\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '770728502_17891757270606034_1217343219873377858_n.jpg',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Excelso Boho Leaf',
    slug: 'standing-akrilik-excelso-boho-leaf',
    price: 750000,
    isFeatured: true,
    hasExactPriceInImage: true,
    description: 'Standing akrilik berkonsep boho chic dengan daun palem kering estetik dan bunga premium kombinasi biru tosca dan putih bersih.',
    specifications: '• Papan Akrilik Premium Daun Palem Bohemian\n• Bunga Segar & Silk Flower Grade Premium\n• Easel Kayu Solid 150 cm Finishing Halus\n• Cetak Tulisan Resolusi Tinggi & Logo Resmi\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '770802525_17891757297606034_2672712858932976584_n.jpg',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Niku San Half Wreath',
    slug: 'standing-akrilik-niku-san-half-wreath',
    price: 850000,
    isFeatured: true,
    hasExactPriceInImage: true,
    description: 'Standing flower akrilik bulat diameter besar dengan karangan bunga bulan sabit (half wreath) mawar merah marun, baby pink, dan kain tile mewah.',
    specifications: '• Papan Akrilik Bulat Presisi Diameter 70 cm\n• Karangan Rimbun Bunga Segar Mawar Merah & Pink Pastel\n• Selendang Tile Merah Marun Elegan\n• Stand Kayu Tripod Kokoh\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '770955633_17891757285606034_799359806348185378_n.jpg',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Mosa Double Blooms',
    slug: 'standing-akrilik-mosa-double-blooms',
    price: 750000,
    isFeatured: true,
    hasExactPriceInImage: true,
    description: 'Standing akrilik transparan modern dengan dua rangkaian bunga rimbun di bagian atas dan bawah papan, dihiasi kupu-kupu emas timbul 3D.',
    specifications: '• Papan Akrilik Transparan Tebal 3mm (60 x 90 cm)\n• 2 Titik Rangkaian Bunga (Atas & Bawah)\n• Aksen Kupu-Kupu Emas 3D\n• Standing Tripod Kayu Natural 150 cm\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '770976224_17891757252606034_5036950465323693012_n.jpg',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Danau Singkarak Blue Gold',
    slug: 'standing-akrilik-danau-singkarak-blue-gold',
    price: 700000,
    isFeatured: true,
    hasExactPriceInImage: true,
    description: 'Papan standing akrilik putih susu dengan bunga hydrangea biru muda, daun emas, dan ranting sakura putih yang anggun.',
    specifications: '• Papan Akrilik Putih Susu Berkualitas Tinggi (60 x 90 cm)\n• Rangkaian Bunga Hydrangea Biru & Daun Gold\n• Stand Kayu Finishing Putih/Natural\n• Custom Nama Pengirim & Logo Bebas Revisi\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '771031059_17891757288606034_1970645006509815254_n.jpg',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Diskusick Red White',
    slug: 'standing-akrilik-diskusick-red-white',
    price: 800000,
    isFeatured: true,
    hasExactPriceInImage: true,
    description: 'Standing akrilik bulat dengan tema kontras merah putih berkarakter tegas, cocok untuk konser musik, talkshow, inaugurasi, maupun grand opening.',
    specifications: '• Papan Akrilik Bulat Diameter 70 cm\n• Rangkaian Mawar Merah Segar, Aster Putih, & Bunga Sedap Malam\n• Stand Tripod Hitam Modern Dapat Diatur Tingginya\n• Selendang Pita Satin & Kain Tile Merah\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '753204636_17887999746606034_7310489729185282959_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Hologram Congratulations Nabilamrt',
    slug: 'standing-akrilik-hologram-congratulations-nabilamrt',
    price: 750000,
    promoPrice: 700000,
    isPromo: true,
    hasExactPriceInImage: false,
    description: 'Standing flower akrilik efek hologram pelangi lembut dengan lili putih mekar dan mawar biru pastel.',
    specifications: '• Akrilik Bulat Holographic Shimmer Diameter 65 cm\n• Bunga Lili Putih Mekar & Rose Ice Blue\n• Tripod Hitam Minimalis\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '763761721_17890566438606034_4764568227811839443_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Royal Grand Opening',
    slug: 'standing-akrilik-royal-grand-opening',
    price: 750000,
    hasExactPriceInImage: false,
    description: 'Desain standing flower akrilik mewah dengan kombinasi warna emas dan bunga mawar premium.',
    specifications: '• Akrilik Persegi Panjang 60 x 90 cm\n• Bunga Segar & Artificial Kombinasi Mawar & Krisan\n• Stand Kayu 150 cm Kokoh\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '763847994_17890566465606034_5292950817395677705_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Soft Pink Celebration',
    slug: 'standing-akrilik-soft-pink-celebration',
    price: 700000,
    hasExactPriceInImage: false,
    description: 'Nuansa manis penuh kehangatan dengan bunga mawar baby pink dan sentuhan ornamen modern.',
    specifications: '• Papan Akrilik Bening 60 x 90 cm Tebal 3mm\n• Bunga Mawar Pink & Carnation Segar\n• Free Custom Lettering Tulisan Bebas\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '767585866_17891205126606034_7712810402875789963_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Pastel Arch Deluxe',
    slug: 'standing-akrilik-pastel-arch-deluxe',
    price: 800000,
    hasExactPriceInImage: false,
    description: 'Bentuk lengkung estetik khas tren dekorasi modern masa kini dengan rangkaian bunga pastel mewah.',
    specifications: '• Bentuk Akrilik Lengkung Arch 70 x 100 cm\n• Rangkaian Bunga Peony & Hydrangea Pastel\n• Stand Kayu Finishing Halus\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '770584633_17891205159606034_88310875124857401_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Sapphire Bloom Harmony',
    slug: 'standing-akrilik-sapphire-bloom-harmony',
    price: 750000,
    hasExactPriceInImage: false,
    description: 'Kombinasi warna biru safir dan dedaunan eucalyptus menghasilkan tampilan visual yang menenangkan dan berkelas.',
    specifications: '• Papan Akrilik Berkualitas 60 x 90 cm\n• Bunga Mawar Biru & Eucalyptus Perak\n• Standing Tripod Minimalis\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '770678172_17891205720606034_8582346731449856085_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Emerald Aura White',
    slug: 'standing-akrilik-emerald-aura-white',
    price: 700000,
    hasExactPriceInImage: false,
    description: 'Standing flower akrilik berlatar putih bersih dengan paduan dedaunan hijau zamrud dan bunga putih harum.',
    specifications: '• Akrilik Putih Bersih 60 x 90 cm\n• Rangkaian Mawar Putih & Bunga Ruscus Segar\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '776224132_17892754707606034_47608191564421464_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Velvet Rose Garden',
    slug: 'standing-akrilik-velvet-rose-garden',
    price: 750000,
    hasExactPriceInImage: false,
    description: 'Pilihan favorit untuk ucapan selamat pernikahan dan peresmian kantor baru dengan bunga mawar beludru rimbun.',
    specifications: '• Akrilik Bening 60 x 90 cm\n• Mawar Beludru Premium & Baby Breath Putih\n• Stand Kayu Solid 150 cm\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '834222404_17901550782606034_2240688730616210595_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Modern Arch Minimalist',
    slug: 'standing-akrilik-modern-arch-minimalist',
    price: 850000,
    promoPrice: 799000,
    isPromo: true,
    hasExactPriceInImage: false,
    description: 'Desain kurva lengkung modern bertingkat dengan aksen kaligrafi elegan dan bunga cascade ke bawah.',
    specifications: '• Papan Akrilik Arch Custom 70 x 110 cm\n• Bunga Rangkaian Cascading Jatuh Estetik\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'acrylics',
    filename: '836319914_17901551022606034_1227436268959943886_n.webp',
    categorySlug: 'standing-acrylic',
    skuPrefix: 'ACR',
    name: 'Standing Akrilik Luxury Golden Crest',
    slug: 'standing-akrilik-luxury-golden-crest',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Kemewahan paripurna dengan ornamen daun emas murni, akrilik bening kristal, dan mawar gradasi eksklusif.',
    specifications: '• Akrilik Kristal Bening Tebal 3mm\n• Daun Emas Dekoratif & Mawar Segar Pilihan\n• Free Ongkir Area Kota Bandung',
  },

  // --- DUKA CITA (10 products) ---
  {
    folder: 'duka_cita',
    filename: '815138317_17899016673606034_7482983438027216366_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita 2-Tier Grand Honor',
    slug: 'standing-duka-cita-2-tier-grand-honor',
    price: 950000,
    promoPrice: 899000,
    isPromo: true,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Standing flower duka cita megah 2 tingkat (susun dua) bunga segar asli rimbun dengan lili casablanca mekar, mawar merah putih, dan pita belasungkawa resmi.',
    specifications: '• Standing Besi 2 Tingkat Rimbun Tinggi 175 cm\n• 100% Bunga Segar Asli (Lili Casablanca, Mawar, Aster, Krisan)\n• Selempang Tulisan Pita Rapi & Elegan\n• Kartu Ucapan Belasungkawa Khusus\n• Garansi Tiba Segar & Free Ongkir Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '816030619_17899191180606034_8510782432264832067_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita White Lily Serenity',
    slug: 'standing-duka-cita-white-lily-serenity',
    price: 750000,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Rangkaian standing flower belasungkawa bertema putih bersih, melambangkan ketenangan jiwa dan penghormatan terakhir yang mendalam.',
    specifications: '• Bunga Segar Pilihan Lili Putih, Mawar Putih, & Krisan\n• Standing Besi Kokoh Warna Hitam 150 cm\n• Selempang Pita Satin Nama Pengirim\n• Free Ongkir Seluruh Kota Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '816309895_17899523985606034_990832799452621030_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita Eternal Peace White',
    slug: 'standing-duka-cita-eternal-peace-white',
    price: 800000,
    hasExactPriceInImage: false,
    description: 'Ungkapan duka cita tulus dengan perpaduan bunga lili mekar harum dan krisan kuning putih yang tersusun rapi dan simetris.',
    specifications: '• Rangkaian Bunga Segar Bulat Kubah Penuh\n• Daun Pakis & Palm Asri\n• Papan Ucapan Formal Berkualitas\n• Free Ongkir Kota Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '821404964_17899341999606034_9101430518124743424_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita Pure White Grace',
    slug: 'standing-duka-cita-pure-white-grace',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Karangan bunga duka cita bernuansa putih suci dengan bunga lili wangi dan mawar putih premium yang tahan segar berhari-hari.',
    specifications: '• Bunga Segar Berkualitas Grade A Menggunakan Oasis Basah\n• Stand Besi Tripod Stabil\n• Free Ongkir Area Kota Bandung & Cimahi',
  },
  {
    folder: 'duka_cita',
    filename: '825323859_17899864254606034_982825347165596206_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita Solemn Remembrance',
    slug: 'standing-duka-cita-solemn-remembrance',
    price: 750000,
    hasExactPriceInImage: false,
    description: 'Rangkaian bunga duka cita dengan proporsi seimbang, cocok untuk pengiriman ke rumah duka, kediaman pribadi, maupun persemayaman.',
    specifications: '• Bunga Mawar Putih, Aster Putih, & Sedap Malam\n• Standing Tripod Besi Elegan\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '834317528_17901714822606034_8539570791488210564_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita Sacred Tribute Round',
    slug: 'standing-duka-cita-sacred-tribute-round',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Karangan bunga duka cita berbentuk lingkaran suci penuh makna keabadian, dirangkai padat oleh florist berpengalaman.',
    specifications: '• Karangan Bunga Melingkar Penuh Simbol Keabadian\n• Bunga Segar Pilihan Lili & Mawar Putih\n• Stand Besi Kokoh & Aman Selama Acara\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '837303049_17901870135606034_7068508223014169032_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita Heavenly Comfort Arch',
    slug: 'standing-duka-cita-heavenly-comfort-arch',
    price: 800000,
    hasExactPriceInImage: false,
    description: 'Desain standing belasungkawa modern bernuansa lembut memberikan rasa nyaman dan penghiburan bagi keluarga yang berduka.',
    specifications: '• Bunga Segar Hydrangea Putih, Lili, & Mawar\n• Standing Tripod Minimalis\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '842574608_17902686135606034_7455010663171260465_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita White Rose Elegance',
    slug: 'standing-duka-cita-white-rose-elegance',
    price: 700000,
    hasExactPriceInImage: false,
    description: 'Rangkaian bunga duka cita mawar putih simpel dan elegan, proses perangkaian kilat siap kirim dalam 2-3 jam (Same Day Delivery).',
    specifications: '• Bunga Mawar Putih Segar Grade A\n• Standing Kayu/Besi Ringan & Kokoh\n• Layanan Cepat Same Day Delivery Bandung\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '844230820_17902880943606034_4829657583504450316_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita Golden Memories',
    slug: 'standing-duka-cita-golden-memories',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Kombinasi warna kuning hangat dan putih khidmat untuk mengenang jasa dan kenangan indah mendiang.',
    specifications: '• Bunga Lili Kuning, Krisan Kuning Emas, & Mawar Putih\n• Stand Besi Berkualitas Tinggi 160 cm\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'duka_cita',
    filename: '845746835_17902880916606034_6798267984771426173_n.webp',
    categorySlug: 'standing-duka-cita',
    skuPrefix: 'DUK',
    name: 'Standing Duka Cita Deluxe Sympathy Cross',
    slug: 'standing-duka-cita-deluxe-sympathy-cross',
    price: 900000,
    hasExactPriceInImage: false,
    description: 'Standing flower penghormatan duka cita mewah dengan selempang ucapan belasungkawa berlapis kain satin.',
    specifications: '• Bunga Segar Rimbun 100% Import & Lokal Terbaik\n• Standing Besi Khusus Rumah Duka\n• Garansi Foto Lokasi Setelah Terpasang\n• Free Ongkir Area Kota Bandung',
  },

  // --- FRESH FLOWER (3 products) ---
  {
    folder: 'fresh',
    filename: '825324104_17899864287606034_4343312750447264481_n.webp',
    categorySlug: 'standing-fresh',
    skuPrefix: 'FRE',
    name: 'Standing Fresh Hydrangea & Mawar Pastel',
    slug: 'standing-fresh-hydrangea-mawar-pastel',
    price: 850000,
    promoPrice: 799000,
    isPromo: true,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Standing flower 100% bunga segar pilihan dengan perpaduan bunga hydrangea biru lembut, mawar pastel, dan dedaunan segar harum alami.',
    specifications: '• Bunga Segar Asli (Hydrangea, Mawar Ecuador, Lili, Baby Breath)\n• Menggunakan Spons Basah Oasis Tahan 3-4 Hari\n• Standing Tripod Besi/Kayu 160 cm\n• Bebas Custom Kartu Ucapan Papan\n• Free Ongkir Seluruh Bandung',
  },
  {
    folder: 'fresh',
    filename: '831254191_17900575092606034_5231892137792214412_n.webp',
    categorySlug: 'standing-fresh',
    skuPrefix: 'FRE',
    name: 'Standing Fresh Cascading Royal Lily',
    slug: 'standing-fresh-cascading-royal-lily',
    price: 950000,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Rangkaian bunga segar berkonsep cascading air terjun mewah dengan bunga lili mekar harum dan mawar merah merekah.',
    specifications: '• Lili Wangi Mekar Sempurna & Mawar Merah Segar\n• Rangkaian Melimpah Desain Cascading Mewah\n• Tripod Kayu Solid 160 cm\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'fresh',
    filename: '835356238_17901444462606034_5021584388368526085_n.webp',
    categorySlug: 'standing-fresh',
    skuPrefix: 'FRE',
    name: 'Standing Fresh Vibrant Celebration Rose',
    slug: 'standing-fresh-vibrant-celebration-rose',
    price: 800000,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Bunga standing segar penuh warna ceria nan semarak untuk ucapan selamat sukses, grand opening toko, dan peresmian kantor.',
    specifications: '• Mawar Segar Multi-Warna (Merah, Peach, Kuning, Pink)\n• Stand Tripod Kokoh & Rapi\n• Free Ongkir Area Kota Bandung',
  },

  // --- MIRROR / CERMIN (11 products) ---
  {
    folder: 'mirror',
    filename: '825323912_17899864167606034_7793544683238572367_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Holographic Round Laneo',
    slug: 'standing-cermin-holographic-round-laneo',
    price: 850000,
    promoPrice: 800000,
    isPromo: true,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Standing flower cermin bulat berefek kilau hologram pelangi futuristik dengan tulisan kaligrafi estetik dan bunga mawar biru sapphire.',
    specifications: '• Cermin Bulat Holographic Shimmer Diameter 65 cm\n• Kaligrafi Custom Bebas Huruf & Logo Brand\n• Rangkaian Bunga Segar & Silk Flower Biru Langit\n• Easel Kayu Solid 150 cm Finishing Bersih\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '825324022_17899864230606034_3299217714921076680_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Arch Luxury Wedding',
    slug: 'standing-cermin-arch-luxury-wedding',
    price: 900000,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Standing cermin lengkung arch mewah untuk wedding welcome sign, resepsi pernikahan, dan acara pertunangan dengan rimbunan mawar pastel.',
    specifications: '• Cermin Asli Model Arch Lengkung Elegan\n• Bunga Mawar Pastel & Baby Breath Mengelilingi Bingkai\n• Kaligrafi Tulisan Nama Pengantin Emas/Putih\n• Stand Kayu Kokoh Estetik\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '825324603_17900574600606034_2296727702961822837_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Grand Welcome Mirror',
    slug: 'standing-cermin-grand-welcome-mirror',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Welcome mirror standing flower premium untuk menyambut tamu VIP di ballroom hotel, restoran, maupun gala dinner resmi.',
    specifications: '• Papan Cermin Bening Asli Reflektif Tinggi\n• Karangan Bunga Mewah Mengelilingi Sudut Cermin\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '830486661_17900575041606034_21242046573410061_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Modern Gold Arch',
    slug: 'standing-cermin-modern-gold-arch',
    price: 900000,
    hasExactPriceInImage: false,
    description: 'Bingkai cermin arch dengan sentuhan aksen emas dan rangkaian bunga mawar peach berkelas tinggi.',
    specifications: '• Cermin Arch Berbingkai Emas Mewah\n• Bunga Segar Mawar Peach, Lisianthus, & Daun Gold\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '831424019_17901550815606034_2658476434989685850_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Full Body Welcome Sign',
    slug: 'standing-cermin-full-body-welcome-sign',
    price: 950000,
    hasExactPriceInImage: false,
    description: 'Standing cermin ukuran besar full standing memberikan visual megah dan menjadi spot foto favorit para tamu undangan.',
    specifications: '• Cermin Ukuran Besar 150 cm x 50 cm\n• Hiasan Bunga Cascading Panjang Menjuntai Indah\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '833083324_17901550725606034_3778168909560105410_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Oval Soft Pink Peony',
    slug: 'standing-cermin-oval-soft-pink-peony',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Cermin oval lembut feminin berhias bunga peony merah muda dan kain tile menjuntai romantis.',
    specifications: '• Cermin Oval Refleksi Sempurna\n• Bunga Peony & Mawar Pink Romantis\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '833763775_17901444402606034_5667245895778514396_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Elegant Engagement Sign',
    slug: 'standing-cermin-elegant-engagement-sign',
    price: 800000,
    hasExactPriceInImage: false,
    description: 'Pilihan terfavorit untuk acara lamaran / engagement modern di kafe dan venue outdoor Bandung.',
    specifications: '• Cermin Persegi Ramping dengan Rangkaian Bunga Pastel\n• Stand Kayu Ringan Mudah Dipindahkan\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '839441144_17902081704606034_6723073946096905657_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin White Floral Arch',
    slug: 'standing-cermin-white-floral-arch',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Kombinasi cermin kristal dan karangan bunga putih bersih abadi untuk perayaan suci penuh berkah.',
    specifications: '• Cermin Lengkung Arch Kaca Bening Tebal\n• Bunga Putih Mawar & Lili Wangi\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '840333079_17902433463606034_3099882612695322811_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Lou Shao Kao Royal Gold',
    slug: 'standing-cermin-lou-shao-kao-royal-gold',
    price: 900000,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Standing flower cermin berhiaskan kipas emas daun palem, mawar merah merekah, dan selendang tile merah anggun untuk pembukaan usaha kuliner.',
    specifications: '• Cermin Bening Transparan Tebal dengan Daun Palem Emas 3D\n• Bunga Mawar Merah Marun & Putih Salju\n• Stand Kayu Solid 150 cm Kokoh\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '842678551_17902589622606034_2004838733975821121_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Romance Blossom',
    slug: 'standing-cermin-romance-blossom',
    price: 850000,
    hasExactPriceInImage: false,
    description: 'Cermin ucapan selamat bertabur bunga rimbun beraroma segar untuk pesta ulang tahun dan hari jadi.',
    specifications: '• Cermin Reflektif Premium Tahan Gores\n• Bunga Mawar Romantis & Carnation\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'mirror',
    filename: '844044494_17902081617606034_5345486956412855027_n.webp',
    categorySlug: 'standing-cermin',
    skuPrefix: 'CRM',
    name: 'Standing Cermin Crystal Arch Grandeur',
    slug: 'standing-cermin-crystal-arch-grandeur',
    price: 950000,
    hasExactPriceInImage: false,
    description: 'Standing cermin arch kristal berukuran megah dengan sentuhan bunga cascaded keliling.',
    specifications: '• Cermin Arch Kristal Full Size 160 cm\n• Rangkaian Bunga Melimpah Keliling\n• Free Ongkir Area Kota Bandung',
  },

  // --- PVC (12 products) ---
  {
    folder: 'pvc',
    filename: '825323880_17900574807606034_4229647301355186480_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Arch Letkol Asep Grand Opening',
    slug: 'standing-pvc-arch-letkol-asep-grand-opening',
    price: 650000,
    promoPrice: 600000,
    isPromo: true,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Papan bunga standing foam PVC anti-air berbentuk kubah arch modern dengan dua titik bunga segar merah menyala, kuning cerah, dan selendang putih anggun.',
    specifications: '• Papan Foam PVC Tebal Presisi 80 x 120 cm (Tahan Air & Cuaca)\n• Cetak Huruf HD Anti Luntur\n• Rangkaian Bunga Segar Merah Kuning di Atas & Bawah\n• Stand Kayu Solid Kokoh 150 cm\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '825324134_17899864203606034_1887052040853536454_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Modern Watercolor Blush',
    slug: 'standing-pvc-modern-watercolor-blush',
    price: 700000,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Papan standing modern bahan foam PVC dengan printing background watercolor blush lembut dan bunga segar pilihan.',
    specifications: '• Papan PVC Premium Finishing Doff Lembut\n• Bunga Segar Mawar Pink & Aster\n• Free Custom Logo Perusahaan\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '825324250_17899864308606034_4136783670308239860_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Elegant Arch Congratulations',
    slug: 'standing-pvc-elegant-arch-congratulations',
    price: 650000,
    hasExactPriceInImage: false,
    description: 'Desain kubah arch minimalis warna putih bersih dengan bunga mawar segar untuk ucapan selamat dan sukses.',
    specifications: '• Papan Foam PVC Model Kubah 75 x 115 cm\n• Bunga Segar Merah & Putih\n• Stand Tripod Kokoh\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '825324807_17900574558606034_1097549666500938702_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Pastel Harmony Board',
    slug: 'standing-pvc-pastel-harmony-board',
    price: 650000,
    hasExactPriceInImage: false,
    description: 'Papan PVC bertekstur kokoh anti basah dengan kombinasi bunga warna pastel lembut yang menyenangkan dipandang.',
    specifications: '• Papan PVC Tebal 10mm Presisi CNC\n• Bunga Segar Kombinasi Pastel\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '829686966_17900574534606034_6448258362421195532_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Grand Celebration White',
    slug: 'standing-pvc-grand-celebration-white',
    price: 700000,
    hasExactPriceInImage: false,
    description: 'Tampilan bersih, modern, dan sangat rapi dengan tulisan printing digital resolusi tinggi.',
    specifications: '• Papan PVC 80 x 120 cm Tahan Air\n• Rangkaian Bunga Segar Rimbun\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '829686969_17900574630606034_894785915794362176_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Minimalist Arch Golden Bloom',
    slug: 'standing-pvc-minimalist-arch-golden-bloom',
    price: 650000,
    hasExactPriceInImage: false,
    description: 'Bentuk arch ramping dengan aksen dedaunan emas dan bunga mawar warna peach hangat.',
    specifications: '• Papan PVC Arch 70 x 110 cm\n• Bunga Mawar & Daun Emas Dekoratif\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '830669366_17900574858606034_5150789031435908834_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Royal Red Grand Opening',
    slug: 'standing-pvc-royal-red-grand-opening',
    price: 700000,
    isFeatured: true,
    hasExactPriceInImage: false,
    description: 'Warna merah membawa energi positif dan keberuntungan untuk peluncuran toko atau kantor baru.',
    specifications: '• Papan Foam PVC Kokoh 80 x 120 cm\n• Bunga Mawar Merah Segar Pilihan\n• Stand Kayu 150 cm Finishing Bersih\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '837837459_17902081677606034_6838955002389438069_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Botanical Fresh Touch',
    slug: 'standing-pvc-botanical-fresh-touch',
    price: 650000,
    hasExactPriceInImage: false,
    description: 'Perpaduan elemen alam dedaunan hijau segar dan papan PVC putih matte yang elegan.',
    specifications: '• Papan PVC Anti Air 75 x 115 cm\n• Bunga Segar Alami & Daun Eucalyptus\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '841499481_17902433484606034_8732209606534275016_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Modern Wave Inauguration',
    slug: 'standing-pvc-modern-wave-inauguration',
    price: 750000,
    hasExactPriceInImage: false,
    description: 'Bentuk potongan gelombang asimetris dinamis yang memikat mata dan menonjol di keramaian acara.',
    specifications: '• Papan PVC Potongan Custom CNC Gelombang Unik\n• Bunga Segar Rimbun 2 Titik\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '842869800_17902433430606034_7623624826926686928_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Curve Congratulations',
    slug: 'standing-pvc-curve-congratulations',
    price: 650000,
    hasExactPriceInImage: false,
    description: 'Bentuk kurva melengkung modern dengan tulisan ucapan selamat yang jelas dan estetis.',
    specifications: '• Papan PVC Arch 70 x 110 cm\n• Bunga Segar Pilihan\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '845458355_17902686024606034_2921257073967753384_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Dual Tone Vibrant',
    slug: 'standing-pvc-dual-tone-vibrant',
    price: 700000,
    hasExactPriceInImage: false,
    description: 'Papan standing dengan perpaduan dua warna kontras dan rangkaian bunga segar yang cerah mempesona.',
    specifications: '• Papan PVC 80 x 120 cm\n• Bunga Segar Mawar, Gerbera, Aster\n• Free Ongkir Area Kota Bandung',
  },
  {
    folder: 'pvc',
    filename: '846485278_17902686261606034_6755544354785051659_n.webp',
    categorySlug: 'standing-pvc',
    skuPrefix: 'PVC',
    name: 'Standing PVC Deluxe Ceremony Stand',
    slug: 'standing-pvc-deluxe-ceremony-stand',
    price: 750000,
    hasExactPriceInImage: false,
    description: 'Standing flower PVC kualitas terbaik untuk upacara pelantikan, wisuda akbar, dan peresmian gedung.',
    specifications: '• Papan Foam PVC Grade Super Tebal 12mm\n• Bunga Segar Rimbun di Atas & Bawah\n• Selendang Satin Halus Menjuntai\n• Free Ongkir Area Kota Bandung',
  },
];

async function main() {
  console.log('Starting product synchronization...');

  // 1. Fetch categories
  const categories = await prisma.category.findMany();
  const categoryMap = new Map<string, string>();
  for (const c of categories) {
    categoryMap.set(c.slug, c.id);
  }

  console.log('Categories found:', Array.from(categoryMap.keys()));

  // 2. Fetch existing products
  const existingProducts = await prisma.product.findMany({
    include: { images: true },
  });
  const existingBySlug = new Map<string, typeof existingProducts[0]>();
  for (const p of existingProducts) {
    existingBySlug.set(p.slug, p);
  }

  let index = 1;
  const now = new Date();
  const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;

  for (const def of productsToSeed) {
    const categoryId = categoryMap.get(def.categorySlug);
    if (!categoryId) {
      console.warn(`Category slug ${def.categorySlug} not found in DB!`);
      continue;
    }

    const imageUrl = `/products/${def.folder}/${def.filename}`;
    const skuCode = `${def.skuPrefix}-${yyyymmdd}-${String(index).padStart(4, '0')}`;

    const existing = existingBySlug.get(def.slug);

    if (existing) {
      // Update existing
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: def.name,
          price: def.price,
          promoPrice: def.promoPrice || null,
          isPromo: !!def.promoPrice,
          isFeatured: def.isFeatured ?? false,
          description: def.description,
          specifications: def.specifications,
          categoryId,
          order: index,
        },
      });

      // Update primary image
      await prisma.productImage.deleteMany({ where: { productId: existing.id } });
      await prisma.productImage.create({
        data: {
          productId: existing.id,
          url: imageUrl,
          alt: def.name,
          isPrimary: true,
          order: 0,
        },
      });

      console.log(`Updated existing product: ${def.name} (${imageUrl})`);
    } else {
      // Create new product
      const newProduct = await prisma.product.create({
        data: {
          sku: skuCode,
          name: def.name,
          slug: def.slug,
          price: def.price,
          promoPrice: def.promoPrice || null,
          isPromo: !!def.promoPrice,
          isFeatured: def.isFeatured ?? false,
          isAvailable: true,
          isPublished: true,
          order: index,
          description: def.description,
          specifications: def.specifications,
          categoryId,
          images: {
            create: [
              {
                url: imageUrl,
                alt: def.name,
                isPrimary: true,
                order: 0,
              },
            ],
          },
        },
      });
      console.log(`Created product: ${newProduct.name} - SKU: ${newProduct.sku} - Price: ${def.price}`);
    }
    index++;
  }

  // Update transaction-referenced legacy products with real images if any remain
  const remainingLegacy = await prisma.product.findMany({
    where: {
      slug: { notIn: productsToSeed.map((p) => p.slug) },
    },
    include: { images: true, category: true },
  });

  for (const leg of remainingLegacy) {
    console.log(`Legacy product preserved for safety: ${leg.name} (${leg.sku})`);
    // Ensure it has a valid image from public/products if it currently points to old image
    if (!leg.images.length || leg.images[0].url.includes('/images/categories/')) {
      let fallbackImg = '/products/acrylics/770584632_17891757261606034_9140803580430233114_n.jpg';
      if (leg.category?.slug === 'standing-cermin') fallbackImg = '/products/mirror/825323912_17899864167606034_7793544683238572367_n.webp';
      if (leg.category?.slug === 'standing-pvc') fallbackImg = '/products/pvc/825323880_17900574807606034_4229647301355186480_n.webp';
      if (leg.category?.slug === 'standing-fresh') fallbackImg = '/products/fresh/825324104_17899864287606034_4343312750447264481_n.webp';
      if (leg.category?.slug === 'standing-duka-cita') fallbackImg = '/products/duka_cita/815138317_17899016673606034_7482983438027216366_n.webp';

      await prisma.productImage.deleteMany({ where: { productId: leg.id } });
      await prisma.productImage.create({
        data: {
          productId: leg.id,
          url: fallbackImg,
          alt: leg.name,
          isPrimary: true,
          order: 0,
        },
      });
      console.log(`Updated image for legacy product ${leg.name} -> ${fallbackImg}`);
    }
  }

  const totalProds = await prisma.product.count();
  console.log(`Product sync completed! Total products in database: ${totalProds}`);
}

main()
  .catch((e) => {
    console.error('Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
