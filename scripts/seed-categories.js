const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...')

    const categories = [
      {
        name: 'T-Shirts',
        slug: 'tshirt',
        description: 'Comfortable and stylish t-shirts for everyday wear',
        image: null
      },
      {
        name: 'Pants',
        slug: 'pant',
        description: 'High-quality pants for all occasions',
        image: null
      },
      {
        name: 'Shirts',
        slug: 'shirt',
        description: 'Professional and casual shirts for every style',
        image: null
      }
    ]

    for (const category of categories) {
      // Check if category already exists
      const existingCategory = await prisma.category.findUnique({
        where: { slug: category.slug }
      })

      if (existingCategory) {
        console.log(`✅ Category "${category.name}" already exists`)
      } else {
        const newCategory = await prisma.category.create({
          data: category
        })
        console.log(`✅ Created category: ${newCategory.name} (${newCategory.slug})`)
      }
    }

    console.log('🎉 Categories seeded successfully!')
  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategories()