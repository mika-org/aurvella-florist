import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  if (products.length === 0) {
    console.log('No products found.');
    return;
  }

  // Sample transactions
  const samples = [
    {
      customerName: 'Ibu Sarah Wijaya',
      customerPhone: '081234567890',
      customerAddress: 'Gedung Graha Manggala Siliwangi, Jl. Aceh No.66, Bandung',
      boardGreeting: 'Selamat & Sukses atas Grand Opening Resto "Rasa Nusantara"',
      senderName: 'Direksi & Staff PT. Samudera Logistik Bandung',
      productIndex: 0,
      qty: 2,
      paymentMethod: 'TRANSFER',
      orderStatus: 'COMPLETED',
      notes: 'Papan bunga dikirim sebelum jam 09.00 pagi. Foto standing di lokasi.',
    },
    {
      customerName: 'Bapak Hendra Gunawan',
      customerPhone: '085711223344',
      customerAddress: 'Puri Cipaganti No.12, Coblong, Bandung',
      boardGreeting: 'Happy Wedding Clara & Dimas, Semoga Bahagia Selamanya',
      senderName: 'Keluarga Besar Gunawan & Rekan Bisnis',
      productIndex: 1,
      qty: 1,
      paymentMethod: 'TRANSFER',
      orderStatus: 'COMPLETED',
      notes: 'Warna bunga disesuaikan nuansa pastel gold.',
    },
    {
      customerName: 'PT. Telekomunikasi Seluler',
      customerPhone: '081122334455',
      customerAddress: 'Trans Luxury Hotel, Jl. Gatot Subroto No.289, Bandung',
      boardGreeting: 'Selamat atas Peluncuran Produk Baru 5G Regional Jabar',
      senderName: 'Management & Dewan Komisaris Telkom Regional 3',
      productIndex: 0,
      qty: 3,
      paymentMethod: 'TRANSFER',
      orderStatus: 'COMPLETED',
      notes: 'Logo perusahaan disertakan di sudut papan akrilik.',
    },
    {
      customerName: 'dr. Anita Kusuma',
      customerPhone: '081399887766',
      customerAddress: 'Rumah Duka Borromeus, Jl. Suryakencana No.1, Bandung',
      boardGreeting: 'Turut Berduka Cita atas Berpulangnya Bpk. Ir. Hartono',
      senderName: 'Alumni FK Unpad Angkatan 2005',
      productIndex: Math.min(3, products.length - 1),
      qty: 1,
      paymentMethod: 'QRIS',
      orderStatus: 'COMPLETED',
      notes: 'Bunga putih bersih khidmat.',
    },
    {
      customerName: 'Bpk. Rizky Ramadhan',
      customerPhone: '087812345678',
      customerAddress: 'Jl. Riau No.45, Citarum, Bandung Wetan',
      boardGreeting: 'Congratulation on Grand Opening Boutique "Aura Mode"',
      senderName: 'Sahabat Seperjuangan Bandung',
      productIndex: 2,
      qty: 2,
      paymentMethod: 'SHOPEE',
      orderStatus: 'COMPLETED',
      notes: 'Pita rose gold mewah.',
    },
  ];

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const prod = products[s.productIndex % products.length];
    const unitPrice = prod.promoPrice && prod.isPromo ? Number(prod.promoPrice) : Number(prod.price);
    const subtotal = unitPrice * s.qty;
    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(i + 1).padStart(4, '0')}`;

    const existing = await prisma.transaction.findUnique({
      where: { invoiceNumber },
    });

    if (!existing) {
      await prisma.transaction.create({
        data: {
          invoiceNumber,
          customerName: s.customerName,
          customerPhone: s.customerPhone,
          customerAddress: s.customerAddress,
          boardGreeting: s.boardGreeting,
          senderName: s.senderName,
          totalAmount: subtotal,
          paymentMethod: s.paymentMethod,
          paymentStatus: 'PAID',
          orderStatus: s.orderStatus,
          notes: s.notes,
          items: {
            create: [
              {
                productId: prod.id,
                productName: prod.name,
                productSku: prod.sku,
                price: unitPrice,
                quantity: s.qty,
                subtotal: subtotal,
              },
            ],
          },
        },
      });

      // Update totalSold
      await prisma.product.update({
        where: { id: prod.id },
        data: {
          totalSold: { increment: s.qty },
        },
      });
      console.log(`Created transaction: ${invoiceNumber} for ${prod.name} (Qty: ${s.qty})`);
    }
  }

  console.log('Seeding transactions completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
