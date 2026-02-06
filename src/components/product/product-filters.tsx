"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const res = await fetch('/api/categories', { 
          signal: controller.signal 
        })
        
        clearTimeout(timeoutId)
        
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories || [])
        } else {
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
      }
    }
    
    fetchCategories()
  }, [])

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset page when filters change
    router.push(`?${params.toString()}`)
  }

  const clearFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setSelectedCategory('')
    router.push('/products')
  }

  const activeFiltersCount = [
    searchParams.get('category'),
    searchParams.get('minPrice'),
    searchParams.get('maxPrice'),
    searchParams.get('search'),
    searchParams.get('featured'),
    searchParams.get('trending'),
  ].filter(Boolean).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filters</CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <>
            <div>
              <Label className="text-sm font-medium">Active Filters</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {searchParams.get('search') && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {searchParams.get('search')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString())
                        params.delete('search')
                        router.push(`?${params.toString()}`)
                      }}
                    />
                  </Badge>
                )}
                {searchParams.get('category') && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categories.find(c => c.slug === searchParams.get('category'))?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters('category', '')}
                    />
                  </Badge>
                )}
                {searchParams.get('minPrice') && (
                  <Badge variant="secondary" className="gap-1">
                    Min: ???{searchParams.get('minPrice')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters('minPrice', '')}
                    />
                  </Badge>
                )}
                {searchParams.get('maxPrice') && (
                  <Badge variant="secondary" className="gap-1">
                    Max: ???{searchParams.get('maxPrice')}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters('maxPrice', '')}
                    />
                  </Badge>
                )}
                {searchParams.get('featured') && (
                  <Badge variant="secondary" className="gap-1">
                    Featured
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters('featured', '')}
                    />
                  </Badge>
                )}
                {searchParams.get('trending') && (
                  <Badge variant="secondary" className="gap-1">
                    Trending
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => updateFilters('trending', '')}
                    />
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Categories */}
        <div>
          <Label className="text-sm font-medium">Categories</Label>
          <div className="mt-2 space-y-2">
            <Button
              variant={!selectedCategory ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                setSelectedCategory('')
                updateFilters('category', '')
              }}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setSelectedCategory(category.slug)
                  updateFilters('category', category.slug)
                }}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="mt-2 space-y-3">
            <div>
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                Minimum Price
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="₹0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={() => updateFilters('minPrice', minPrice)}
              />
            </div>
            <div>
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                Maximum Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="₹10000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={() => updateFilters('maxPrice', maxPrice)}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Filters */}
        <div>
          <Label className="text-sm font-medium">Quick Filters</Label>
          <div className="mt-2 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('featured', 'true')
                params.delete('page')
                router.push(`?${params.toString()}`)
              }}
            >
              Featured Products
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('trending', 'true')
                params.delete('page')
                router.push(`?${params.toString()}`)
              }}
            >
              Trending Now
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.set('maxPrice', '1000')
                params.delete('page')
                router.push(`?${params.toString()}`)
              }}
            >
              Under ₹1000
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
