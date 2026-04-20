import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getClientSession } from "@/lib/get-client-session"
import { prisma } from "@/lib/prisma"
import { updateClientProfileSchema } from "@/schemas/client.schemas"

const CLIENT_SELECT = {
  id: true,
  name: true,
  lastname: true,
  email: true,
  phone: true,
  isConfirmed: true,
  createdAt: true,
  updatedAt: true
} as const

export async function GET(request: NextRequest) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: session.id },
      select: CLIENT_SELECT
    })

    if (!client) {
      return NextResponse.json({ ok: false, message: "Client not found" }, { status: 404 })
    }

    return NextResponse.json({ ok: true, data: { client } })
  } catch {
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = updateClientProfileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const client = await prisma.client.update({
      where: { id: session.id },
      data: result.data,
      select: CLIENT_SELECT
    })

    return NextResponse.json({ ok: true, data: { client } })
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
