type BadgeVariant = "default" | "destructive" | "secondary" | undefined

export const badgeVariantSwitch = (variant: string | undefined): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    create: "default",
    delete: "destructive",
    update: "secondary"
  }
  return variants[variant as keyof typeof variants]
}
