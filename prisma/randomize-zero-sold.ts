import prisma from '../src/lib/prisma';

async function main() {
  console.log('Finding products with totalSold <= 0...');
  const productsToUpdate = await prisma.product.findMany({
    where: {
      totalSold: { lte: 0 },
    },
    select: {
      id: true,
      name: true,
      totalSold: true,
    },
  });

  console.log(`Found ${productsToUpdate.length} products with totalSold <= 0`);

  let updatedCount = 0;
  for (const product of productsToUpdate) {
    // Random between 7 and 100 (inclusive)
    const randomSold = Math.floor(Math.random() * (100 - 7 + 1)) + 7;
    await prisma.product.update({
      where: { id: product.id },
      data: { totalSold: randomSold },
    });
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} products with random totalSold (7 - 100).`);

  // Verify
  const remainingZero = await prisma.product.count({
    where: { totalSold: { lte: 0 } },
  });
  console.log(`Remaining products with totalSold <= 0: ${remainingZero}`);
}

main()
  .catch((e) => {
    console.error('Error updating products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
