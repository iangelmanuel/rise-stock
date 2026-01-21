import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma-config"

export async function GET(request: Request) {
  try {
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
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
