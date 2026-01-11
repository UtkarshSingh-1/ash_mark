import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import { ProductsTable } from "@/components/admin/products-table"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AdminProductsPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <Button asChild className="bg-crimson-600 hover:bg-crimson-700">
              <Link href="/admin/products/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          <ProductsTable />
        </div>
      </main>
    </>
  )
}
