import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersHeader } from "@/components/orders/orders-header"
import { Suspense } from "react"

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string; page?: string }>
}) {
  const params = await searchParams
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <OrdersHeader />
          <Suspense fallback={<OrdersPageSkeleton />}>
            <OrdersList 
              userId={session.user.id}
            searchParams={params}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}

function OrdersPageSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-background p-6 shadow-md animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <div className="h-5 w-32 bg-muted"></div>
              <div className="h-4 w-24 bg-muted"></div>
            </div>
            <div className="h-6 w-20 bg-muted"></div>
          </div>
          <div className="h-20 bg-muted"></div>
        </div>
      ))}
    </div>
  )
}
