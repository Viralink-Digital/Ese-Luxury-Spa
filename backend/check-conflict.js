import 'dotenv/config';
import prisma from './src/utils/db.js';
import fs from 'fs';

const seedData = JSON.parse(
  fs.readFileSync('./src/scripts/seedData.json', 'utf-8')
);

for (const product of seedData.products) {
  if (!product.sku) continue;

  const existing = await prisma.product.findUnique({
    where: {
      sku: product.sku,
    },
  });

  if (existing) {
    console.log('\n🚨 CONFLICT FOUND');
    console.log('Seed data:');
    console.log({
      id: product.id,
      sku: product.sku,
      name: product.name,
    });

    console.log('Database:');
    console.log({
      id: existing.id,
      sku: existing.sku,
      name: existing.name,
    });
  }
}

await prisma.$disconnect();