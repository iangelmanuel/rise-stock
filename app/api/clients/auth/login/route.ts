import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { signAccessToken, signRefreshToken } from "@/lib/client-jwt"
import { prisma } from "@/lib/prisma"
import { clientLoginSchema } from "@/schemas/client.schemas"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = clientLoginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, password } = result.data

    const client = await prisma.client.findUnique({ where: { email } })

    if (!client || client.isUserDeleted) {
      return NextResponse.json(
        { ok: false, message: "Tu cuenta no está activa o ha sido eliminada" },
        { status: 401 }
      )
    }

    if (!bcrypt.compareSync(password, client.password)) {
      return NextResponse.json(
        { ok: false, message: "Tu correo o contraseña son incorrectos" },
        { status: 401 }
      )
    }

    if (!client.isConfirmed) {
      return NextResponse.json(
        {
          ok: false,
          message: "Tu cuenta no está confirmada. Revisa tu correo electrónico."
        },
        { status: 403 }
      )
    }

    const tokenPayload = {
      id: client.id,
      email: client.email,
      name: client.name,
      lastname: client.lastname
    }

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(tokenPayload),
      signRefreshToken(tokenPayload)
    ])

    const { password: _, ...safeClient } = client

    return NextResponse.json({
      ok: true,
      data: { accessToken, refreshToken, client: safeClient }
    })
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
