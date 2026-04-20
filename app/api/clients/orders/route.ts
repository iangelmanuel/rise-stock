import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { TAX_RATE } from "@/data/tax"
import { getClientSession } from "@/lib/get-client-session"
import { prisma } from "@/lib/prisma"
import { createOrderSchema } from "@/schemas/order.schemas"

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  const page = Math.max(
    1,
    Number(request.nextUrl.searchParams.get("page") ?? "1")
  )

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { clientId: session.id },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          orderItems: {
            include: { clothes: { include: { clothesImage: true } } }
          },
          orderAddress: true,
          orderTracking: true
        }
      }),
      prisma.order.count({ where: { clientId: session.id } })
    ])

    return NextResponse.json({
      ok: true,
      data: {
        orders,
        pagination: {
          page,
          pageSize: PAGE_SIZE,
          total,
          totalPages: Math.ceil(total / PAGE_SIZE)
        }
      }
    })
  } catch {
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await getClientSession(request)
  if (!session) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const result = createOrderSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { ok: false, message: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { items, savedAddressId, address, discountCode, delivery } =
      result.data

    // --- 1. Load products with their variants ---
    const uniqueClothesIds = [...new Set(items.map((i) => i.clothesId))]

    const clothes = await prisma.clothes.findMany({
      where: { id: { in: uniqueClothesIds }, isActive: true },
      include: {
        variants: { where: { size: { in: items.map((i) => i.size) } } }
      }
    })

    if (clothes.length !== uniqueClothesIds.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "Uno o más productos no encontrados o no disponibles"
        },
        { status: 422 }
      )
    }

    // --- 2. Validate stock and build order data ---
    for (const item of items) {
      const clothe = clothes.find((c) => c.id === item.clothesId)!
      const variant = clothe.variants.find((v) => v.size === item.size)

      if (!variant) {
        return NextResponse.json(
          {
            ok: false,
            message: `La talla ${item.size} no está disponible para "${clothe.design}"`
          },
          { status: 422 }
        )
      }

      if (variant.stock < item.quantity) {
        return NextResponse.json(
          {
            ok: false,
            message: `Stock insuficiente para "${clothe.design}" en la talla ${item.size}. Disponible: ${variant.stock}`
          },
          { status: 422 }
        )
      }
    }

    // --- 3. Validate discount code if provided ---
    let coupon = null
    if (discountCode) {
      coupon = await prisma.orderDiscount.findUnique({
        where: { code: discountCode, isActive: true }
      })

      if (!coupon) {
        return NextResponse.json(
          { ok: false, message: "Código de descuento inválido o inactivo" },
          { status: 422 }
        )
      }

      if (coupon.expiresAt < new Date()) {
        return NextResponse.json(
          { ok: false, message: "El código de descuento ha expirado" },
          { status: 422 }
        )
      }
    }

    // --- 4. Validate shipping address ---
    let shippingAddress: {
      firstName: string
      lastName: string
      city: string
      typeOfIdentification: string
      identification: string
      phone: string
      address: string
      address2?: string | null
      postalCode: string
      department: string
      additionalData?: string | null
    } | null = null

    if (savedAddressId) {
      const saved = await prisma.clientAddress.findFirst({
        where: { id: savedAddressId, clientId: session.id }
      })

      if (!saved) {
        return NextResponse.json(
          { ok: false, message: "Dirección guardada no encontrada" },
          { status: 404 }
        )
      }

      shippingAddress = saved
    } else if (address) {
      shippingAddress = address
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { ok: false, message: "Dirección de envío es requerida" },
        { status: 400 }
      )
    }

    // --- 5. Calculate totals ---
    const totals = items.reduce(
      (acc, item) => {
        const clothe = clothes.find((c) => c.id === item.clothesId)!
        const lineSubtotal = clothe.price * item.quantity
        const lineDiscountAmount = lineSubtotal * (1 - clothe.discount)

        acc.subtotal += lineSubtotal
        acc.itemsDiscountAmount += lineDiscountAmount
        return acc
      },
      { subtotal: 0, itemsDiscountAmount: 0 }
    )

    const subtotalAfterItemDiscounts =
      totals.subtotal - totals.itemsDiscountAmount

    const couponDiscountAmount = coupon
      ? subtotalAfterItemDiscounts * (1 - coupon.discount)
      : 0

    const tax = subtotalAfterItemDiscounts * TAX_RATE
    const total =
      subtotalAfterItemDiscounts - couponDiscountAmount + tax + delivery

    const itemsInOrder = items.reduce((acc, i) => acc + i.quantity, 0)

    // --- 6. Create order in a transaction ---
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock for each variant
      for (const item of items) {
        const clothe = clothes.find((c) => c.id === item.clothesId)!
        const variant = clothe.variants.find((v) => v.size === item.size)!

        const updated = await tx.clothesVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        })

        if (updated.stock < 0) {
          throw new Error(
            `Race condition: insufficient stock for "${clothe.design}" size ${item.size}`
          )
        }
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          itemsInOrder,
          subtotal: totals.subtotal,
          tax,
          delivery,
          discount: coupon?.discount ?? 1,
          total,
          clientId: session.id,
          ...(coupon && { orderDiscountId: coupon.id })
        }
      })

      // Create order items
      await tx.orderItem.createMany({
        data: items.map((item) => {
          const clothe = clothes.find((c) => c.id === item.clothesId)!
          return {
            orderId: newOrder.id,
            clothesId: item.clothesId,
            size: item.size,
            quantity: item.quantity,
            price: clothe.price,
            discount: clothe.discount
          }
        })
      })

      // Create order address (snapshot of shipping address at time of order)
      await tx.orderAddress.create({
        data: {
          orderId: newOrder.id,
          firstName: shippingAddress!.firstName,
          lastName: shippingAddress!.lastName,
          city: shippingAddress!.city,
          typeOfIdentification: shippingAddress!.typeOfIdentification,
          identification: shippingAddress!.identification,
          phone: shippingAddress!.phone,
          address: shippingAddress!.address,
          address2: shippingAddress!.address2,
          postalCode: shippingAddress!.postalCode,
          department: shippingAddress!.department,
          additionalData: shippingAddress!.additionalData
        }
      })

      return newOrder
    })

    return NextResponse.json(
      {
        ok: true,
        data: {
          orderId: order.id,
          total: order.total,
          orderStatus: order.orderStatus
        }
      },
      { status: 201 }
    )
  } catch (error) {
    const message =
      error instanceof Error && error.message.startsWith("Race condition")
        ? error.message
        : "Internal server error"

    return NextResponse.json({ ok: false, message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 })
}
