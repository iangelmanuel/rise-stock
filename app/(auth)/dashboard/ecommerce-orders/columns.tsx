"use client"

import type { Column, ColumnDef, SortDirection } from "@tanstack/react-table"
import { ActionsButtons } from "@/components/dashboard/ecommerce-orders/actions-button"
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
import type { DashboardEcommerceOrder } from "@/types/ecommerce-orders"
import { formatCurrency } from "@/utils/format-currency"
import { formatDate } from "@/utils/format-date"
import { getOrderStatusConfig, orderStatusList } from "@/utils/get-order-status-config"
import clsx from "clsx"
import {
  ChevronDownIcon,
  ChevronUp,
  ChevronUpIcon,
  ChevronsUpDown,
  EyeOff,
  Package
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
  column: Column<DashboardEcommerceOrder, unknown>
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

export const columns: ColumnDef<DashboardEcommerceOrder>[] = [
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
    id: "orderId",
    accessorKey: "id",
    header: () => (
      <section className="flex items-center justify-center">
        <span>Order ID</span>
      </section>
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="font-mono text-xs text-muted-foreground">
          #{row.original.id.slice(0, 8).toUpperCase()}
        </span>
      </section>
    )
  },

  {
    id: "client",
    accessorFn: (row) => `${row.client.name} ${row.client.lastname}`,
    header: ({ column }) => (
      <SortableHeader
        label="Client"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex flex-col items-center justify-center">
        <span className="font-medium">
          {row.original.client.name} {row.original.client.lastname}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.client.email}
        </span>
      </section>
    )
  },

  {
    id: "itemsInOrder",
    accessorKey: "itemsInOrder",
    header: ({ column }) => (
      <SortableHeader
        label="Items"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <Badge variant="outline">
          <Package className="h-3 w-3 mr-1" />
          {row.original.itemsInOrder}
        </Badge>
      </section>
    )
  },

  {
    id: "total",
    accessorKey: "total",
    header: ({ column }) => (
      <SortableHeader
        label="Total"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="font-semibold">
          {formatCurrency(row.original.total)}
        </span>
      </section>
    )
  },

  {
    id: "orderStatus",
    accessorKey: "orderStatus",
    header: ({ column }) => (
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
                All
              </button>
            </DropdownMenuItem>
            {orderStatusList.map(({ value, label }) => {
              const { icon: Icon } = getOrderStatusConfig(value)
              return (
                <DropdownMenuItem key={value}>
                  <button
                    onClick={() => column.setFilterValue(value)}
                    className="flex items-center"
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </button>
                </DropdownMenuItem>
              )
            })}
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
    cell: ({ row }) => {
      const config = getOrderStatusConfig(row.original.orderStatus)
      const Icon = config.icon
      return (
        <section className="flex items-center justify-center">
          <Badge className={clsx(config.color, "border font-medium")}>
            <Icon className="h-3 w-3 mr-1" />
            {config.text}
          </Badge>
        </section>
      )
    }
  },

  {
    id: "delivery",
    accessorKey: "delivery",
    header: () => (
      <section className="flex items-center justify-center">
        <span>Delivery</span>
      </section>
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="text-sm">{formatCurrency(row.original.delivery)}</span>
      </section>
    )
  },

  {
    id: "paidAt",
    accessorKey: "paidAt",
    header: ({ column }) => (
      <SortableHeader
        label="Paid At"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          {row.original.paidAt
            ? formatDate(row.original.paidAt, {
                year: "numeric",
                month: "short",
                day: "numeric"
              })
            : "—"}
        </span>
      </section>
    )
  },

  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader
        label="Created"
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
