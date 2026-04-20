"use client"

import { useState, useTransition } from "react"
import { toggleClientConfirmed } from "@/actions/clients/toggle-client-confirmed"
import { toggleClientDeleted } from "@/actions/clients/toggle-client-deleted"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import type { DashboardClient } from "@/types/clients"
import {
  BadgeCheck,
  BadgeX,
  Ellipsis,
  Headphones,
  UserCheck,
  UserX
} from "lucide-react"
import { toast } from "sonner"
import { ViewClientAction } from "./view-client-action"

interface Props {
  data: DashboardClient
}

export function ActionsButtons({ data }: Props) {
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isToggleDeleteOpen, setIsToggleDeleteOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const onToggleConfirmed = () => {
    startTransition(async () => {
      const { ok, message } = await toggleClientConfirmed(
        data.id,
        data.isConfirmed
      )
      if (ok) {
        toast.success("Done", { description: message, duration: 3000, position: "top-center" })
      } else {
        toast.error("Error", { description: message, duration: 3000, position: "top-center" })
      }
    })
  }

  const onToggleDeleted = () => {
    setIsToggleDeleteOpen(false)
    startTransition(async () => {
      const { ok, message } = await toggleClientDeleted(
        data.id,
        data.isUserDeleted
      )
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
              View Client
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <button
              onClick={onToggleConfirmed}
              disabled={isPending}
              className="flex items-center"
            >
              {data.isConfirmed ? (
                <>
                  <BadgeX className="mr-2 h-4 w-4" />
                  Unconfirm Account
                </>
              ) : (
                <>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Confirm Account
                </>
              )}
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <button
              onClick={() => setIsToggleDeleteOpen(true)}
              disabled={isPending}
              className={`flex items-center ${data.isUserDeleted ? "" : "text-destructive"}`}
            >
              {data.isUserDeleted ? (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Restore Client
                </>
              ) : (
                <>
                  <UserX className="mr-2 h-4 w-4 text-destructive" />
                  Deactivate Client
                </>
              )}
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewClientAction
        client={data}
        isOpen={isViewOpen}
        setIsOpen={setIsViewOpen}
      />

      <AlertDialog
        open={isToggleDeleteOpen}
        onOpenChange={setIsToggleDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {data.isUserDeleted
                ? "Restore this client?"
                : "Deactivate this client?"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {data.isUserDeleted
                ? `${data.name} ${data.lastname} will be able to log in again.`
                : `${data.name} ${data.lastname} will no longer be able to log in. Their orders are preserved.`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={onToggleDeleted}
              className={
                data.isUserDeleted
                  ? ""
                  : buttonVariants({ variant: "destructive" })
              }
            >
              {data.isUserDeleted ? "Restore" : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
