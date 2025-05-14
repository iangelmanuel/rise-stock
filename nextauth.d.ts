import { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      avatar: string
    } & DefaultSession["user"]
  }
}
