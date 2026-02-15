import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const collectionSP = searchParams.get("collection")

  try {
    if (collectionSP) {
      const collections = collectionSP.split(",").map((c) => c.trim())

      const products = await prisma.clothes.findMany({
        where: {
          collection: {
            name: { in: collections }
          }
        },
        include: {
          clothesImage: true,
          collection: true,
          variants: true,
          Sale: true
        }
      })

      return NextResponse.json(products)
    }

    const products = await prisma.clothes.findMany({
      include: {
        clothesImage: true,
        collection: true,
        variants: true,
        Sale: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
