import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen } from "lucide-react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { jsonToStringArray } from "@/lib/utils"
import { ProductStoryForm } from "@/components/admin/products/product-story-form"

export default async function ProductStoryPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  const { productId } = await params

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const serializedProduct = {
    id: product.id,
    name: product.name,
    category: { name: product.category.name },
    storyTitle: product.storyTitle ?? "",
    storyContent: product.storyContent ?? "",
    storyImages: jsonToStringArray(product.storyImages),
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild className="border-0 bg-muted/30">
              <Link href={`/admin/products/${productId}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Product
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BookOpen className="w-7 h-7 text-crimson-600" />
                Product Story
              </h1>
              <p className="text-muted-foreground mt-1">
                Craft the narrative that appears on the product page.
              </p>
            </div>
          </div>

          <ProductStoryForm product={serializedProduct} />
        </div>
      </main>
    </>
  )
}