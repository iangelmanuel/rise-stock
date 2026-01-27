import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import z from "zod"

const newsLetterSchema = z.object({
  email: z.email("El formato del correo electrónico no es válido")
})

export async function POST(request: NextRequest) {
  const { email } = await request.json()

  try {
    if (!email) {
      return NextResponse.json(
        { error: "El correo electrónico es obligatorio" },
        { status: 400 }
      )
    }

    const parsedData = newsLetterSchema.safeParse({ email })

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.issues[0].message },
        { status: 400 }
      )
    }

    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email: parsedData.data.email }
    })

    if (existingSubscriber) {
      return NextResponse.json(
        { error: "Este correo electrónico ya está suscrito" },
        { status: 400 }
      )
    }

    await prisma.newsletterSubscriber.create({
      data: { email: parsedData.data.email }
    })

    return NextResponse.json(
      { message: "Te has suscrito exitosamente" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo suscribir al boletín" },
      { status: 500 }
    )
  }
}
