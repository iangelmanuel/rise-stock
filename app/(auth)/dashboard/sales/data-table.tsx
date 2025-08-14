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
import React, { useState, useTransition } from "react"
import { UpdateManyStatusForm } from "@/components/dashboard/sales/update-many-status-form"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
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

  const isDeleteVisible = Object.keys(rowSelection).length > 0

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  })

  const salesId = table.getSelectedRowModel().rows.map((row) => {
    const sale = row.original
    const { id } = sale as { id: string }
    return id
  })

  return (
    <>
      <section className="flex flex-col-reverse items-center justify-center gap-y-2 py-4 sm:flex-row sm:justify-between sm:gap-y-0">
        <Input
          value={(table.getColumn("client")?.getFilterValue() as string) ?? ""}
          placeholder="Filter by client name..."
          onChange={(e) => {
            const value = e.target.value
            table.getColumn("client")?.setFilterValue(value)
          }}
          className="w-full sm:max-w-sm"
        />

        {isDeleteVisible && (
          <>
            <Dialog>
              <DialogTrigger
                asChild
                className="ml-2"
              >
                <Button>Change Status</Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Status of Selected Sales</DialogTitle>
                  <DialogDescription>
                    Make changes to the status of the selected sales here. Click
                    save when you&apos;re done.
                  </DialogDescription>
                </DialogHeader>

                <UpdateManyStatusForm
                  ids={salesId}
                  startTransition={startTransition}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isPending}
                    form="edit-many-status"
                  >
                    <ButtonContentLoading
                      label="Edit All Status"
                      isPending={isPending}
                    />
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
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
              .filter((column) => column.getCanHide())
              .filter((column) => column.id !== "actions")
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sales not found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col items-center justify-between py-4 sm:flex-row">
        <div className="flex items-center justify-between">
          <section className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </section>
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
                  <SelectLabel>Ordenes por páginas</SelectLabel>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </section>

          <section>
            <span className="text-muted-foreground text-center text-sm sm:text-start">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
          </section>

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
