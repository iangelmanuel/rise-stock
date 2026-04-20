import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../../generated/prisma/client"

// Replace deprecated sslmode aliases (prefer/require/verify-ca) with verify-full,
// which is the actual behavior those modes already used. This silences the
// upcoming pg v9 deprecation warning without changing security semantics.
const rawUrl = process.env.DATABASE_URL ?? ""
const connectionString = rawUrl.replace(
  /sslmode=(prefer|require|verify-ca)/,
  "sslmode=verify-full"
)

const adapter = new PrismaPg({ connectionString })

export const prisma = new PrismaClient({ adapter })
