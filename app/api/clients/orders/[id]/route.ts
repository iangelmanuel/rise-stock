import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getClientSession } from "@/lib/get-client-session"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, { params }: Params) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const order = await prisma.order.findFirst({
      where: { id, clientId: session.id },
      include: {
        orderItems: {
          include: {
            clothes: {
              include: {
                clothesImage: true,
                collection: true
              }
            }
          }
        },
        orderAddress: true,
        orderTracking: true,
        orderDiscount: {
          select: { code: true, description: true, discount: true }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { ok: false, message: "Order not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, data: { order } })
  } catch {
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
