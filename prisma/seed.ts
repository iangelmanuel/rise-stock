import { data } from "../src/data/seed/seed-data"
import { prisma } from "../src/lib/prisma-config"

const { sizes, clothes } = data

async function main() {
  await prisma.userMovement.deleteMany()
  await prisma.user.deleteMany()
  await prisma.collection.deleteMany()
  await prisma.clothesVariant.deleteMany()
  await prisma.clothes.deleteMany()

  const collection = await prisma.collection.create({
    data: {
      name: "Choose Collection"
    }
  })

  clothes.forEach(async ({ design, color, image }) => {
    const product = await prisma.clothes.create({
      data: {
        design,
        color,
        image,
        price: 80000,
        collectionId: collection.id
      }
    })

    sizes.forEach(async (size) => {
      await prisma.clothesVariant.create({
        data: {
          size,
          stock: 0,
          clothesId: product.id
        }
      })
    })
  })

  console.log("✅ Seed executed successfully")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
