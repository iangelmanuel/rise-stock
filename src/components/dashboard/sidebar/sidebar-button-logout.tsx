"use client"

import { logoutUser } from "@/actions/auth/logout.action"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { Button } from "@/components/ui/button"
import { useTransition } from "react"

export const SideBarButtonLogout = () => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await logoutUser()
    })
  }

  return (
    <Button
      disabled={isPending}
      onClick={handleClick}
      className="w-full"
    >
      <ButtonContentLoading
        label="Logout"
        isPending={isPending}
      />
    </Button>
  )
}
