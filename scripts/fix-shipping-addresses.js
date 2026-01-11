const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixShippingAddresses() {
  try {
    console.log('Checking for orders with missing shipping addresses...')
    
    // Find all orders
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        addressId: true,
        shippingAddressId: true,
        createdAt: true
      }
    })

    // Filter orders where shippingAddressId is null but addressId exists
    const ordersWithMissingShippingAddress = allOrders.filter(order => 
      order.shippingAddressId === null && order.addressId !== null
    )

    console.log(`Found ${ordersWithMissingShippingAddress.length} orders with missing shipping addresses`)

    if (ordersWithMissingShippingAddress.length > 0) {
      console.log('Fixing orders...')
      
      for (const order of ordersWithMissingShippingAddress) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            shippingAddressId: order.addressId
          }
        })
        console.log(`Fixed order ${order.id}`)
      }
      
      console.log('All orders fixed successfully!')
    } else {
      console.log('No orders need fixing.')
    }

    // Check for orders that still have null shipping addresses
    const remainingNullAddresses = allOrders.filter(order => order.shippingAddressId === null)

    if (remainingNullAddresses.length > 0) {
      console.log(`\nWarning: ${remainingNullAddresses.length} orders still have null shipping addresses:`)
      remainingNullAddresses.forEach(order => {
        console.log(`- Order ${order.id} (addressId: ${order.addressId}, created: ${order.createdAt})`)
      })
    } else {
      console.log('\nAll orders now have proper shipping addresses!')
    }

  } catch (error) {
    console.error('Error fixing shipping addresses:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixShippingAddresses()