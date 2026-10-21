import prisma from '../src/lib/prisma';

async function main() {
  console.log('Checking for products with non-standard slugs...');
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  let fixedCount = 0;
  for (const p of products) {
    const cleaned = p.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (cleaned !== p.slug) {
      console.log(`Fixing product ${p.name}:`);
      console.log(`  Old: ${p.slug}`);
      console.log(`  New: ${cleaned}`);

      // Check if new slug already exists
      const exists = await prisma.product.findFirst({
        where: { slug: cleaned, id: { not: p.id } },
      });

      const finalSlug = exists ? `${cleaned}-${p.id.slice(0, 4)}` : cleaned;

      await prisma.product.update({
        where: { id: p.id },
        data: { slug: finalSlug },
      });
      fixedCount++;
    }
  }

  console.log(`Successfully fixed ${fixedCount} product slugs.`);
}

main()
  .catch((e) => {
    console.error('Error fixing slugs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
