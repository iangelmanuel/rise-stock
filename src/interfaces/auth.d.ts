import type { registerSchema, userSchema } from "@/schemas/user.schemas"
import type { z } from "zod"

type LoginFormData = z.infer<typeof userSchema>
type RegisterFormData = z.infer<typeof registerSchema>
