'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Link from 'next/link'
import Image from 'next/image'

interface ProductStoryCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number | string
    storyTitle: string
    storyContent: string
    storyImages: string[]
    category: {
      name: string
    }
    images: string[]
  }
}

export function ProductStoryCard({ product }: ProductStoryCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg">
            {product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-3">
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.storyTitle}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {product.storyContent}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ₹{Number(product.price)}
            </span>
            <span className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
              Read Full Story →
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {product.storyTitle}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2">
              <Badge variant="outline">{product.category.name}</Badge>
              <span className="text-lg font-semibold text-gray-900">
                ₹{Number(product.price)}
              </span>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-6">
            {product.images.length > 0 && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {product.storyContent}
              </div>
            </div>

            {product.storyImages.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  Story Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.storyImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <Image
                        src={image}
                        alt={`Story image ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Link
                href={`/products/${product.slug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                onClick={() => setIsDialogOpen(false)}
              >
                View Product Details →
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

