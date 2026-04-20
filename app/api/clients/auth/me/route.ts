import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getClientSession } from "@/lib/get-client-session"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await getClientSession(request)

  if (!session) {
    return NextResponse.json(
      { ok: false, message: "No estás autenticado" },
      { status: 401 }
    )
  }

  try {
    const client = await prisma.client.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        phone: true,
        isConfirmed: true,
        createdAt: true,
        updatedAt: true,
        savedAddresses: true
      }
    })

    if (!client || client.isConfirmed === false) {
      return NextResponse.json(
        { ok: false, message: "Usuario no encontrado o no confirmado" },
        { status: 404 }
      )
    }

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
