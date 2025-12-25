import { z } from "zod"

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be more than 8 characters")
  .max(32, "Password must be less than 32 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  )

export const userSchema = z.object({
  id: z.uuid("Invalid user ID format"),
  name: z.string().min(1, "User name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  createdAt: z.date(),
  updatedAt: z.date()
})

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: passwordSchema
})

export const registerSchema = loginSchema
  .extend({
    name: z
      .string()
      .min(1, "Name is required")
      .min(3, "Name must be more than 3 characters")
      .max(32, "Name must be less than 32 characters"),
    repeatPassword: passwordSchema
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"]
  })

export const updateUserSchema = userSchema.pick({
  name: true,
  email: true
})

export const updateUserPasswordSchema = z
  .object({
    oldPassword: passwordSchema,
    password: passwordSchema,
    repeatPassword: passwordSchema
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match",
    path: ["repeatPassword"]
  })
