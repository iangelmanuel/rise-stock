"use client"

import { useState, useTransition } from "react"
import { deleteOrder } from "@/actions/ecommerce-orders/delete-order"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { DashboardEcommerceOrder } from "@/types/ecommerce-orders"
import {
  Archive,
  ChartPie,
  Ellipsis,
  Headphones
} from "lucide-react"
import { toast } from "sonner"
import { UpdateOrderStatusForm } from "./update-order-status-form"
import { ViewOrderAction } from "./view-order-action"

interface Props {
  data: DashboardEcommerceOrder
}

export function ActionsButtons({ data }: Props) {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditStatusOpen, setIsEditStatusOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onDelete = () => {
    setIsDeleteOpen(false)
    startTransition(async () => {
      const { ok, message } = await deleteOrder(data.id)
      if (ok) {
        toast.success("Done", { description: message, duration: 3000, position: "top-center" })
      } else {
        toast.error("Error", { description: message, duration: 3000, position: "top-center" })
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isPending}
          >
            <span className="sr-only">Open menu</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem>
            <button
              onClick={() => setIsViewOpen(true)}
              className="flex items-center"
            >
              <Headphones className="mr-2 h-4 w-4" />
              View Order
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <button
              onClick={() => setIsEditStatusOpen(true)}
              className="flex items-center"
            >
              <ChartPie className="mr-2 h-4 w-4" />
              Update Status
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <button
              onClick={() => setIsDeleteOpen(true)}
              className="text-destructive flex items-center"
            >
              <Archive className="text-destructive mr-2 h-4 w-4" />
              Delete Order
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewOrderAction
        order={data}
        isOpen={isViewOpen}
        setIsOpen={setIsViewOpen}
      />

      <Dialog
        open={isEditStatusOpen}
        onOpenChange={setIsEditStatusOpen}
      >
        <DialogContent className="max-w-(--breakpoint-sm)">
          <ScrollArea className="max-h-[70vh] w-full">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status of order #{data.id.slice(0, 8).toUpperCase()}.
              </DialogDescription>
            </DialogHeader>

            <UpdateOrderStatusForm
              dataToEdit={{ id: data.id, orderStatus: data.orderStatus }}
              startTransition={startTransition}
            />
          </ScrollArea>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              form="edit-order-status"
            >
              <ButtonContentLoading
                label="Update Status"
                isPending={isPending}
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Order #{data.id.slice(0, 8).toUpperCase()} from{" "}
              {data.client.name} {data.client.lastname} will be permanently
              deleted along with its items and address. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className={buttonVariants({ variant: "destructive" })}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
