import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../utils/db.js';

const email = 'admin.esecosmetics.beauty';
const password = 'Great gamer23';
const phone = '0550154253';
const name = 'Saviour Bravo';

async function seedAdmin() {
  console.log('🌱 Seeding super admin account...');

  const [firstName, ...rest] = name.trim().split(' ');
  const lastName = rest.join(' ') || 'Admin';
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        email,
        phone,
        passwordHash,
        firstName,
        lastName,
        role: 'SUPER_ADMIN',
        isVerified: true,
        isActive: true,
      },
    });

    console.log(`✅ Super admin updated: ${email}`);
    console.log(`📧 Email: ${email}`);
    console.log(`📱 Phone: ${phone}`);
    console.log('🔑 Password: Great gamer23');
    await prisma.$disconnect();
    return;
  }

  const admin = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash,
      firstName,
      lastName,
      role: 'SUPER_ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Super admin created: ${admin.email}`);
  console.log(`📧 Email: ${email}`);
  console.log(`📱 Phone: ${phone}`);
  console.log('🔑 Password: Great gamer23');
  await prisma.$disconnect();
}

seedAdmin().catch(async (error) => {
  console.error('❌ Admin seed failed:', error);
  await prisma.$disconnect();
  process.exit(1);
});
