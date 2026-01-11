import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import { Navbar } from "@/components/layout/navbar"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { AddProductSection } from "@/components/admin/add-product-section"

export default async function AdminDashboard() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const stats = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: 'PAID' }
    })
  ])

  const [totalOrders, totalProducts, totalUsers, revenue] = stats

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>

          <DashboardStats
            totalOrders={totalOrders}
            totalProducts={totalProducts}
            totalUsers={totalUsers}
            totalRevenue={Number(revenue._sum.total) || 0}
          />

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <RecentOrders />
            <AddProductSection />
          </div>
        </div>
      </main>
    </>
  )
}
