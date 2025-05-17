"use client"

import { useState } from "react"
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
import { X } from "lucide-react"
import { Clothes, ClothesVariant } from "@prisma/client"
import { buttonVariants } from "@/components/ui/button"
import { useTransition } from "react"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { deleteClothesById } from "@/actions/stock/delete-clothes-by-id"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Props {
  item: Clothes & {
    variants: ClothesVariant[] | null
  }
}

export const DeleteClothesButton = ({ item }: Props) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isInputValueIncorrect, setIsInputValueIncorrect] = useState(true)

  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)

    if (e.target.value === item.design) {
      setIsInputValueIncorrect(false)
    } else {
      setIsInputValueIncorrect(true)
    }
  }

  const handleClick = () => {
    const clothesData = {
      id: item.id,
      design: item.design,
      color: item.color
    }

    startTransition(async () => {
      const { ok, message } = await deleteClothesById(clothesData)

      setInputValue("")
      setIsInputValueIncorrect(true)

      if (ok) {
        toast.success("All good!", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      } else {
        toast.error("Somethings fail!", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpenDialog(true)}
        disabled={isPending}
        className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 cursor-pointer rounded-full"
      >
        <X />
      </button>

      <AlertDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want delete{" "}
              <span className="text-foreground">{item.design}</span>?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              item and all its variants from the database. Please make sure if
              you want to delete this item.
            </AlertDialogDescription>

            <div className="grid gap-4">
              <Label htmlFor="confirm-delete">
                Type <span className="text-foreground">{item.design}</span> to
                confirm
              </Label>

              <Input
                id="confirm-delete"
                type="text"
                placeholder={item.design}
                value={inputValue}
                onChange={handleChange}
              />
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending || isInputValueIncorrect}
              onClick={handleClick}
              className={buttonVariants({ variant: "danger" })}
            >
              <ButtonContentLoading
                label="Delete"
                isPending={isPending}
              />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
