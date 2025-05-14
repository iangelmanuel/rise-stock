import { z } from "zod"
import { userSchema, registerSchema } from "@/schemas/user.schemas"

type LoginFormData = z.infer<typeof userSchema>
type RegisterFormData = z.infer<typeof registerSchema>
