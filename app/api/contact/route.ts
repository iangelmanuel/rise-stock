import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import z from "zod"

const contactMessacheSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.email("El formato del correo electrónico no es válido"),
  subject: z.string().min(1, "El asunto es obligatorio"),
  message: z.string().min(1, "El mensaje es obligatorio"),
  userId: z.string().optional()
})

export async function POST(request: NextRequest) {
  const { name, email, subject, message, userId } = await request.json()

  try {
    const parsedData = contactMessacheSchema.safeParse({
      name,
      email,
      subject,
      message,
      userId
    })

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.issues[0].message },
        { status: 400 }
      )
    }

    await prisma.contactMessage.create({
      data: {
        name: parsedData.data.name,
        email: parsedData.data.email,
        subject: parsedData.data.subject,
        message: parsedData.data.message,
        userId: parsedData.data.userId || null
      }
    })

    return NextResponse.json(
      { message: "Mensaje enviado exitosamente" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo enviar el mensaje" },
      { status: 500 }
    )
  }
}
