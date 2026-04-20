"use client"

import { useTransition } from "react"
import { toggleCollectionActive } from "@/actions/stock/toggle-collection-active"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

type Props = {
  id: string
  isActive: boolean
}

export function CollectionActiveSwitch({ id, isActive }: Props) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (checked: boolean) => {
    startTransition(async () => {
      const { ok, message } = await toggleCollectionActive(id, checked)

      if (ok) {
        toast.success(message, { duration: 2000, position: "top-center" })
      } else {
        toast.error(message, { duration: 2000, position: "top-center" })
      }
    })
  }

  return (
    <Switch
      checked={isActive}
      onCheckedChange={handleChange}
      disabled={isPending}
      aria-label="Toggle drop active"
    />
  )
}
