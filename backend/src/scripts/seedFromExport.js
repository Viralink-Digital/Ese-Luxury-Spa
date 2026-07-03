import 'dotenv/config';
import prisma from '../utils/db.js';
import fs from 'fs';
import path from 'path';

async function seedFromExport() {
  console.log('Seeding database from exported data...\n');

  // Read the exported data
  const seedDataPath = path.join(process.cwd(), 'src/scripts/seedData.json');
  
  if (!fs.existsSync(seedDataPath)) {
    console.error('❌ seedData.json not found. Run exportDatabaseData.js first.');
    process.exit(1);
  }

  const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

  console.log(`Importing ${seedData.products.length} products...`);
  console.log(`Importing ${seedData.categories.length} categories...`);
  console.log(`Importing ${seedData.brands.length} brands...\n`);

  // Seed categories
  for (const category of seedData.categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }
  console.log('✅ Categories seeded');

  // Seed brands
  for (const brand of seedData.brands) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: brand,
      create: brand,
    });
  }
  console.log('✅ Brands seeded');

  // Seed products
  for (const product of seedData.products) {
    const { images, category, ...productData } = product;
    
    await prisma.product.upsert({
      where: { id: product.id },
      update: productData,
      create: productData,
    });

    // Seed product images
    for (const image of images) {
      await prisma.productImage.upsert({
        where: { id: image.id || `${product.id}-${image.sortOrder}` },
        update: image,
        create: {
          ...image,
          productId: product.id,
          id: image.id || `${product.id}-${image.sortOrder}`,
        },
      });
    }
  }
  console.log('✅ Products seeded');

  console.log('\n✅ Database seeding completed successfully!');
  console.log(`   - ${seedData.products.length} products`);
  console.log(`   - ${seedData.categories.length} categories`);
  console.log(`   - ${seedData.brands.length} brands`);

  await prisma.$disconnect();
}

seedFromExport().catch(async (error) => {
  console.error('Error:', error);
  await prisma.$disconnect();
  process.exit(1);
});