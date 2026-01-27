import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import z from "zod"

const contactMessacheSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  lastName: z.string().min(1, "El apellido es obligatorio"),
  email: z.email("El formato del correo electrónico no es válido"),
  phone: z
    .string()
    .min(10, "El teléfono es obligatorio")
    .max(12, "El teléfono es demasiado largo"),
  subject: z.string().min(1, "El asunto es obligatorio"),
  message: z.string().min(1, "El mensaje es obligatorio"),
  isUser: z.boolean().optional()
})

export async function POST(request: NextRequest) {
  const { name, lastName, email, phone, subject, message, isUser } =
    await request.json()

  try {
    const parsedData = contactMessacheSchema.safeParse({
      name,
      lastName,
      email,
      phone,
      subject,
      message,
      isUser
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
        lastName: parsedData.data.lastName,
        email: parsedData.data.email,
        phone: parsedData.data.phone,
        subject: parsedData.data.subject,
        message: parsedData.data.message,
        isUser: parsedData.data.isUser
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
