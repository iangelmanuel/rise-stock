"use client"

import { useOptimistic, useTransition } from "react"
import { toggleCollectionActive } from "@/actions/stock/toggle-collection-active"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

type Props = {
  id: string
  isActive: boolean
}

export function CollectionActiveSwitch({ id, isActive }: Props) {
  const [isPending, startTransition] = useTransition()
  const [optimisticActive, setOptimisticActive] = useOptimistic(isActive)

  const handleChange = (checked: boolean) => {
    startTransition(async () => {
      setOptimisticActive(checked)
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
      checked={optimisticActive}
      onCheckedChange={handleChange}
      disabled={isPending}
      aria-label="Toggle drop active"
    />
  )
}
