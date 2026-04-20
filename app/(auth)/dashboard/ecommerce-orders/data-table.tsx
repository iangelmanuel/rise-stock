"use client"

import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState
} from "@tanstack/react-table"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { motion } from "framer-motion"
import { useState, useTransition } from "react"
import { UpdateManyOrdersStatusForm } from "@/components/dashboard/ecommerce-orders/update-many-orders-status-form"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react"

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isPending, startTransition] = useTransition()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection }
  })

  const isSelectionVisible = Object.keys(rowSelection).length > 0

  const selectedIds = table.getSelectedRowModel().rows.map((row) => {
    const order = row.original as { id: string }
    return order.id
  })

  return (
    <>
      <section className="flex flex-col-reverse items-center justify-center gap-y-2 py-4 sm:flex-row sm:justify-between sm:gap-y-0">
        <Input
          value={(table.getColumn("client")?.getFilterValue() as string) ?? ""}
          placeholder="Filter by client name..."
          onChange={(e) =>
            table.getColumn("client")?.setFilterValue(e.target.value)
          }
          className="w-full sm:max-w-sm"
        />

        {isSelectionVisible && (
          <Dialog>
            <DialogTrigger
              asChild
              className="ml-2"
            >
              <Button>Change Status</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Status of Selected Orders</DialogTitle>
                <DialogDescription>
                  Apply a new status to all {selectedIds.length} selected
                  order(s).
                </DialogDescription>
              </DialogHeader>

              <UpdateManyOrdersStatusForm
                ids={selectedIds}
                startTransition={startTransition}
              />

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isPending}
                  form="edit-many-order-status"
                >
                  <ButtonContentLoading
                    label="Update All"
                    isPending={isPending}
                  />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto flex items-center gap-x-1"
            >
              <Settings2 size={16} />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide() && c.id !== "actions")
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, i) => (
                <motion.tr
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.13,
                    delay: Math.min(i, 20) * 0.025,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="border-b transition-colors hover:bg-primary/5 data-[state=selected]:bg-primary/10"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No e-commerce orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col items-center justify-between py-4 sm:flex-row">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="mt-10 flex items-center justify-end gap-x-10 sm:mt-0">
          <section className="flex flex-col items-center gap-x-2 sm:flex-row">
            <span className="text-muted-foreground text-center text-sm sm:text-start">
              Rows per page:
            </span>
            <Select onValueChange={(value) => table.setPageSize(Number(value))}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent align="center">
                <SelectGroup>
                  <SelectLabel>Rows per page</SelectLabel>
                  {["10", "20", "30", "50", "100"].map((v) => (
                    <SelectItem
                      key={v}
                      value={v}
                    >
                      {v}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </section>

          <span className="text-muted-foreground text-sm">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>

          <section className="flex gap-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight size={16} />
            </Button>
          </section>
        </div>
      </section>
    </>
  )
}
