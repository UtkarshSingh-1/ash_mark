const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const id = 'cmm67moy60001l204kt24y7lj';
    const media = await prisma.media.findUnique({ where: { id } });
    console.log('Media exists:', !!media, 'Folder:', media ? media.folder : 'N/A');
}

main().catch(console.error).finally(() => prisma.$disconnect());
