import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/db"
import Link from "next/link"

import { Navbar } from "@/components/layout/navbar"
import { DashboardStats } from "@/components/admin/dashboard-stats"
import { RecentOrders } from "@/components/admin/recent-orders"
import { AddProductSection } from "@/components/admin/add-product-section"

import { Tag, RefreshCcw, Repeat, XCircle } from "lucide-react"

export default async function AdminDashboard() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/")
  }

  /* -------------------- CORE STATS -------------------- */
  const [
    totalOrders,
    totalProducts,
    totalUsers,
    revenue,

    activePromos,
    pendingReturns,
    pendingExchanges,
    cancelledOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID" },
    }),

    prisma.promoCode.count({ where: { isActive: true } }),
    prisma.returnRequest.count({ where: { status: "REQUESTED" } }),
    prisma.exchangeRequest.count({ where: { status: "REQUESTED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
  ])

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>

          {/* Existing Stats */}
          <DashboardStats
            totalOrders={totalOrders}
            totalProducts={totalProducts}
            totalUsers={totalUsers}
            totalRevenue={Number(revenue._sum.total) || 0}
          />

          {/* Orders + Add Product */}
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <RecentOrders />
            <AddProductSection />
          </div>

          {/* 🔥 Management Cards (ENHANCED) */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {/* Promo Codes */}
            <ManagementCard
              title="Promo Codes"
              description="Create, edit and control discount coupons"
              count={activePromos}
              icon={<Tag className="h-5 w-5 text-red-600" />}
              href="/admin/promocodes"
              cta="Manage Promo Codes"
            />

            {/* Returns */}
            <ManagementCard
              title="Returns"
              description="Review and process return requests"
              count={pendingReturns}
              icon={<RefreshCcw className="h-5 w-5 text-red-600" />}
              href="/admin/returns"
              cta="View Returns"
              highlight={pendingReturns > 0}
            />

            {/* Exchanges */}
            <ManagementCard
              title="Exchanges"
              description="Review and process exchange requests"
              count={pendingExchanges}
              icon={<Repeat className="h-5 w-5 text-red-600" />}
              href="/admin/exchanges"
              cta="View Exchanges"
              highlight={pendingExchanges > 0}
            />

            {/* Cancelled Orders */}
            <ManagementCard
              title="Cancelled Orders"
              description="See all cancelled orders"
              count={cancelledOrders}
              icon={<XCircle className="h-5 w-5 text-red-600" />}
              href="/admin/orders?status=CANCELLED"
              cta="View Cancelled"
              countLabel="total"
            />
          </div>
        </div>
      </main>
    </>
  )
}

/* -------------------- COMPONENT -------------------- */

function ManagementCard({
  title,
  description,
  count,
  icon,
  href,
  cta,
  highlight = false,
  countLabel = "pending",
}: {
  title: string
  description: string
  count: number
  icon: React.ReactNode
  href: string
  cta: string
  highlight?: boolean
  countLabel?: string
}) {
  return (
    <div
      className={`rounded-lg border bg-background p-6 flex flex-col justify-between ${
        highlight ? "border-red-500" : ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {icon}
        </div>

        <p className="text-sm text-muted-foreground mb-3">
          {description}
        </p>

        <p className="text-3xl font-bold">
          {count}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {countLabel}
          </span>
        </p>
      </div>

      <Link
        href={href}
        className="mt-6 inline-flex justify-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium"
      >
        {cta}
      </Link>
    </div>
  )
}
