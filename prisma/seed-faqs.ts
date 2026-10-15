import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const initialFaqs = [
    {
      question: 'Berapa lama proses perangkaian standing flower di Aurvella Florist?',
      answer: 'Proses perangkaian standing flower membutuhkan waktu sekitar 2 hingga 4 jam tergantung model dan kerumitan desain (Standing Akrilik, Standing Cermin, atau PVC). Kami juga menyediakan layanan Same Day Delivery untuk pesanan mendesak di hari yang sama.',
      order: 1,
      isActive: true,
    },
    {
      question: 'Apakah gratis ongkir berlaku untuk seluruh wilayah Bandung?',
      answer: 'Ya, kami memberikan fasilitas Free Ongkir untuk area Kota Bandung dan Kota Cimahi. Untuk wilayah Kabupaten Bandung dan Bandung Barat (seperti Lembang, Padalarang, Soreang, Banjaran), kami tetap melayani dengan penyesuaian tarif kurir khusus yang terjangkau dan aman.',
      order: 2,
      isActive: true,
    },
    {
      question: 'Apakah bisa request ucapan, nama pengirim, dan logo perusahaan di papan bunga?',
      answer: 'Sangat bisa! Desain papan akrilik dan cermin dapat disesuaikan sepenuhnya (custom), termasuk penempatan logo perusahaan, instansi, foto, serta jenis font ucapan yang elegan. Tim kami akan mengirimkan preview desain digital sebelum diproduksi.',
      order: 3,
      isActive: true,
    },
    {
      question: 'Apakah ada foto dokumentasi sebelum dan sesudah bunga sampai di lokasi?',
      answer: 'Pasti ada. Kami menerapkan standar Garansi Foto Sebelum Kirim (Proofing Foto). Florist kami akan mengirimkan foto standing flower setelah selesai dirangkai di workshop untuk konfirmasi, serta foto dokumentasi saat bunga sudah terpasang rapi di lokasi acara.',
      order: 4,
      isActive: true,
    },
    {
      question: 'Apa perbedaan standing flower bunga segar (fresh) dan artificial?',
      answer: 'Bunga segar (Fresh Flower) menggunakan bunga potong asli grade A pilihan yang harum dan mekar sempurna, sangat cocok untuk perayaan hari-H. Sedangkan Artificial Flower menggunakan material kain sutra dan latex premium yang tampak sangat nyata, tahan cuaca, serta tidak akan layu.',
      order: 5,
      isActive: true,
    },
    {
      question: 'Bagaimana cara pemesanan dan metode pembayaran yang tersedia?',
      answer: 'Pemesanan sangat mudah, cukup klik tombol WhatsApp di katalog produk atau hubungi kami langsung di 0857-7018-7018. Kami menerima pembayaran via Transfer Bank (BCA, Mandiri, BRI, BNI), QRIS instan, serta pemesanan aman melalui toko resmi kami di Shopee.',
      order: 6,
      isActive: true,
    },
  ];

  for (const item of initialFaqs) {
    const existing = await prisma.faq.findFirst({
      where: { question: item.question },
    });

    if (!existing) {
      await prisma.faq.create({ data: item });
    }
  }

  console.log(`Seeded ${initialFaqs.length} initial FAQs successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
