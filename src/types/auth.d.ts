import type { loginSchema, registerSchema } from "@/schemas/user.schemas"
import type { z } from "zod"

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>
