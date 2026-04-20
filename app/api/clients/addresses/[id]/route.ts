import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getClientSession } from "@/lib/get-client-session"
import { prisma } from "@/lib/prisma"
import { updateAddressSchema } from "@/schemas/order.schemas"

type Params = { params: Promise<{ id: string }> }

async function getOwnedAddress(clientId: string, addressId: string) {
  return prisma.clientAddress.findFirst({
    where: { id: addressId, clientId }
  })
}

export async function GET(request: NextRequest, { params }: Params) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const address = await getOwnedAddress(session.id, id)

  if (!address) {
    return NextResponse.json({ ok: false, message: "Address not found" }, { status: 404 })
  }

  return NextResponse.json({ ok: true, data: { address } })
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await getOwnedAddress(session.id, id)
  if (!existing) {
    return NextResponse.json({ ok: false, message: "Address not found" }, { status: 404 })
  }

  try {
    const body = await request.json()
    const result = updateAddressSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { isDefault, ...addressData } = result.data

    if (isDefault) {
      await prisma.clientAddress.updateMany({
        where: { clientId: session.id, isDefault: true },
        data: { isDefault: false }
      })
    }

    const address = await prisma.clientAddress.update({
      where: { id },
      data: { ...addressData, ...(isDefault !== undefined && { isDefault }) }
    })

    return NextResponse.json({ ok: true, data: { address } })
  } catch {
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH /api/clients/addresses/:id  →  set as default address
export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await getOwnedAddress(session.id, id)
  if (!existing) {
    return NextResponse.json({ ok: false, message: "Address not found" }, { status: 404 })
  }

  try {
    await prisma.clientAddress.updateMany({
      where: { clientId: session.id, isDefault: true },
      data: { isDefault: false }
    })

    const address = await prisma.clientAddress.update({
      where: { id },
      data: { isDefault: true }
    })

    return NextResponse.json({ ok: true, data: { address } })
  } catch {
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await getOwnedAddress(session.id, id)
  if (!existing) {
    return NextResponse.json({ ok: false, message: "Address not found" }, { status: 404 })
  }

  try {
    await prisma.clientAddress.delete({ where: { id } })

    // If deleted address was default, promote the most recent remaining one
    if (existing.isDefault) {
      const next = await prisma.clientAddress.findFirst({
        where: { clientId: session.id },
        orderBy: { createdAt: "desc" }
      })
      if (next) {
        await prisma.clientAddress.update({
          where: { id: next.id },
          data: { isDefault: true }
        })
      }
    }

    return NextResponse.json({ ok: true, message: "Address deleted" })
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
