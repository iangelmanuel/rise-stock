"use client"

import { logoutUser } from "@/actions/user/logout.action"
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
      {/* TODO */}
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  )
}
