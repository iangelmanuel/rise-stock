"use client"

import { useTransition } from "react"
import { logoutUser } from "@/actions/auth/logout.action"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

export const SideBarButtonLogout = () => {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      await logoutUser()
    })
  }

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={handleClick}
      className="w-full"
    >
      <LogOut />
      <ButtonContentLoading
        label="Logout"
        isPending={isPending}
      />
    </DropdownMenuItem>
  )
}
