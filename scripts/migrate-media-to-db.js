// scripts/migrate-media.js
import { PrismaClient } from '@prisma/client';
import https from 'https';
import http from 'http';
import { Buffer } from 'buffer';

const prisma = new PrismaClient();

// Helper to download a file into a Buffer
function downloadFile(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        protocol.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
            }

            const contentType = res.headers['content-type'] || 'application/octet-stream';
            const size = parseInt(res.headers['content-length'] || '0', 10);

            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve({ buffer, mimeType: contentType, size: buffer.length || size });
            });
        }).on('error', reject);
    });
}

// Helper to convert an external URL to a local DB media URL
async function processAndStoreMedia(url, folder) {
    try {
        // If it's already a local DB URL, skip
        if (url.startsWith('/api/media/')) {
            return url;
        }

        console.log(`Downloading: ${url}`);
        const { buffer, mimeType, size } = await downloadFile(url);

        // Determine kind
        let kind = "IMAGE";
        if (mimeType.startsWith("video/")) {
            kind = "VIDEO";
        }

        // Save to database
        const mediaRow = await prisma.media.create({
            data: {
                mimeType,
                size,
                folder,
                kind,
                data: buffer,
            },
        });

        const newUrl = `/api/media/${folder}/${mediaRow.id}`;
        console.log(`Saved as: ${newUrl}`);
        return newUrl;

    } catch (err) {
        console.error(`Error processing ${url}:`, err);
        return url; // Return original on failure
    }
}

async function main() {
    console.log('--- Starting Media DB Migration ---');

    // 1. PRODUCTS
    const products = await prisma.product.findMany();
    for (const product of products) {
        console.log(`Processing Product: ${product.name}`);

        // Move main images
        let updatedImages = [];
        if (Array.isArray(product.images)) {
            for (const imgUrl of product.images) {
                if (typeof imgUrl === 'string') {
                    updatedImages.push(await processAndStoreMedia(imgUrl, 'products'));
                }
            }
        }

        // Move story images
        let updatedStoryImages = [];
        if (Array.isArray(product.storyImages)) {
            for (const imgUrl of product.storyImages) {
                if (typeof imgUrl === 'string') {
                    updatedStoryImages.push(await processAndStoreMedia(imgUrl, 'stories'));
                }
            }
        }

        // Update Product
        await prisma.product.update({
            where: { id: product.id },
            data: {
                images: updatedImages,
                storyImages: updatedStoryImages,
            }
        });
    }

    // 2. REELS
    const reels = await prisma.reel.findMany();
    for (const reel of reels) {
        console.log(`Processing Reel: ${reel.id}`);
        const newVideoUrl = await processAndStoreMedia(reel.videoUrl, 'reels');
        await prisma.reel.update({
            where: { id: reel.id },
            data: { videoUrl: newVideoUrl }
        });
    }

    // 3. CATEGORIES
    const categories = await prisma.category.findMany();
    for (const category of categories) {
        if (category.image) {
            console.log(`Processing Category: ${category.name}`);
            const newImage = await processAndStoreMedia(category.image, 'categories');
            await prisma.category.update({
                where: { id: category.id },
                data: { image: newImage }
            });
        }
    }

    // 4. REVIEWS
    const reviews = await prisma.review.findMany();
    for (const review of reviews) {
        if (Array.isArray(review.media) && review.media.length > 0) {
            console.log(`Processing Review: ${review.id}`);
            let updatedMedia = [];
            for (const m of review.media) {
                if (m.type === 'image' || m.type === 'video') {
                    const newUrl = await processAndStoreMedia(m.url, 'reviews');
                    updatedMedia.push({ ...m, url: newUrl });
                } else if (typeof m === 'string') {
                    const newUrl = await processAndStoreMedia(m, 'reviews');
                    updatedMedia.push(newUrl);
                } else {
                    updatedMedia.push(m);
                }
            }

            await prisma.review.update({
                where: { id: review.id },
                data: { media: updatedMedia }
            });
        }
    }

    console.log('--- Migration Complete ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
