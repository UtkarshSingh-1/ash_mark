"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductTabsProps {
  product: {
    id: string
    name: string
    description: string | null
    sizes: string[]
    colors: string[]
    // Optional fields allowed so callers can pass serialized pricing
    price?: number
    comparePrice?: number | null
    storyContent?: string | null
    storyTitle?: string | null
  }
}

export function ProductTabs({ product }: ProductTabsProps) {
  const hasStory = !!product.storyContent

  return (
    <Tabs defaultValue={hasStory ? "story" : "specifications"} className="w-full">
      <TabsList className={`grid w-full ${hasStory ? "grid-cols-2" : "grid-cols-1"}`}>
        {hasStory && <TabsTrigger value="story">Story</TabsTrigger>}
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
      </TabsList>

      {hasStory && (
        <TabsContent value="story" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{product.storyTitle || "Product Story"}</h3>
                <div
                  className="text-muted-foreground leading-relaxed prose dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.storyContent || "" }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      )}

      <TabsContent value="specifications" className="mt-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Specifications</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Material</h4>
                  <p className="text-muted-foreground">100% Premium Cotton</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Fit</h4>
                  <p className="text-muted-foreground">Regular Fit</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Care Instructions</h4>
                  <p className="text-muted-foreground">Machine wash cold, tumble dry low</p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Origin</h4>
                  <p className="text-muted-foreground">Made in India</p>
                </div>
              </div>

              {product.sizes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Available Sizes</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Badge key={size} variant="outline">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.colors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Available Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Badge key={color} variant="outline">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

    </Tabs>
  )
}
