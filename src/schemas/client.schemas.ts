import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password must be less than 32 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number, and special character"
  )

export const clientRegisterSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters"),
    lastname: z
      .string()
      .min(2, "Lastname must be at least 2 characters")
      .max(50, "Lastname must be less than 50 characters"),
    email: z.email("Invalid email"),
    phone: z
      .string()
      .min(7, "Phone must be at least 7 characters")
      .max(20, "Phone must be less than 20 characters"),
    password: passwordSchema,
    confirmPassword: passwordSchema
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  })

export const clientLoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required")
})

export const clientRefreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required")
})

export const updateClientProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  lastname: z
    .string()
    .min(2, "Lastname must be at least 2 characters")
    .max(50, "Lastname must be less than 50 characters"),
  phone: z
    .string()
    .min(7, "Phone must be at least 7 characters")
    .max(20, "Phone must be less than 20 characters")
})

export const updateClientPasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    password: passwordSchema,
    confirmPassword: passwordSchema
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"]
  })
  .refine((d) => d.oldPassword !== d.password, {
    message: "New password must be different from current password",
    path: ["password"]
  })
