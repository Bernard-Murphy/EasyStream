import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is required');
  }

  const username = process.env.MOD_USERNAME ?? 'admin';
  const email = process.env.MOD_EMAIL ?? 'admin@example.com';
  const password = process.env.MOD_PASSWORD ?? 'change_me';

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    const password_hash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { username },
      update: {
        email,
        password_hash,
      },
      create: {
        username,
        email,
        password_hash,
      },
    });

    // eslint-disable-next-line no-console
    console.log(`Seeded moderator user: ${username} (${email})`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


