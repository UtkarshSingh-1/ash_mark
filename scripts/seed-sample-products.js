const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedSampleProducts() {
  try {
    console.log('🌱 Seeding sample products with stories...')

    // Get the categories we just created
    const categories = await prisma.category.findMany()
    console.log('Found categories:', categories.map(c => c.name))

    if (categories.length === 0) {
      console.log('❌ No categories found. Please run seed-categories.js first.')
      return
    }

    const tshirtCategory = categories.find(c => c.slug === 'tshirt')
    const pantCategory = categories.find(c => c.slug === 'pant')
    const shirtCategory = categories.find(c => c.slug === 'shirt')

    const sampleProducts = [
      {
        name: 'Classic Cotton T-Shirt',
        slug: 'classic-cotton-tshirt',
        description: 'A comfortable and stylish cotton t-shirt perfect for everyday wear.',
        price: 29.99,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['BLACK', 'WHITE', 'GRAY'],
        stock: 50,
        categoryId: tshirtCategory.id,
        storyTitle: 'The Perfect Everyday Essential',
        storyContent: `This t-shirt represents our commitment to comfort and quality. Made from 100% organic cotton, each piece is carefully crafted to provide the perfect fit and feel. 

Our journey began when we realized that the best clothing should be both comfortable and sustainable. This t-shirt is the result of months of research and testing to find the perfect blend of softness and durability.

Every stitch tells a story of craftsmanship, and every wear brings you closer to understanding what true comfort means.`,
        storyImages: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
          'https://images.unsplash.com/photo-1576566588028-5647e7ac9054?w=500'
        ]
      },
      {
        name: 'Premium Denim Jeans',
        slug: 'premium-denim-jeans',
        description: 'High-quality denim jeans that combine style with comfort.',
        price: 79.99,
        images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['BLUE', 'BLACK'],
        stock: 30,
        categoryId: pantCategory.id,
        storyTitle: 'Crafted for the Modern Explorer',
        storyContent: `These jeans are more than just clothing - they're a companion for life's adventures. Made from premium denim that ages beautifully with time, each pair tells the story of the journeys you'll take.

The fabric is sourced from sustainable cotton farms, and the manufacturing process uses eco-friendly techniques. We believe that great style shouldn't come at the cost of our planet.

From the boardroom to the weekend getaway, these jeans adapt to your lifestyle while maintaining their character and comfort.`,
        storyImages: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500'
        ]
      },
      {
        name: 'Business Casual Shirt',
        slug: 'business-casual-shirt',
        description: 'A versatile shirt that works for both office and casual settings.',
        price: 59.99,
        images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['WHITE', 'BLUE', 'GRAY'],
        stock: 25,
        categoryId: shirtCategory.id,
        storyTitle: 'Where Professional Meets Personal',
        storyContent: `This shirt bridges the gap between professional excellence and personal style. Designed for the modern professional who values both performance and presentation.

The fabric is carefully selected for its breathability and wrinkle resistance, ensuring you look sharp from morning meetings to evening events. Each button is reinforced for durability, and the collar is designed to maintain its shape throughout the day.

We understand that confidence comes from feeling comfortable in what you wear, and this shirt is designed to give you that confidence in every situation.`,
        storyImages: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500'
        ]
      }
    ]

    for (const product of sampleProducts) {
      // Check if product already exists
      const existingProduct = await prisma.product.findUnique({
        where: { slug: product.slug }
      })

      if (existingProduct) {
        console.log(`✅ Product "${product.name}" already exists`)
      } else {
        const newProduct = await prisma.product.create({
          data: product
        })
        console.log(`✅ Created product: ${newProduct.name} with story`)
      }
    }

    console.log('🎉 Sample products with stories seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedSampleProducts()