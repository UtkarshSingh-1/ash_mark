import { prisma } from "@/lib/db"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProductSort } from "./product-sort"

interface ProductGridProps {
  searchParams: {
    search?: string
    category?: string
    page?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    featured?: string
    trending?: string
  }
}

export async function ProductGrid({ searchParams }: ProductGridProps) {
  const sp = searchParams
  const page = parseInt(sp.page || '1')
  const limit = 12
  const search = sp.search
  const category = sp.category
  const minPrice = sp.minPrice
  const maxPrice = sp.maxPrice
  const featured = sp.featured
  const trending = sp.trending
  const sort = sp.sort || 'createdAt'
  const order = 'desc'

  const skip = (page - 1) * limit

  const where: any = {}

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ]
  }

  if (category) {
    where.category = { slug: category }
  }

  if (minPrice || maxPrice) {
    where.price = {}
    if (minPrice) where.price.gte = parseFloat(minPrice)
    if (maxPrice) where.price.lte = parseFloat(maxPrice)
  }

  if (featured === "true") {
    where.featured = true
  }

  if (trending === "true") {
    where.trending = true
  }

  const orderBy: any = {}
  orderBy[sort] = order

  let products: any[] = []
  let total = 0
  
  try {
    const [productsResult, totalResult] = await Promise.race([
      Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
          },
          skip,
          take: limit,
          orderBy,
        }),
        prisma.product.count({ where }),
      ]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout')), 8000)
      )
    ]) as [any[], number]
    
    products = productsResult
    total = totalResult
  } catch (error) {
    // If database is unreachable or times out, render empty state
    console.error('Database error:', error)
    products = []
    total = 0
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {search ? `Search Results for "${search}"` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            Showing {products.length} of {total} products
          </p>
        </div>
        
        <ProductSort value={sort} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={{ ...product, price: product.price.toNumber(), comparePrice: product.comparePrice?.toNumber() }} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          {page > 1 && (
            <Button variant="outline" asChild>
              <Link href={`?${(() => { const params = new URLSearchParams(); Object.entries(sp).forEach(([k, v]) => { if (typeof v === 'string') params.set(k, v) }); params.set('page', (page - 1).toString()); return params.toString() })()}`}>
                Previous
              </Link>
            </Button>
          )}
          
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          
          {page < totalPages && (
            <Button variant="outline" asChild>
              <Link href={`?${(() => { const params = new URLSearchParams(); Object.entries(sp).forEach(([k, v]) => { if (typeof v === 'string') params.set(k, v) }); params.set('page', (page + 1).toString()); return params.toString() })()}`}>
                Next
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
