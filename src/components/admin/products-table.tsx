"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatPrice, formatDate } from "@/lib/utils"
import { MoreHorizontal, Search, Edit, Trash2, Eye, Plus, Package } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  stock: number
  featured: boolean
  trending: boolean
  images: string[]
  createdAt: string
  category: {
    id: string
    name: string
  }
}

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [products, searchQuery])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId))
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } else {
        throw new Error('Failed to delete product')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  const toggleFeatured = async (productId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured: !featured }),
      })

      if (response.ok) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, featured: !featured } : p
        ))
        toast({
          title: "Success",
          description: `Product ${!featured ? 'featured' : 'unfeatured'} successfully`,
        })
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-muted mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Products Management
        </CardTitle>
        <Button asChild className="bg-crimson-600 hover:bg-crimson-700 border-0">
          <Link href="/admin/products/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 border-0"
            />
          </div>

          {/* Table */}
          <div className="border-0 overflow-hidden bg-background">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border">
                  <TableHead className="w-16">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No products match your search' : 'No products found'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-b border-border hover:bg-muted/30">
                      <TableCell>
                        <Image
                          src={product.images[0] || '/placeholder-product.jpg'}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <Link 
                            href={`/products/${product.slug}`}
                            className="font-medium hover:text-crimson-600 transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">
                            ID: {product.id.slice(-8)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-0 bg-muted/50">
                          {product.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{formatPrice(Number(product.price))}</div>
                          {product.comparePrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(Number(product.comparePrice))}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                          {product.stock}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {product.featured && (
                            <Badge className="bg-crimson-600 text-xs border-0">Featured</Badge>
                          )}
                          {product.trending && (
                            <Badge variant="secondary" className="text-xs border-0">Trending</Badge>
                          )}
                          {!product.featured && !product.trending && (
                            <Badge variant="outline" className="text-xs border-0 bg-muted/50">Regular</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(new Date(product.createdAt))}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 border-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="border-0">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/products/${product.slug}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Product
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/products/${product.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleFeatured(product.id, product.featured)}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              {product.featured ? 'Unfeature' : 'Feature'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
