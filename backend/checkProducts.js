import 'dotenv/config';
import prisma from './src/utils/db.js';

async function main() {
  const count = await prisma.product.count();
  const active = await prisma.product.count({ where: { isActive: true } });
  const first = await prisma.product.findMany({ take: 1, include: { images: true, category: true, brand: true } });
  console.log('count', count);
  console.log('active', active);
  console.log(JSON.stringify(first, null, 2));
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect().catch(() => {});
  process.exit(1);
});
