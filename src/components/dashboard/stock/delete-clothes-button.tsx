"use client"

import { useState } from "react"
import { useTransition } from "react"
import { deleteClothesById } from "@/actions/stock/delete-clothes-by-id"
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
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Clothes, ClothesImage, ClothesVariant } from "@prisma/client"
import { X } from "lucide-react"
import { toast } from "sonner"

type Props = {
  item: Clothes & {
    variants: ClothesVariant[] | null
  }
  clothesImage: ClothesImage[] | null
}

export function DeleteClothesButton({ item, clothesImage }: Props) {
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
      const { ok, message } = await deleteClothesById(clothesData, clothesImage)

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
        aria-label={`Delete ${item.design}`}
        className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-destructive/30 bg-destructive/90 text-destructive-foreground shadow-sm transition hover:bg-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <X className="h-4 w-4" />
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
