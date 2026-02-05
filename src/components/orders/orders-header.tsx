import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Package, Truck, CheckCircle, RotateCcw, Repeat2, XCircle } from "lucide-react"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import Link from "next/link"

export async function OrdersHeader() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return null
  }

  // Fetch real-time order statistics
  const [totalOrders, processingOrders, shippedOrders, deliveredOrders] = await Promise.all([
    // Total orders count
    prisma.order.count({
      where: { userId: session.user.id }
    }),
    
    // Processing orders (PENDING, CONFIRMED, PROCESSING)
    prisma.order.count({
      where: {
        userId: session.user.id,
        status: {
          in: ['PENDING', 'CONFIRMED', 'PROCESSING']
        }
      }
    }),
    
    // Shipped orders
    prisma.order.count({
      where: {
        userId: session.user.id,
        status: 'SHIPPED'
      }
    }),
    
    // Delivered orders
    prisma.order.count({
      where: {
        userId: session.user.id,
        status: 'DELIVERED'
      }
    })
  ])

  const stats = [
    { 
      icon: ShoppingBag, 
      label: "Total Orders", 
      count: totalOrders, 
      color: "text-blue-600" 
    },
    { 
      icon: Package, 
      label: "Processing", 
      count: processingOrders, 
      color: "text-yellow-600" 
    },
    { 
      icon: Truck, 
      label: "Shipped", 
      count: shippedOrders, 
      color: "text-orange-600" 
    },
    { 
      icon: CheckCircle, 
      label: "Delivered", 
      count: deliveredOrders, 
      color: "text-green-600" 
    },
  ]

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      {/* Order Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.count}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/account/returns" className="block">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Returns</p>
                <p className="text-lg font-semibold">View Requests</p>
              </div>
              <RotateCcw className="h-7 w-7 text-orange-600" />
            </CardContent>
          </Link>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/account/exchanges" className="block">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exchanges</p>
                <p className="text-lg font-semibold">View Requests</p>
              </div>
              <Repeat2 className="h-7 w-7 text-blue-600" />
            </CardContent>
          </Link>
        </Card>
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/account/cancelled" className="block">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cancelled</p>
                <p className="text-lg font-semibold">View Orders</p>
              </div>
              <XCircle className="h-7 w-7 text-red-600" />
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
