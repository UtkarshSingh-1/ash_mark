const { PrismaClient } = require('@prisma/client')
const { Client } = require('pg')

// Old PostgreSQL database connection (using pg client)
const oldDbUrl = process.env.OLD_DATABASE_URL
if (!oldDbUrl) {
  console.error('❌ Error: OLD_DATABASE_URL environment variable is required')
  console.error('   Please set OLD_DATABASE_URL to your PostgreSQL connection string')
  process.exit(1)
}

const pgClient = new Client({
  connectionString: oldDbUrl,
})

// New MySQL database connection (using Prisma)
const newPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

// Helper function to convert snake_case to camelCase
function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
}

// Helper function to map PostgreSQL row to Prisma format
function mapRow(row) {
  const mapped = {}
  for (const [key, value] of Object.entries(row)) {
    mapped[toCamelCase(key)] = value
  }
  return mapped
}

async function migrateData() {
  try {
    console.log('🚀 Starting database migration from PostgreSQL to MySQL...\n')

    // Test connections
    console.log('📡 Testing database connections...')
    await pgClient.connect()
    console.log('✅ Connected to old PostgreSQL database')
    await newPrisma.$connect()
    console.log('✅ Connected to new MySQL database\n')

    // 1. Migrate Categories (no dependencies)
    console.log('📦 Migrating Categories...')
    const categoriesResult = await pgClient.query('SELECT * FROM categories ORDER BY created_at')
    const categories = categoriesResult.rows.map(mapRow)
    let categoryCount = 0
    for (const category of categories) {
      try {
        await newPrisma.category.upsert({
          where: { id: category.id },
          update: {
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          },
          create: {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            image: category.image,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
          },
        })
        categoryCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating category ${category.name}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${categoryCount}/${categories.length} categories\n`)

    // 2. Migrate Users (no dependencies)
    console.log('👥 Migrating Users...')
    const usersResult = await pgClient.query('SELECT * FROM users ORDER BY created_at')
    const users = usersResult.rows.map(mapRow)
    let userCount = 0
    for (const user of users) {
      try {
        await newPrisma.user.upsert({
          where: { id: user.id },
          update: {
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            image: user.image,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        })
        userCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating user ${user.email}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${userCount}/${users.length} users\n`)

    // 3. Migrate Products (depends on Categories)
    console.log('🛍️  Migrating Products...')
    const productsResult = await pgClient.query('SELECT * FROM products ORDER BY created_at')
    const products = productsResult.rows.map(row => {
      const mapped = mapRow(row)
      // Handle array fields - PostgreSQL stores arrays, convert to JSON format for MySQL
      // Arrays from PostgreSQL come as arrays, but we need to ensure they're in the right format
      if (mapped.images) {
        if (typeof mapped.images === 'string') {
          try {
            mapped.images = JSON.parse(mapped.images)
          } catch (e) {
            mapped.images = []
          }
        } else if (!Array.isArray(mapped.images)) {
          mapped.images = []
        }
      } else {
        mapped.images = []
      }
      
      if (mapped.sizes) {
        if (typeof mapped.sizes === 'string') {
          try {
            mapped.sizes = JSON.parse(mapped.sizes)
          } catch (e) {
            mapped.sizes = []
          }
        } else if (!Array.isArray(mapped.sizes)) {
          mapped.sizes = []
        }
      } else {
        mapped.sizes = []
      }
      
      if (mapped.colors) {
        if (typeof mapped.colors === 'string') {
          try {
            mapped.colors = JSON.parse(mapped.colors)
          } catch (e) {
            mapped.colors = []
          }
        } else if (!Array.isArray(mapped.colors)) {
          mapped.colors = []
        }
      } else {
        mapped.colors = []
      }
      
      if (mapped.storyImages) {
        if (typeof mapped.storyImages === 'string') {
          try {
            mapped.storyImages = JSON.parse(mapped.storyImages)
          } catch (e) {
            mapped.storyImages = []
          }
        } else if (!Array.isArray(mapped.storyImages)) {
          mapped.storyImages = []
        }
      } else {
        mapped.storyImages = []
      }
      
      return mapped
    })
    let productCount = 0
    for (const product of products) {
      try {
        await newPrisma.product.upsert({
          where: { id: product.id },
          update: {
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            comparePrice: product.comparePrice,
            images: product.images,
            sizes: product.sizes,
            colors: product.colors,
            stock: product.stock,
            featured: product.featured,
            trending: product.trending,
            storyTitle: product.storyTitle,
            storyContent: product.storyContent,
            storyImages: product.storyImages,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          },
          create: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            comparePrice: product.comparePrice,
            images: product.images,
            sizes: product.sizes,
            colors: product.colors,
            stock: product.stock,
            featured: product.featured,
            trending: product.trending,
            storyTitle: product.storyTitle,
            storyContent: product.storyContent,
            storyImages: product.storyImages,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          },
        })
        productCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating product ${product.name}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${productCount}/${products.length} products\n`)

    // 4. Migrate Accounts (depends on Users)
    console.log('🔐 Migrating Accounts...')
    const accountsResult = await pgClient.query('SELECT * FROM accounts ORDER BY id')
    const accounts = accountsResult.rows.map(mapRow)
    let accountCount = 0
    for (const account of accounts) {
      try {
        await newPrisma.account.upsert({
          where: { id: account.id },
          update: {
            userId: account.userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          },
          create: {
            id: account.id,
            userId: account.userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            session_state: account.session_state,
          },
        })
        accountCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating account ${account.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${accountCount}/${accounts.length} accounts\n`)

    // 5. Migrate Sessions (depends on Users)
    console.log('🔑 Migrating Sessions...')
    const sessionsResult = await pgClient.query('SELECT * FROM sessions ORDER BY expires')
    const sessions = sessionsResult.rows.map(mapRow)
    let sessionCount = 0
    for (const session of sessions) {
      try {
        await newPrisma.session.upsert({
          where: { id: session.id },
          update: {
            sessionToken: session.sessionToken,
            userId: session.userId,
            expires: session.expires,
          },
          create: {
            id: session.id,
            sessionToken: session.sessionToken,
            userId: session.userId,
            expires: session.expires,
          },
        })
        sessionCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating session ${session.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${sessionCount}/${sessions.length} sessions\n`)

    // 6. Migrate Addresses (depends on Users)
    console.log('📍 Migrating Addresses...')
    const addressesResult = await pgClient.query('SELECT * FROM addresses')
    const addresses = addressesResult.rows.map(mapRow)
    let addressCount = 0
    for (const address of addresses) {
      try {
        await newPrisma.address.upsert({
          where: { id: address.id },
          update: {
            name: address.name,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
            type: address.type,
            isDefault: address.isDefault,
            userId: address.userId,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
          },
          create: {
            id: address.id,
            name: address.name,
            phone: address.phone,
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            country: address.country,
            type: address.type,
            isDefault: address.isDefault,
            userId: address.userId,
            createdAt: address.createdAt,
            updatedAt: address.updatedAt,
          },
        })
        addressCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating address ${address.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${addressCount}/${addresses.length} addresses\n`)

    // 7. Migrate CartItems (depends on Users and Products)
    console.log('🛒 Migrating Cart Items...')
    const cartItemsResult = await pgClient.query('SELECT * FROM cart_items ORDER BY created_at')
    const cartItems = cartItemsResult.rows.map(mapRow)
    let cartItemCount = 0
    for (const cartItem of cartItems) {
      try {
        await newPrisma.cartItem.upsert({
          where: { id: cartItem.id },
          update: {
            userId: cartItem.userId,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            size: cartItem.size,
            color: cartItem.color,
            createdAt: cartItem.createdAt,
            updatedAt: cartItem.updatedAt,
          },
          create: {
            id: cartItem.id,
            userId: cartItem.userId,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            size: cartItem.size,
            color: cartItem.color,
            createdAt: cartItem.createdAt,
            updatedAt: cartItem.updatedAt,
          },
        })
        cartItemCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating cart item ${cartItem.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${cartItemCount}/${cartItems.length} cart items\n`)

    // 8. Migrate WishlistItems (depends on Users and Products)
    console.log('❤️  Migrating Wishlist Items...')
    const wishlistItemsResult = await pgClient.query('SELECT * FROM wishlist_items ORDER BY created_at')
    const wishlistItems = wishlistItemsResult.rows.map(mapRow)
    let wishlistCount = 0
    for (const wishlistItem of wishlistItems) {
      try {
        await newPrisma.wishlistItem.upsert({
          where: { id: wishlistItem.id },
          update: {
            userId: wishlistItem.userId,
            productId: wishlistItem.productId,
            createdAt: wishlistItem.createdAt,
          },
          create: {
            id: wishlistItem.id,
            userId: wishlistItem.userId,
            productId: wishlistItem.productId,
            createdAt: wishlistItem.createdAt,
          },
        })
        wishlistCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating wishlist item ${wishlistItem.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${wishlistCount}/${wishlistItems.length} wishlist items\n`)

    // 9. Migrate Reviews (depends on Users and Products)
    console.log('⭐ Migrating Reviews...')
    const reviewsResult = await pgClient.query('SELECT * FROM reviews ORDER BY created_at')
    const reviews = reviewsResult.rows.map(mapRow)
    let reviewCount = 0
    for (const review of reviews) {
      try {
        await newPrisma.review.upsert({
          where: { id: review.id },
          update: {
            userId: review.userId,
            productId: review.productId,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
          },
          create: {
            id: review.id,
            userId: review.userId,
            productId: review.productId,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
          },
        })
        reviewCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating review ${review.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${reviewCount}/${reviews.length} reviews\n`)

    // 10. Migrate Orders (depends on Users and Addresses)
    console.log('📋 Migrating Orders...')
    const ordersResult = await pgClient.query('SELECT * FROM orders ORDER BY created_at')
    const orders = ordersResult.rows.map(mapRow)
    let orderCount = 0
    for (const order of orders) {
      try {
        await newPrisma.order.upsert({
          where: { id: order.id },
          update: {
            userId: order.userId,
            status: order.status,
            total: order.total,
            subtotal: order.subtotal,
            tax: order.tax,
            shipping: order.shipping,
            discount: order.discount,
            promoCode: order.promoCode,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            razorpayOrderId: order.razorpayOrderId,
            razorpayPaymentId: order.razorpayPaymentId,
            shippingAddressId: order.shippingAddressId,
            addressId: order.addressId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          },
          create: {
            id: order.id,
            userId: order.userId,
            status: order.status,
            total: order.total,
            subtotal: order.subtotal,
            tax: order.tax,
            shipping: order.shipping,
            discount: order.discount,
            promoCode: order.promoCode,
            paymentStatus: order.paymentStatus,
            paymentMethod: order.paymentMethod,
            razorpayOrderId: order.razorpayOrderId,
            razorpayPaymentId: order.razorpayPaymentId,
            shippingAddressId: order.shippingAddressId,
            addressId: order.addressId,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          },
        })
        orderCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating order ${order.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${orderCount}/${orders.length} orders\n`)

    // 11. Migrate OrderItems (depends on Orders and Products)
    console.log('📦 Migrating Order Items...')
    const orderItemsResult = await pgClient.query('SELECT * FROM order_items ORDER BY created_at')
    const orderItems = orderItemsResult.rows.map(mapRow)
    let orderItemCount = 0
    for (const orderItem of orderItems) {
      try {
        await newPrisma.orderItem.upsert({
          where: { id: orderItem.id },
          update: {
            orderId: orderItem.orderId,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: orderItem.price,
            size: orderItem.size,
            color: orderItem.color,
            createdAt: orderItem.createdAt,
          },
          create: {
            id: orderItem.id,
            orderId: orderItem.orderId,
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: orderItem.price,
            size: orderItem.size,
            color: orderItem.color,
            createdAt: orderItem.createdAt,
          },
        })
        orderItemCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating order item ${orderItem.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${orderItemCount}/${orderItems.length} order items\n`)

    // 12. Migrate PromoCodeUsage (depends on Users and Orders)
    console.log('🎟️  Migrating Promo Code Usages...')
    const promoCodeUsagesResult = await pgClient.query('SELECT * FROM promo_code_usages ORDER BY used_at')
    const promoCodeUsages = promoCodeUsagesResult.rows.map(mapRow)
    let promoCount = 0
    for (const promoCodeUsage of promoCodeUsages) {
      try {
        await newPrisma.promoCodeUsage.upsert({
          where: { id: promoCodeUsage.id },
          update: {
            code: promoCodeUsage.code,
            userId: promoCodeUsage.userId,
            orderId: promoCodeUsage.orderId,
            usedAt: promoCodeUsage.usedAt,
          },
          create: {
            id: promoCodeUsage.id,
            code: promoCodeUsage.code,
            userId: promoCodeUsage.userId,
            orderId: promoCodeUsage.orderId,
            usedAt: promoCodeUsage.usedAt,
          },
        })
        promoCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating promo code usage ${promoCodeUsage.id}:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${promoCount}/${promoCodeUsages.length} promo code usages\n`)

    // 13. Migrate VerificationTokens (no dependencies)
    console.log('🔒 Migrating Verification Tokens...')
    const verificationTokensResult = await pgClient.query('SELECT * FROM verificationtokens ORDER BY expires')
    const verificationTokens = verificationTokensResult.rows.map(mapRow)
    let tokenCount = 0
    for (const token of verificationTokens) {
      try {
        await newPrisma.verificationToken.upsert({
          where: {
            identifier_token: {
              identifier: token.identifier,
              token: token.token,
            },
          },
          update: {
            identifier: token.identifier,
            token: token.token,
            expires: token.expires,
          },
          create: {
            identifier: token.identifier,
            token: token.token,
            expires: token.expires,
          },
        })
        tokenCount++
      } catch (error) {
        console.error(`  ⚠️  Error migrating verification token:`, error.message)
      }
    }
    console.log(`  ✅ Migrated ${tokenCount}/${verificationTokens.length} verification tokens\n`)

    console.log('🎉 Migration completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - Categories: ${categoryCount}/${categories.length}`)
    console.log(`   - Users: ${userCount}/${users.length}`)
    console.log(`   - Products: ${productCount}/${products.length}`)
    console.log(`   - Accounts: ${accountCount}/${accounts.length}`)
    console.log(`   - Sessions: ${sessionCount}/${sessions.length}`)
    console.log(`   - Addresses: ${addressCount}/${addresses.length}`)
    console.log(`   - Cart Items: ${cartItemCount}/${cartItems.length}`)
    console.log(`   - Wishlist Items: ${wishlistCount}/${wishlistItems.length}`)
    console.log(`   - Reviews: ${reviewCount}/${reviews.length}`)
    console.log(`   - Orders: ${orderCount}/${orders.length}`)
    console.log(`   - Order Items: ${orderItemCount}/${orderItems.length}`)
    console.log(`   - Promo Code Usages: ${promoCount}/${promoCodeUsages.length}`)
    console.log(`   - Verification Tokens: ${tokenCount}/${verificationTokens.length}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pgClient.end()
    await newPrisma.$disconnect()
  }
}

migrateData()

