import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"
import { ModeToggle } from "../sidebar/mode-toggle"
import { MovementsDrawer } from "../user-movements/movements-drawer"
import { SidebarLinks } from "../sidebar/sidebar-links"
import { UserSidebarMenu } from "./user-sidebar-menu"
import Image from "next/image"

export function MainSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-1 border-b py-2">
            <Image
              src="/assets/images/logo.webp"
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
