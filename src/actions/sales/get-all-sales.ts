"use server"

import type { Session } from "next-auth"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma-config"

export async function getAllSales(userId?: Session["user"]["id"]) {
  try {
    const sales = await prisma.sale.findMany({
      where: {
        userId
      },
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
            },
            collection: {
              select: {
                name: true
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
