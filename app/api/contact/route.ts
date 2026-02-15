import { type NextRequest, NextResponse } from "next/server"
import { ContactEmailTemplate } from "@/email/ContactEmailTemplate"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import z from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

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
        { message: parsedData.error.issues[0].message },
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

    await resend.emails.send({
      from: "Rise Clothes <contacto@risecol.com>",
      to: ["contacto@risecol.com"],
      subject: "¡Recibiste un nuevo mensaje!",
      react: ContactEmailTemplate({
        name: parsedData.data.name,
        email: parsedData.data.email,
        subject: parsedData.data.subject,
        message: parsedData.data.message
      })
    })

    return NextResponse.json(
      { message: "Mensaje enviado exitosamente" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "No se pudo enviar el mensaje" },
      { status: 500 }
    )
  }
}
