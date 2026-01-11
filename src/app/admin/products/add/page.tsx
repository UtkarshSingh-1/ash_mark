import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { AddProductForm } from "@/components/admin/products/add-product-form"
import { AddProductPreview } from "@/components/admin/products/add-product-preview"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AdminAddProductPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" asChild className="border-0 bg-muted/30">
              <Link href="/admin/products">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Link>
            </Button>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Package className="w-8 h-8 text-crimson-600" />
                Add New Product
              </h1>
              <p className="text-muted-foreground mt-1">
                Create a new product listing for your store
              </p>
            </div>
          </div>

          {/* Add Product Form */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AddProductForm />
            </div>
            <div>
              <AddProductPreview />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
