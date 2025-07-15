"use server"

import { prisma } from "@/lib/prisma-config"

export async function getAllSales() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        clothe: {
          include: {
            clothesImage: {
              select: {
                id: true,
                publicId: true,
                secureUrl: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return sales
  } catch (error) {
    return undefined
  }
}
