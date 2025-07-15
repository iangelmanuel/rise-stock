"use client"

import type { ColumnDef, SortDirection } from "@tanstack/react-table"
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
import type { GetSalesWithAll } from "@/types/sales"
import { formatCurrency } from "@/utils/format-currency"
// import { SendEmail } from "@/components/send-email"
// import { orderStatusLang } from "@/consts"
// import type { UserOrderByAdmin } from "@/types"
// import { checkOrderStatusCn, formatCurrency, formatDate } from "@/utils"
import {
  ChevronDownIcon,
  ChevronUp,
  ChevronUpIcon,
  ChevronsUpDown,
  CircleCheck,
  CircleDot,
  CircleX,
  EyeOff,
  Package
} from "lucide-react"

// import { ActionsButtons } from "./ui/actions-buttons"

const SorterIcon = ({ isSorted }: { isSorted: false | SortDirection }) => {
  if (!isSorted) {
    return <ChevronsUpDown className="h-4 w-4" />
  }
  if (isSorted === "asc") {
    return <ChevronUpIcon className="h-4 w-4" />
  }
  if (isSorted === "desc") {
    return <ChevronDownIcon className="h-4 w-4" />
  }
  return null
}

export const columns: ColumnDef<GetSalesWithAll>[] = [
  {
    id: "id",
    accessorKey: "id",
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
    id: "client",
    accessorKey: "client",
    header: ({ column }) => {
      return (
        <section className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-x-1"
              >
                <span>Cliente</span>
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
                  Ocultar
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      )
    },
    cell: ({ row }) => {
      const sales = row.original.client

      return (
        <section className="flex flex-col items-center justify-center">
          <span>{row.original.client}</span>
        </section>
      )
    }
  },

  {
    id: "state",
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <section className="flex flex-col items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-x-1"
              >
                State
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
                  Ocultar
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      )
    },
    cell: ({ row }) => {
      const { state } = row.original
      return (
        <section className="flex flex-col items-center justify-center">
          <span>{state}</span>
        </section>
      )
    }
  },

  {
    id: "city",
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <section className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-x-1"
              >
                City
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
                  Ocultar
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      )
    },
    cell: ({ row }) => {
      const { city } = row.original

      return (
        <section className="flex flex-col items-center justify-center">
          <span>{city}</span>
        </section>
      )
    }
  },

  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <section className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-x-1"
              >
                Status
                <SorterIcon isSorted={column.getIsSorted()} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
              <DropdownMenuItem>
                <button
                  onClick={() => column.setFilterValue(undefined)}
                  className="flex items-center"
                >
                  <Package className="mr-2 h-4 w-4" />
                  Todos
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <button
                  onClick={() => column.setFilterValue("COMPLETED")}
                  className="flex items-center"
                >
                  <CircleCheck className="mr-2 h-4 w-4" />
                  Completed
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <button
                  onClick={() => column.setFilterValue("PENDING")}
                  className="flex items-center"
                >
                  <CircleDot className="mr-2 h-4 w-4" />
                  Pending
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <button
                  onClick={() => {
                    column.setFilterValue(undefined)
                    column.setFilterValue("CANCELLED")
                  }}
                  className="flex items-center"
                >
                  <CircleX className="mr-2 h-4 w-4" />
                  Cancelled
                </button>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem>
                <button
                  onClick={() => column.toggleVisibility(false)}
                  className="flex items-center"
                >
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ocultar
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      )
    },
    cell: ({ row }) => {
      const { status } = row.original

      return (
        <section className="flex items-center justify-center">
          <Badge variant="default">{status}</Badge>
        </section>
      )
    }
  },

  {
    id: "delivery",
    accessorKey: "delivery",
    header: () => {
      return (
        <section className="flex items-center justify-center">
          <span>Total</span>
        </section>
      )
    },
    cell: ({ row }) => {
      const { delivery } = row.original
      const deliveryFormated = formatCurrency(delivery)

      return (
        <section className="flex items-center justify-center">
          <span>{deliveryFormated}</span>
        </section>
      )
    }
  },

  {
    id: "total",
    accessorKey: "total",
    header: () => {
      return (
        <section className="flex items-center justify-center">
          <span>Total</span>
        </section>
      )
    },
    cell: ({ row }) => {
      const { total } = row.original
      const totalFormated = formatCurrency(total)

      return (
        <section className="flex items-center justify-center">
          <span>{totalFormated}</span>
        </section>
      )
    }
  },

  {
    id: "user.name",
    accessorKey: "user.name",
    header: ({ column }) => {
      return (
        <section className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-x-1"
              >
                Saled by
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
                  Ocultar
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      )
    },
    cell: ({ row }) => {
      const { name } = row.original.user

      return (
        <section className="flex flex-col items-center justify-center">
          <span>{name}</span>
        </section>
      )
    }
  },

  {
    accessorKey: "actions",
    header: () => {
      return (
        <section className="flex items-center justify-center">
          <span>Actions</span>
        </section>
      )
    },
    cell: ({ row }) => {
      const order = row.original
      return (
        <section className="flex items-center justify-center">
          {/* <ActionsButtons order={order} /> */}
        </section>
      )
    }
  }
]
