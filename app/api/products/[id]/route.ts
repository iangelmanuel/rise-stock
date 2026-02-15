import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "../../../../src/lib/prisma"

type Params = {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = await params

  try {
    const product = await prisma.clothes.findUnique({
      where: { id },
      include: {
        clothesImage: true,
        collection: true,
        variants: true,
        Sale: true
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { message: `Failed to fetch products with id: ${id}` },
      { status: 500 }
    )
  }
}
