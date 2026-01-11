import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { AdminOrdersHeader } from '@/components/admin/orders/admin-orders-header'
import { AdminOrdersStats } from '@/components/admin/orders/admin-orders-stats'
import { AdminOrdersTable } from '@/components/admin/orders/admin-orders-table'

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  const params = await searchParams
  const normalize = (v: string | string[] | undefined) => Array.isArray(v) ? v[0] : v
  const tableSearchParams = {
    status: normalize(params.status),
    search: normalize(params.search),
    page: normalize(params.page),
    sort: normalize(params.sort),
    dateRange: normalize(params.dateRange),
    paymentStatus: normalize(params.paymentStatus),
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          <AdminOrdersHeader />
          <AdminOrdersStats />
          <AdminOrdersTable searchParams={tableSearchParams} />
        </div>
      </main>
    </>
  )
}
