import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getClientSession } from "@/lib/get-client-session"
import { prisma } from "@/lib/prisma"
import { updateClientPasswordSchema } from "@/schemas/client.schemas"
import bcrypt from "bcryptjs"

export async function PATCH(request: NextRequest) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = updateClientPasswordSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { oldPassword, password } = result.data

    const client = await prisma.client.findUnique({
      where: { id: session.id },
      select: { id: true, password: true }
    })

    if (!client) {
      return NextResponse.json({ ok: false, message: "Client not found" }, { status: 404 })
    }

    if (!bcrypt.compareSync(oldPassword, client.password)) {
      return NextResponse.json(
        { ok: false, message: "Current password is incorrect" },
        { status: 401 }
      )
    }

    const hashedPassword = bcrypt.hashSync(password, 10)

    await prisma.client.update({
      where: { id: session.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ ok: true, message: "Password updated successfully" })
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
