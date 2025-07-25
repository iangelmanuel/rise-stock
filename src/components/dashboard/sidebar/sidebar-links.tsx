"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import clsx from "clsx"
import { Calendar, Home, Inbox, Search } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home
  },
  {
    title: "Stocks",
    url: "/dashboard/stocks",
    icon: Inbox
  },
  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: Calendar
  },
  {
    title: "Code Register",
    url: "/dashboard/code-register",
    icon: Search
  }
]

export function SidebarLinks() {
  const pathname = usePathname()

  const activeItem = items
    .filter(
      (item) => pathname === item.url || pathname.startsWith(item.url + "/")
    )
    .sort((a, b) => b.url.length - a.url.length)[0]?.url

  const styles =
    "bg-secondary text-secondary-foreground rounded-md hover:bg-secondary hover:text-secondary-foreground"
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.title}
          className={clsx(item.url === activeItem && styles)}
        >
          <SidebarMenuButton asChild>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
