import { Card, CardContent } from "@/components/ui/card"
import { ShoppingBag, Package, Truck, CheckCircle } from "lucide-react"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

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
    </div>
  )
}