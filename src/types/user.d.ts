import type {
  updateUserPasswordSchema,
  updateUserSchema
} from "@/schemas/user.schemas"
import type { z } from "zod"

export type UpdateUser = z.infer<typeof updateUserSchema>
export type UpdateUserPasswordType = z.infer<typeof updateUserPasswordSchema>
