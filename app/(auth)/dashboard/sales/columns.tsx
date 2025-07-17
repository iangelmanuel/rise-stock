"use client"

import type { ColumnDef, SortDirection } from "@tanstack/react-table"
import { ActionsButtons } from "@/components/dashboard/sales/actions-button"
import { ImageCarousel } from "@/components/dashboard/sales/image-carousel"
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
import { EXISTANT_SIZES } from "@/constants/existant-sizes"
import type { GetSalesWithAll } from "@/types/sales"
import { formatCurrency } from "@/utils/format-currency"
import { getStatusConfig } from "@/utils/get-status-config"
import {
  ChevronDownIcon,
  ChevronUp,
  ChevronUpIcon,
  ChevronsUpDown,
  CircleCheck,
  CircleDot,
  CircleX,
  EyeOff,
  Package,
  Shirt
} from "lucide-react"

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
    id: "image",
    accessorKey: "clothe.clothesImage",
    header: () => {
      return (
        <section className="flex items-center justify-center">
          <span>Image</span>
        </section>
      )
    },
    cell: ({ row }) => {
      const { clothe } = row.original

      return (
        <ImageCarousel
          images={clothe.clothesImage}
          clotheName={`${clothe.design} - ${clothe.color}`}
        />
      )
    }
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
                <span>Client</span>
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
      const { client } = row.original

      return (
        <section className="flex flex-col items-center justify-center">
          <span>{client}</span>
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
                City/Country
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
    id: "clotheSize",
    accessorKey: "clotheSize",
    header: ({ column }) => {
      return (
        <section className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-x-1"
              >
                Size
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

              {EXISTANT_SIZES.map((size) => (
                <DropdownMenuItem key={size}>
                  <button
                    onClick={() => column.setFilterValue(size)}
                    className="flex items-center"
                  >
                    <Shirt className="mr-2 h-4 w-4" />
                    {size}
                  </button>
                </DropdownMenuItem>
              ))}

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
      const { clotheSize } = row.original

      return (
        <section className="flex flex-col items-center justify-center">
          <Badge variant="outline">{clotheSize}</Badge>
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
          <span>Delivery</span>
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

      const variant: Record<string, "create" | "update" | "delete"> = {
        COMPLETED: "create",
        PENDING: "update",
        CANCELLED: "delete"
      }

      const statusConfig = getStatusConfig(status)

      return (
        <section className="flex items-center justify-center">
          <Badge variant={variant[status]}>{statusConfig.text}</Badge>
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
                Saled By
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
      return (
        <section className="flex items-center justify-center">
          <ActionsButtons data={row.original} />
        </section>
      )
    }
  }
]
