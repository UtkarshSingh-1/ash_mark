const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1) return null;
  return process.argv[index + 1] || null;
}

async function main() {
  const email =
    getArg("--email") || process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL;
  const password =
    getArg("--password") ||
    process.env.ADMIN_PASSWORD ||
    process.env.SEED_ADMIN_PASSWORD;
  const name = getArg("--name") || process.env.ADMIN_NAME || null;

  if (!email) {
    throw new Error("Email is required. Use --email or ADMIN_EMAIL.");
  }

  const data = {
    role: "ADMIN",
  };

  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }

  if (name) {
    data.name = name;
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data,
    });
    return `Updated admin user: ${email}`;
  }

  await prisma.user.create({
    data: {
      email,
      name: name || email.split("@")[0],
      ...data,
    },
  });

  return `Created admin user: ${email}`;
}

main()
  .then(async (message) => {
    await prisma.$disconnect();
    console.log(message);
  })
  .catch(async (error) => {
    console.error("Seed admin failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
