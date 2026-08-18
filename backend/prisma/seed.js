import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding product images...')

  // Correct path for folder structure
  const uploadsPath = path.join(__dirname, '..', 'src', 'uploads', 'products')
  
  if (!fs.existsSync(uploadsPath)) {
    console.log('Uploads folder not found at:', uploadsPath)
    console.log(' Make sure the folder exists and contains images')
    return
  }

  const files = fs.readdirSync(uploadsPath)
  const images = files.filter(f => f.includes('-original.webp'))

  console.log(`Found ${images.length} product images`)

  if (images.length === 0) {
    console.log(' No original images found in uploads folder')
    console.log(' Looking for files ending with: -original.webp')
    return
  }

  let created = 0
  let skipped = 0
  let productNotFound = 0

  for (const file of images) {
    // Extract product ID from filename
    const productId = file.replace('-original.webp', '')
    const imageUrl = `/uploads/products/${file}`
    
    // Check if product exists in database
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      console.log(` Product ${productId} not found in database - skipping`)
      productNotFound++
      continue
    }

    // Check if image already exists for this product
    const existing = await prisma.productImage.findFirst({
      where: { 
        productId: productId,
        url: imageUrl
      }
    })

    if (existing) {
      console.log(`⏭ Image already exists for product: ${product.name}`)
      skipped++
      continue
    }

    // Create the ProductImage record
    await prisma.productImage.create({
      data: {
        productId: productId,
        url: imageUrl,
        altText: product.name || 'Product image',
        isPrimary: true,
        sortOrder: 0
      }
    })

    console.log(` Added image for: ${product.name}`)
    created++
  }

  console.log('\n Summary:')
  console.log(`   Created: ${created}`)
  console.log(`   ⏭ Skipped (already exist): ${skipped}`)
  console.log(`   Product not found: ${productNotFound}`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })