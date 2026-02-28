const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const id = 'cmm67moy60001l204kt24y7lj';
    const media = await prisma.media.findUnique({ where: { id } });
    console.log('Media ID:', id);
    console.log('Folder:', media ? media.folder : 'NOT FOUND');
}

main().catch(console.error).finally(() => prisma.$disconnect());
