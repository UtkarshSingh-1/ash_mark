import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const m = await prisma.media.findMany({
        take: 5,
        orderBy: { createdAt: "desc" }
    })
    console.log("Recent Media:", m.map(x => ({ id: x.id, folder: x.folder, type: x.mimeType })))
}

main().finally(() => prisma.$disconnect())
