import { prisma } from "@/lib/prisma-config"
import { userSchema } from "@/schemas/user.schemas"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

const AuthConfig = {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const schemaValidator = userSchema.safeParse(credentials)

        if (!schemaValidator.success) {
          return null
        }

        const { email, password } = schemaValidator.data

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() }
        })

        if (!user) return null

        if (!bcrypt.compareSync(password, user.password)) return null

        const { password: _, ...rest } = user

        return { ...rest }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }: any) {
      if (user) token.data = user
      return token
    },
    session({ session, token }: any) {
      session.user = token.data
      return session
    }
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth(AuthConfig)
