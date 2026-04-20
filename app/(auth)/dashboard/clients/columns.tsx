"use client"

import type { Column, ColumnDef, SortDirection } from "@tanstack/react-table"
import { ActionsButtons } from "@/components/dashboard/clients/actions-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { DashboardClient } from "@/types/clients"
import { formatDate } from "@/utils/format-date"
import {
  ChevronDownIcon,
  ChevronUp,
  ChevronUpIcon,
  ChevronsUpDown,
  EyeOff
} from "lucide-react"

const SorterIcon = ({ isSorted }: { isSorted: false | SortDirection }) => {
  if (!isSorted) return <ChevronsUpDown className="h-4 w-4" />
  if (isSorted === "asc") return <ChevronUpIcon className="h-4 w-4" />
  return <ChevronDownIcon className="h-4 w-4" />
}

const SortableHeader = ({
  label,
  column
}: {
  label: string
  column: Column<DashboardClient, unknown>
}) => (
  <section className="flex items-center justify-center">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-x-1"
        >
          {label}
          <SorterIcon isSorted={column.getIsSorted()} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem>
          <button
            onClick={() => column.toggleSorting(false)}
            className="flex items-center"
          >
            <ChevronUp className="mr-2 h-4 w-4" />
            Asc
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            onClick={() => column.toggleSorting(true)}
            className="flex items-center"
          >
            <ChevronDownIcon className="mr-2 h-4 w-4" />
            Desc
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            onClick={() => column.toggleVisibility(false)}
            className="flex items-center"
          >
            <EyeOff className="mr-2 h-4 w-4" />
            Hide
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </section>
)

export const columns: ColumnDef<DashboardClient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <section>
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </section>
    ),
    cell: ({ row }) => (
      <section>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </section>
    ),
    enableSorting: false,
    enableHiding: false
  },

  {
    id: "name",
    accessorFn: (row) => `${row.name} ${row.lastname}`,
    header: ({ column }) => (
      <SortableHeader
        label="Name"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex flex-col items-center justify-center">
        <span className="font-medium">
          {row.original.name} {row.original.lastname}
        </span>
      </section>
    )
  },

  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) => (
      <SortableHeader
        label="Email"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="text-sm">{row.original.email}</span>
      </section>
    )
  },

  {
    id: "phone",
    accessorKey: "phone",
    header: () => (
      <section className="flex items-center justify-center">
        <span>Phone</span>
      </section>
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="text-sm">{row.original.phone}</span>
      </section>
    )
  },

  {
    id: "orders",
    accessorFn: (row) => row._count.orders,
    header: ({ column }) => (
      <SortableHeader
        label="Orders"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <Badge variant="outline">{row.original._count.orders}</Badge>
      </section>
    )
  },

  {
    id: "confirmed",
    accessorKey: "isConfirmed",
    header: ({ column }) => (
      <section className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-x-1"
            >
              Confirmed
              <SorterIcon isSorted={column.getIsSorted()} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem>
              <button
                onClick={() => column.setFilterValue(undefined)}
                className="flex items-center"
              >
                All
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => column.setFilterValue(true)}
                className="flex items-center"
              >
                Confirmed
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => column.setFilterValue(false)}
                className="flex items-center"
              >
                Pending
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                onClick={() => column.toggleVisibility(false)}
                className="flex items-center"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Hide
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <Badge variant={row.original.isConfirmed ? "default" : "secondary"}>
          {row.original.isConfirmed ? "Confirmed" : "Pending"}
        </Badge>
      </section>
    )
  },

  {
    id: "status",
    accessorKey: "isUserDeleted",
    header: ({ column }) => (
      <section className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-x-1"
            >
              Account
              <SorterIcon isSorted={column.getIsSorted()} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem>
              <button
                onClick={() => column.setFilterValue(undefined)}
                className="flex items-center"
              >
                All
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => column.setFilterValue(false)}
                className="flex items-center"
              >
                Active
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                onClick={() => column.setFilterValue(true)}
                className="flex items-center"
              >
                Deactivated
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <button
                onClick={() => column.toggleVisibility(false)}
                className="flex items-center"
              >
                <EyeOff className="mr-2 h-4 w-4" />
                Hide
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <Badge variant={row.original.isUserDeleted ? "destructive" : "default"}>
          {row.original.isUserDeleted ? "Deactivated" : "Active"}
        </Badge>
      </section>
    )
  },

  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader
        label="Registered"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.createdAt, {
            year: "numeric",
            month: "short",
            day: "numeric"
          })}
        </span>
      </section>
    )
  },

  {
    id: "actions",
    header: () => (
      <section className="flex items-center justify-center">
        <span>Actions</span>
      </section>
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <ActionsButtons data={row.original} />
      </section>
    )
  }
]
