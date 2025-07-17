import { useEffect, useState, useTransition } from "react"
import { deleteSale } from "@/actions/sales/delete-sale"
import { getAllClothes } from "@/actions/sales/get-all-clothes"
import { getAllUsers } from "@/actions/sales/get-all-users"
import { SaleForm } from "@/components/dashboard/sales/create-new-sale"
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
import type { GetAllClothes, GetAllUsers, GetSalesWithAll } from "@/types/sales"
import { Archive, Ellipsis, Headphones, Settings } from "lucide-react"
import { toast } from "sonner"
import ViewSaleAction from "./view-sale-action"

interface Props {
  data: GetSalesWithAll
}

export const ActionsButtons = ({ data }: Props) => {
  const [isViewOptionOpen, setIsViewOptionOpen] = useState(false)
  const [isEditOptionOpen, setIsEditOptionOpen] = useState(false)
  const [isDeleteOptionOpen, setIsDeleteOptionOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [users, setUsers] = useState<GetAllUsers[]>([])
  const [clothes, setClothes] = useState<GetAllClothes[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const clothes = await getAllClothes()
      const users = await getAllUsers()

      if (!clothes || !users) {
        toast.error("Failed to fetch data", {
          duration: 3000,
          position: "top-right"
        })
        return
      }

      setUsers(users)
      setClothes(clothes)
    }

    fetchData()
  }, [])

  const onClickToDelete = () => {
    setIsDeleteOptionOpen(false)

    startTransition(async () => {
      const { ok, message } = await deleteSale(data.id)

      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 3000,
          position: "top-center"
        })
      } else {
        toast.error("Something went wrong", {
          description: message,
          duration: 3000,
          position: "top-center"
        })
      }
    })
  }

  const formatDateToString =
    data.saleDate instanceof Date
      ? data.saleDate.toISOString().split("T")[0]
      : data.saleDate

  const dataToEdit = {
    id: data.id,
    clotheId: data.clotheId,
    clotheSize: data.clotheSize,
    client: data.client,
    note: data.note,
    status: data.status,
    state: data.state,
    delivery: data.delivery,
    city: data.city,
    total: data.total,
    saleDate: formatDateToString,
    userId: data.userId
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem>
            <button
              disabled={isPending}
              onClick={() => setIsViewOptionOpen(true)}
              className="flex items-center"
            >
              <Headphones className="mr-2 h-4 w-4" />
              View Sale
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <button
              disabled={isPending}
              onClick={() => setIsEditOptionOpen(true)}
              className="flex items-center"
            >
              <Settings className="mr-2 h-4 w-4" />
              Edit Sale
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <button
              disabled={isPending}
              onClick={() => setIsDeleteOptionOpen(true)}
              className="text-destructive flex items-center"
            >
              <Archive className="text-destructive mr-2 h-4 w-4" />
              Delete Sale
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Action */}
      <ViewSaleAction
        sale={data}
        isViewOptionOpen={isViewOptionOpen}
        setIsViewOptionOpen={setIsViewOptionOpen}
      />

      <Dialog
        open={isEditOptionOpen}
        onOpenChange={setIsEditOptionOpen}
      >
        <DialogContent className="max-w-(--breakpoint-sm)">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
            <DialogDescription>Modify the sale information.</DialogDescription>
          </DialogHeader>

          <SaleForm
            users={users}
            clothes={clothes}
            dataToEdit={dataToEdit}
            startTransition={startTransition}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              form="edit-sale"
            >
              <ButtonContentLoading
                label="Edit Sale"
                isPending={isPending}
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteOptionOpen}
        onOpenChange={setIsDeleteOptionOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to archive the product?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will archive the product and
              remove it from the list of active products.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={onClickToDelete}
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
