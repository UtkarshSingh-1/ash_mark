import { notFound } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { ProductImages } from "@/components/product/product-images"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { ReviewSection } from "@/components/product/review-section"
import { prisma } from "@/lib/db"
import { jsonToStringArray } from "@/lib/utils"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const product = await prisma.product.findUnique({
    where: { slug: (await params).slug },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  const images = jsonToStringArray(product.images)
  const sizes = jsonToStringArray(product.sizes) as string[]
  const colors = jsonToStringArray(product.colors) as string[]

  const serializedProduct = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    sizes,
    colors,
    stock: product.stock,
    featured: product.featured,
    trending: product.trending,
    category: {
      name: product.category.name,
    },
    storyContent: product.storyContent,
    storyTitle: product.storyTitle,
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <ProductImages images={images} name={serializedProduct.name} />

            {/* Product Info */}
            <ProductInfo product={serializedProduct} />
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <ProductTabs product={serializedProduct} />
          </div>

          {/* Reviews Section */}
          <div className="mt-16">
            <ReviewSection productId={product.id} />
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <RelatedProducts
              categoryId={product.categoryId}
              currentProductId={product.id}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: { slug: true },
  })

  type ProductSlug = (typeof products)[number]

  return products.map((product: ProductSlug) => ({
    slug: product.slug,
  }))
}