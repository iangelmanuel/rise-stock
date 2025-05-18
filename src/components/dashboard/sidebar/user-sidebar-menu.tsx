import { auth } from "@/auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SideBarButtonLogout } from "./sidebar-button-logout"

export const UserSidebarMenu = async () => {
  const session = await auth()
  const userName = session!.user!.name

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <section className="flex items-center gap-x-2 rounded-md p-2">
          <article className="bg-foreground/20 size-10 rounded-full">
            {userName && (
              <span className="text-foreground text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </span>
            )}
          </article>

          <section>
            <h2 className="text-foreground text-start text-sm font-bold">
              {userName}
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
        {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}

        {/* Logout */}
        <SideBarButtonLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
