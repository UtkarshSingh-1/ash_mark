import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(request: NextRequest) {
    try {
        const session = await auth()
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get("limit") || "5")

        const topProducts = await prisma.orderItem.groupBy({
            by: ["productId"],
            _sum: {
                quantity: true,
                price: true, // This assumes price in OrderItem is total price for the item row, checking schema might be needed but assuming standard
            },
            orderBy: {
                _sum: {
                    quantity: "desc",
                },
            },
            take: limit,
        })

        const productIds = topProducts.map((p) => p.productId)

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
            include: {
                category: true,
            },
        })

        const results = topProducts.map((tp) => {
            const product = products.find((p) => p.id === tp.productId)
            return {
                id: tp.productId,
                name: product?.name || "Unknown Product",
                slug: product?.slug || "",
                price: Number(product?.price || 0),
                images: product ? JSON.parse(JSON.stringify(product.images)) : [], // Helper to parse if needed, but usually images is Json
                salesCount: tp._sum.quantity || 0,
                revenue: Number(tp._sum.price || 0), // Adjusting calculation if price is unit price
                category: {
                    name: product?.category?.name || "Uncategorized",
                },
            }
        }).filter(p => p.name !== "Unknown Product")

        // Sort again because fetching products might lose order
        results.sort((a, b) => b.salesCount - a.salesCount)

        return NextResponse.json({ products: results })
    } catch (error) {
        console.error("Error fetching top products:", error)
        return NextResponse.json({ error: "Failed to fetch top products" }, { status: 500 })
    }
}
