"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ProductTabsProps {
  product: {
    id: string
    name: string
    storyContent?: string | null
    storyTitle?: string | null
    storyImage?: string | null
  }
}

export function ProductTabs({ product }: ProductTabsProps) {
  const hasStory = !!product.storyContent

  if (!hasStory) return null

  return (
    <div className="w-full">
      <Card>
        <CardContent className="pt-6 space-y-6">

          {/* Story Header */}
          <h2 className="text-2xl font-semibold">Story</h2>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            
            {/* IMAGE LEFT */}
            {product.storyImage && (
              <div className="w-full">
                <Image
                  src={product.storyImage}
                  alt={product.name}
                  width={800}
                  height={1000}
                  className="w-full h-auto rounded-lg object-cover"
                  priority
                />
              </div>
            )}

            {/* TEXT RIGHT */}
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-4">
                {product.storyTitle || "Product Story"}
              </h3>

              <div
                className="text-muted-foreground leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: product.storyContent || "" }}
              />
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
