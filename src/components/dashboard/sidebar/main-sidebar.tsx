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
import { ModeToggle } from "../sidebar/mode-toggle"
import { SidebarLinks } from "../sidebar/sidebar-links"
import { MovementsDrawer } from "../user-movements/movements-drawer"
import { UserSidebarMenu } from "./user-sidebar-menu"

export function MainSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-1 border-b py-2 mb-2">
            <Image
              src="https://res.cloudinary.com/dxer3pinh/image/upload/v1747781223/logo_kfdbwv.webp"
              alt="Logo"
              width={30}
              height={30}
              className="rounded-full"
            />
            <SidebarGroupLabel>Rise Manager</SidebarGroupLabel>
          </div>

          <UserSidebarMenu />

          <SidebarGroupContent>
            {/* Links */}
            <SidebarLinks />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 rounded-none border-b">
            Settings
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center justify-between">
                {/* Toggle Theme */}
                <ModeToggle />

                {/* Historial */}
                <MovementsDrawer />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
