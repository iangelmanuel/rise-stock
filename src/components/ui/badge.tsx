import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",

        // User movement status variants
        create: "border-transparent bg-green-500 text-white",
        delete: "border-transparent bg-destructive text-white",
        update: "border-transparent bg-blue-500 text-white",

        // Order status variants
        pending: "border-transparent bg-amber-500 dark:bg-amber-600 text-white",
        cooking:
          "border-transparent bg-orange-500 dark:bg-orange-700 text-white",
        ready: "border-transparent bg-blue-500 dark:bg-blue-700 text-white",
        sending:
          "border-transparent bg-purple-500 dark:bg-purple-700 text-white",
        pendingPayment:
          "border-transparent bg-pink-500 dark:bg-pink-700 text-white",
        completed:
          "border-transparent bg-emerald-500 dark:bg-emerald-700 text-white",
        cancelled: "border-transparent bg-red-500 dark:bg-red-700 text-white",
        paused: "border-transparent bg-gray-500 text-white"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
