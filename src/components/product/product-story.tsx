'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface ProductStoryProps {
  storyTitle: string
  storyContent: string
  storyImages: string[]
}

export function ProductStory({ storyTitle, storyContent, storyImages }: ProductStoryProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-4">
              Product Story
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {storyTitle}
            </h2>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {storyContent}
                </div>
              </div>

              {storyImages.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Story Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {storyImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}