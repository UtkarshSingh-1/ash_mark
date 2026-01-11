import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const timeoutId = setTimeout(() => {
    console.error('Categories API timeout - operation took too long')
  }, 5000) // 5 second timeout for categories

  try {
    const categories = await Promise.race([
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 4000)
      )
    ]) as any[]

    clearTimeout(timeoutId)
    return NextResponse.json({ categories })
  } catch (error) {
    clearTimeout(timeoutId)
    console.error('Database error:', error)
    return NextResponse.json({ categories: [] }, { status: 200 })
  }
}

