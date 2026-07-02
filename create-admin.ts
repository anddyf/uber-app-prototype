import "dotenv/config";
console.log("DATABASE_URL loaded:", !!process.env.DATABASE_URL);
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const EMAIL = "admin@example.com";
const PASSWORD = "secret123";
const NAME = "Admin";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const db = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const user = await db.user.upsert({
    where: { email: EMAIL },
    update: { passwordHash, role: "ADMIN" },
    create: {
      email: EMAIL,
      name: NAME,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user ready:", user.email, "role:", user.role);
}

main()
  .catch((e) => {
    console.error("❌ Failed to create admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });