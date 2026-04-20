import { SignJWT, jwtVerify } from "jose"

const accessSecret = new TextEncoder().encode(
  (process.env.AUTH_SECRET ?? "fallback") + ":client:access"
)
const refreshSecret = new TextEncoder().encode(
  (process.env.AUTH_SECRET ?? "fallback") + ":client:refresh"
)

export type ClientTokenPayload = {
  id: string
  email: string
  name: string
  lastname: string
}

export async function signAccessToken(
  payload: ClientTokenPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .setSubject(payload.id)
    .sign(accessSecret)
}

export async function signRefreshToken(
  payload: ClientTokenPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .setSubject(payload.id)
    .sign(refreshSecret)
}

export async function verifyAccessToken(
  token: string
): Promise<ClientTokenPayload> {
  const { payload } = await jwtVerify(token, accessSecret)
  return payload as unknown as ClientTokenPayload
}

export async function verifyRefreshToken(
  token: string
): Promise<ClientTokenPayload> {
  const { payload } = await jwtVerify(token, refreshSecret)
  return payload as unknown as ClientTokenPayload
}
