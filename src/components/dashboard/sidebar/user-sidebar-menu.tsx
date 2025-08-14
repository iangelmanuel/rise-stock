import Link from "next/link"
import { auth } from "@/auth"
import { UserAvatar } from "@/components/shared/user-avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { SideBarButtonLogout } from "./sidebar-button-logout"

export async function UserSidebarMenu() {
  const session = await auth()
  const user = session!.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer mb-2 hover:bg-muted-foreground/10 rounded-md">
        <section className="flex items-center gap-x-2 rounded-md p-2">
          <UserAvatar
            userName={user.name}
            avatar={user.avatar}
            color="bg-muted-foreground text-white"
            className="size-10"
          />

          <section>
            <h2 className="text-foreground text-start text-sm font-semibold">
              {user.name}
            </h2>
            <p className="text-foreground/70 text-start text-xs">
              View Profile
            </p>
          </section>
        </section>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[250px]">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="w-full">
          <User />

          <Link href="/dashboard/profile">Profile</Link>
        </DropdownMenuItem>

        {/* Logout */}
        <SideBarButtonLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
