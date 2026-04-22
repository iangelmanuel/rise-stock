"use client"

import type { Column, ColumnDef, SortDirection } from "@tanstack/react-table"
import { CollectionActiveSwitch } from "@/components/dashboard/stock/collection-active-switch"
import { DropdownCollectionActions } from "@/components/dashboard/stock/dropdown-collection-action"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { Clothes, Collection } from "@prisma/client"
import {
  ChevronDownIcon,
  ChevronUp,
  ChevronUpIcon,
  ChevronsUpDown,
  EyeOff
} from "lucide-react"

export type CollectionWithClothes = Collection & {
  clothes: Pick<Clothes, "id">[]
}

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
  column: Column<CollectionWithClothes, unknown>
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

export const columns: ColumnDef<CollectionWithClothes>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader
        label="Name"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="font-medium">{row.original.name}</span>
      </section>
    )
  },

  {
    id: "clothes",
    accessorFn: (row) => row.clothes.length,
    header: ({ column }) => (
      <SortableHeader
        label="Clothes"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <span className="text-sm">{row.original.clothes.length}</span>
      </section>
    )
  },

  {
    id: "isActive",
    accessorKey: "isActive",
    header: () => (
      <section className="flex items-center justify-center">
        <span>Drop Active</span>
      </section>
    ),
    cell: ({ row }) => (
      <section className="flex items-center justify-center">
        <CollectionActiveSwitch
          id={row.original.id}
          isActive={row.original.isActive}
        />
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
          {new Date(row.original.createdAt).toLocaleDateString("en-US", {
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
        <DropdownCollectionActions collectionData={row.original} />
      </section>
    ),
    enableSorting: false,
    enableHiding: false
  }
]
