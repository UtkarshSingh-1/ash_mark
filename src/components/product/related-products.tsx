"use client"

import { useEffect, useState } from "react"
import { ProductCard } from "./product-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  images: string[]
  featured: boolean
  trending: boolean
  category: {
    name: string
  }
}

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)

  const productsPerPage = 4
  const totalPages = Math.ceil(products.length / productsPerPage)

  useEffect(() => {
    fetchRelatedProducts()
  }, [categoryId, currentProductId])

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(
        `/api/products/related?categoryId=${categoryId}&excludeId=${currentProductId}&limit=12`
      )
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching related products:', error)
    } finally {
      setLoading(false)
    }
  }

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const getCurrentProducts = () => {
    const start = currentPage * productsPerPage
    const end = start + productsPerPage
    return products.slice(start, end)
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Related Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-square bg-muted"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted"></div>
                  <div className="h-6 bg-muted w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Related Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No related products found</h3>
            <p className="text-muted-foreground mb-4">
              Check out our full collection instead
            </p>
            <Button asChild className="bg-crimson-600 hover:bg-crimson-700 border-0">
              <Link href="/products">
                Browse All Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-crimson-600" />
            Related Products
          </CardTitle>
          <CardDescription>
            More products from the same category
          </CardDescription>
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="h-8 w-8 p-0 border-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="h-8 w-8 p-0 border-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {getCurrentProducts().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 transition-colors ${
                    currentPage === i ? 'bg-crimson-600' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="text-center mt-6">
          <Button variant="outline" asChild className="border-0 bg-muted/30">
            <Link href="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
