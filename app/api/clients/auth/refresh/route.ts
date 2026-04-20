import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { signAccessToken, verifyRefreshToken } from "@/lib/client-jwt"
import { prisma } from "@/lib/prisma"
import { clientRefreshSchema } from "@/schemas/client.schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = clientRefreshSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const payload = await verifyRefreshToken(result.data.refreshToken)

    // Verify client still exists and is active
    const client = await prisma.client.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        lastname: true,
        isUserDeleted: true,
        isConfirmed: true
      }
    })

    if (!client || client.isUserDeleted || !client.isConfirmed) {
      return NextResponse.json(
        { ok: false, message: "Invalid refresh token" },
        { status: 401 }
      )
    }

    const accessToken = await signAccessToken({
      id: client.id,
      email: client.email,
      name: client.name,
      lastname: client.lastname
    })

    return NextResponse.json({ ok: true, data: { accessToken } })
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid or expired refresh token" },
      { status: 401 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
