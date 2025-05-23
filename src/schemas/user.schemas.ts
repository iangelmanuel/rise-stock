import { z } from "zod"

export const userSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
})

export const registerSchema = userSchema
  .extend({
    name: z
      .string({ required_error: "Name is required" })
      .min(1, "Name is required")
      .min(3, "Name must be more than 3 characters")
      .max(32, "Name must be less than 32 characters"),
    repeatPassword: z
      .string({ required_error: "Repeat password is required" })
      .min(1, "Repeat password is required")
      .min(8, "Repeat password must be more than 8 characters")
      .max(32, "Repeat password must be less than 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Repeat password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      )
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords must match"
  })
