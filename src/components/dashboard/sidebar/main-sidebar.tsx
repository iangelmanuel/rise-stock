import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"
import { ModeToggle } from "../sidebar/mode-toggle"
import { HistorialDrawer } from "../historial/historial-drawer"
import { SideBarButtonLogout } from "../sidebar/sidebar-button-logout"
import { SidebarLinks } from "../sidebar/sidebar-links"

export function MainSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Links */}
            <SidebarLinks />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 border-b rounded-none">
            Settings
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="flex justify-between items-center">
                {/* Toggle Theme */}
                <ModeToggle />

                {/* Historial */}
                <HistorialDrawer />
              </SidebarMenuItem>

              <SidebarMenuItem className="mt-2">
                {/* Logout */}
                <SideBarButtonLogout />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}
