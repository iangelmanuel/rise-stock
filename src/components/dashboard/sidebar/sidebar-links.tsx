"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import clsx from "clsx"
import {
  BarChart3,
  Layers,
  Receipt,
  Search,
  ShoppingBag,
  Users
} from "lucide-react"

type NavItem = { title: string; url: string; icon: React.ElementType }

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: BarChart3 }]
  },
  {
    label: "Inventory",
    items: [
      { title: "Stocks", url: "/dashboard/stocks", icon: Layers },
      { title: "Sales", url: "/dashboard/sales", icon: Receipt }
    ]
  },
  {
    label: "E-commerce",
    items: [
      { title: "Orders", url: "/dashboard/ecommerce-orders", icon: ShoppingBag },
      { title: "Clients", url: "/dashboard/clients", icon: Users }
    ]
  },
  {
    label: "Other",
    items: [
      { title: "Code Register", url: "/dashboard/code-register", icon: Search }
    ]
  }
]

const allItems = sections.flatMap((s) => s.items)

const activeStyles =
  "bg-primary/10 text-primary rounded-md hover:bg-primary/15 hover:text-primary font-medium"

export function SidebarLinks() {
  const pathname = usePathname()

  const activeUrl = allItems
    .filter((item) => pathname === item.url || pathname.startsWith(item.url + "/"))
    .sort((a, b) => b.url.length - a.url.length)[0]?.url

  return (
    <>
      {sections.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70 font-semibold">
            {section.label}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={clsx(item.url === activeUrl && activeStyles)}
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
