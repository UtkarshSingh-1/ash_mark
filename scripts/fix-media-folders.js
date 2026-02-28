const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixFolders(tableData, fieldExtractor, extractId, newFolder) {
    let count = 0;
    for (const item of tableData) {
        const images = fieldExtractor(item);
        for (const img of images) {
            const id = extractId(img);
            if (id) {
                const result = await prisma.media.updateMany({
                    where: { id, folder: 'general' }, // only fix those stuck in fallback 'general'
                    data: { folder: newFolder }
                });
                if (result.count > 0) {
                    console.log(`Updated media ${id} to folder ${newFolder}`);
                    count += result.count;
                }
            }
        }
    }
    return count;
}

function extractIdFromUrl(url) {
    if (typeof url !== 'string') return null;
    const match = url.match(/\/api\/media\/[^\/]+\/([^\/]+)$/);
    return match ? match[1] : null;
}

async function main() {
    const products = await prisma.product.findMany();
    let totalFixed = 0;

    totalFixed += await fixFolders(
        products,
        p => Array.isArray(p.images) ? p.images : [],
        extractIdFromUrl, 'products'
    );

    totalFixed += await fixFolders(
        products,
        p => Array.isArray(p.storyImages) ? p.storyImages : [],
        extractIdFromUrl, 'stories'
    );

    const categories = await prisma.category.findMany();
    totalFixed += await fixFolders(
        categories,
        c => c.image ? [c.image] : [],
        extractIdFromUrl, 'categories'
    );

    const reels = await prisma.reel.findMany();
    totalFixed += await fixFolders(
        reels,
        r => r.videoUrl ? [r.videoUrl] : [],
        extractIdFromUrl, 'reels'
    );

    console.log(`Successfully fixed ${totalFixed} media folders in the database.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
