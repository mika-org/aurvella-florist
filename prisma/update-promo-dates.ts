import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Set promoEnd for promo products to 3 days in the future from now
  const futurePromoEnd = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000); // 3 days, 5 hours

  const updated = await prisma.product.updateMany({
    where: { isPromo: true },
    data: {
      promoEnd: futurePromoEnd,
    },
  });

  console.log(`Updated ${updated.count} promo products with promoEnd: ${futurePromoEnd.toISOString()}`);

  const promoProducts = await prisma.product.findMany({
    where: { isPromo: true },
    select: { id: true, sku: true, name: true, price: true, promoPrice: true, promoEnd: true },
  });

  console.log('Active Promo Products:', promoProducts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
