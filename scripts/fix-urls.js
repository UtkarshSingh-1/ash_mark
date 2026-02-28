const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = await prisma.product.findMany();
    let count = 0;

    for (const product of products) {
        let changed = false;
        let newImages = [];
        if (Array.isArray(product.images)) {
            newImages = product.images.map(img => {
                if (typeof img === 'string' && img.startsWith('/api/media/') && !img.includes('/api/media/products/') && !img.includes('/api/media/categories/') && !img.includes('/api/media/stories/') && !img.includes('/api/media/reels/') && !img.includes('/api/media/reviews/')) {
                    changed = true;
                    return img.replace('/api/media/', '/api/media/products/');
                }
                return img;
            });
        }

        let changedStory = false;
        let newStoryImages = [];
        if (Array.isArray(product.storyImages)) {
            newStoryImages = product.storyImages.map(img => {
                if (typeof img === 'string' && img.startsWith('/api/media/') && !img.includes('/api/media/products/') && !img.includes('/api/media/categories/') && !img.includes('/api/media/stories/') && !img.includes('/api/media/reels/') && !img.includes('/api/media/reviews/')) {
                    changedStory = true;
                    return img.replace('/api/media/', '/api/media/stories/');
                }
                return img;
            });
        }

        if (changed || changedStory) {
            console.log(`Updating product ${product.id}`);
            await prisma.product.update({
                where: { id: product.id },
                data: {
                    images: newImages,
                    storyImages: newStoryImages
                }
            });
            count++;
        }
    }

    // Also fix Categories
    const categories = await prisma.category.findMany();
    for (const cat of categories) {
        if (typeof cat.image === 'string' && cat.image.startsWith('/api/media/') && !cat.image.includes('/api/media/categories/')) {
            console.log(`Updating category ${cat.id}`);
            await prisma.category.update({
                where: { id: cat.id },
                data: { image: cat.image.replace('/api/media/', '/api/media/categories/') }
            });
            count++;
        }
    }

    console.log(`Fixed ${count} records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
