import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { clientRegisterSchema } from "@/schemas/client.schemas"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = clientRegisterSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, lastname, email, phone, password } = result.data

    const existing = await prisma.client.findUnique({ where: { email } })

    if (existing) {
      return NextResponse.json(
        { ok: false, message: "Este usuario ya se encuentra registrado" },
        { status: 409 }
      )
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    const client = await prisma.client.create({
      data: { name, lastname, email, phone, password: hashedPassword },
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        phone: true,
        createdAt: true
      }
    })

    return NextResponse.json({ ok: true, data: { client } }, { status: 201 })
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
