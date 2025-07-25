type BadgeVariant = "create" | "delete" | "update" | undefined

export const badgeVariantSwitch = (
  variant: string | undefined
): BadgeVariant => {
  const variants: Record<string, string> = {
    create: "create",
    delete: "delete",
    update: "update"
  }
  return variants[variant as keyof typeof variants] as BadgeVariant
}
