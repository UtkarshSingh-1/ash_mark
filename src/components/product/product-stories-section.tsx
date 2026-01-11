import { prisma } from '@/lib/db'
import { ProductStoryCard } from './product-story-card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { jsonToStringArray } from '@/lib/utils'

export async function ProductStoriesSection() {
  try {
    // Fetch products that have stories
    const productsWithStories = await prisma.product.findMany({
      where: {
        AND: [
          { storyTitle: { not: null } },
          { storyContent: { not: null } },
          { storyTitle: { not: '' } },
          { storyContent: { not: '' } }
        ]
      },
      include: {
        category: true,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 6 // Show latest 6 products with stories
    })

    // type ProductWithStory = Awaited<ReturnType<typeof prisma.product.findMany>>[number]
    type ProductWithStory = (typeof productsWithStories)[number]

    if (productsWithStories.length === 0) {
      return (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Product Stories Coming Soon
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We're working on bringing you the inspiring stories behind our products. Check back soon to discover the craftsmanship and passion that goes into each piece.
              </p>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Product Stories
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              The Stories Behind Our Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the inspiration, craftsmanship, and passion that goes into creating each piece in our collection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productsWithStories.map((product: ProductWithStory) => {
              const images = jsonToStringArray(product.images)
              const storyImages = jsonToStringArray(product.storyImages)
              return (
                <ProductStoryCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    storyTitle: product.storyTitle || '',
                    storyContent: product.storyContent || '',
                    storyImages: storyImages,
                    category: product.category,
                    images: images,
                  }}
                />
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error('Error fetching product stories:', error)
    return null
  }
}