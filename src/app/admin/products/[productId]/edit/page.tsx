import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { EditProductForm } from "@/components/admin/products/edit-product-form"
import { EditProductPreview } from "@/components/admin/products/edit-product-preview"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { jsonToStringArray } from "@/lib/utils"

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const { productId } = await params

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  // Serialize Prisma Decimal and Json fields for client components
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    images: jsonToStringArray(product.images),
    sizes: jsonToStringArray(product.sizes),
    colors: jsonToStringArray(product.colors),
    storyImages: jsonToStringArray(product.storyImages),
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild className="border-0 bg-muted/30">
              <Link href={`/admin/products/${productId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Product
              </Link>
            </Button>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Package className="w-8 h-8 text-crimson-600" />
                Edit Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Modify product details and settings
              </p>
            </div>
          </div>

          {/* Edit Product Form */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <EditProductForm product={serializedProduct} />
            </div>
            <div>
              <EditProductPreview product={serializedProduct} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
