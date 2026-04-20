import type { NextRequest } from "next/server"
import { type ClientTokenPayload, verifyAccessToken } from "./client-jwt"

export async function getClientSession(
  request: NextRequest
): Promise<ClientTokenPayload | null> {
  const auth = request.headers.get("authorization")
  if (!auth?.startsWith("Bearer ")) return null

  try {
    return await verifyAccessToken(auth.slice(7))
  } catch {
    return null
  }
}
