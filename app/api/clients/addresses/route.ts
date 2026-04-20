import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getClientSession } from "@/lib/get-client-session"
import { prisma } from "@/lib/prisma"
import { createAddressSchema } from "@/schemas/order.schemas"

export async function GET(request: NextRequest) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const addresses = await prisma.clientAddress.findMany({
      where: { clientId: session.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }]
    })

    return NextResponse.json({ ok: true, data: { addresses } })
  } catch {
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = createAddressSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { isDefault, ...addressData } = result.data

    // If new address is default, unset all existing defaults first
    if (isDefault) {
      await prisma.clientAddress.updateMany({
        where: { clientId: session.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    // If this is the first address, make it default automatically
    const addressCount = await prisma.clientAddress.count({
      where: { clientId: session.id }
    })

    const address = await prisma.clientAddress.create({
      data: {
        ...addressData,
        isDefault: isDefault || addressCount === 0,
        clientId: session.id
      }
    })

    return NextResponse.json({ ok: true, data: { address } }, { status: 201 })
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
