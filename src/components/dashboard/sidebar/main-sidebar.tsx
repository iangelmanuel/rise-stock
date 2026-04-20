import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Settings2 } from "lucide-react"
import { ModeToggle } from "../sidebar/mode-toggle"
import { SidebarLinks } from "../sidebar/sidebar-links"
import { MovementsDrawer } from "../user-movements/movements-drawer"
import { UserSidebarMenu } from "./user-sidebar-menu"

export function MainSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        {/* Header + user */}
        <SidebarGroup>
          <div className="flex items-center gap-2 border-b pb-3 mb-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <Image
                src="https://res.cloudinary.com/dxer3pinh/image/upload/v1747781223/logo_kfdbwv.webp"
                alt="Logo"
                width={22}
                height={22}
                className="rounded-md"
              />
            </div>
            <div>
              <SidebarGroupLabel className="p-0 text-sm font-semibold text-foreground leading-none">
                Rise Manager
              </SidebarGroupLabel>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">
                Admin Dashboard
              </p>
            </div>
          </div>

          <UserSidebarMenu />
        </SidebarGroup>

        {/* Navigation sections */}
        <SidebarLinks />
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 rounded-none border-b flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
            <Settings2 className="size-3" />
            Settings
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center justify-between">
                <ModeToggle />
                <MovementsDrawer />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
