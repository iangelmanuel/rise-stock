"use client"

import type { Dispatch, SetStateAction, TransitionStartFunction } from "react"
import { useState, useTransition } from "react"
import { deleteCollectionById } from "@/actions/stock/delete-collection-by-id"
import { updateCollection } from "@/actions/stock/update-collection"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { ErrorFormMessage } from "@/components/shared/error-form-message"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import {
  AlertDialogFooter,
  AlertDialogHeader
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { stockValidation } from "@/form-config/stock"
import type { CreateCollectionForm as UpdateCollectionForm } from "@/types/stock"
import type { Clothes, Collection } from "@prisma/client"
import { Ellipsis, SquarePen, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type CollectionWithClothes = {
  clothes: {
    id: Clothes["id"]
  }[]
} & Collection

type Props = {
  collectionData: CollectionWithClothes
}

export const DropdownCollectionActions = ({ collectionData }: Props) => {
  const [isPending, startTransition] = useTransition()

  const [isEditOptionOpen, setIsEditOptionOpen] = useState(false)
  const [isDeleteOptionOpen, setIsDeleteOptionOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Abrir menu</span>
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="w-20"
        >
          <DropdownMenuGroup>
            {/* Edit Collection */}
            <DropdownMenuItem
              onClick={() => setIsEditOptionOpen(true)}
              className="flex items-center"
            >
              <SquarePen className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>

            {/* Delete Collection */}
            <DropdownMenuItem
              onClick={() => setIsDeleteOptionOpen(true)}
              className="flex items-center"
            >
              <Trash className="h-4 w-4 text-red-500" />
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownCollectionEdit
        collectionData={collectionData}
        isPending={isPending}
        startTransition={startTransition}
        isEditOptionOpen={isEditOptionOpen}
        setIsEditOptionOpen={setIsEditOptionOpen}
      />

      <DropdownCollectionDelete
        collectionData={collectionData}
        isPending={isPending}
        startTransition={startTransition}
        isDeleteOptionOpen={isDeleteOptionOpen}
        setIsDeleteOptionOpen={setIsDeleteOptionOpen}
      />
    </>
  )
}

function DropdownCollectionEdit({
  collectionData,
  isPending,
  startTransition,
  isEditOptionOpen,
  setIsEditOptionOpen
}: {
  collectionData: CollectionWithClothes
  isPending: boolean
  startTransition: TransitionStartFunction
  isEditOptionOpen: boolean
  setIsEditOptionOpen: Dispatch<SetStateAction<boolean>>
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateCollectionForm>()

  const onSubmit = ({ name }: UpdateCollectionForm) => {
    const updatedCollection = {
      oldName: collectionData.name,
      newName: name,
      id: collectionData.id
    }

    startTransition(async () => {
      const { ok, message } = await updateCollection(updatedCollection)

      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
      } else {
        toast.error("Something wrong", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <Dialog
      open={isEditOptionOpen}
      onOpenChange={setIsEditOptionOpen}
    >
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Collection</DialogTitle>
          <DialogDescription>
            This is the form to edit a collection. You can add clothes to this
            collection later.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          id="edit-collection"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 py-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">Collection name</Label>

            <Input
              type="text"
              id="name"
              placeholder="Ej. Summer Collection"
              className="w-full"
              defaultValue={collectionData.name}
              {...register("name", stockValidation.name)}
            />

            {errors.name && <ErrorFormMessage message={errors.name.message} />}
          </div>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            form="edit-collection"
          >
            <ButtonContentLoading
              label="Edit Collection"
              isPending={isPending}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DropdownCollectionDelete({
  collectionData,
  isPending,
  startTransition,
  isDeleteOptionOpen,
  setIsDeleteOptionOpen
}: {
  collectionData: CollectionWithClothes
  isPending: boolean
  startTransition: TransitionStartFunction
  isDeleteOptionOpen: boolean
  setIsDeleteOptionOpen: Dispatch<SetStateAction<boolean>>
}) {
  const [inputValue, setInputValue] = useState("")
  const [isInputValueIncorrect, setIsInputValueIncorrect] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)

    if (e.target.value === collectionData.name) {
      setIsInputValueIncorrect(false)
    } else {
      setIsInputValueIncorrect(true)
    }
  }

  const handleClick = () => {
    const collectionToDelete = {
      collectionId: collectionData.id,
      oldName: collectionData.name,
      clothesIds: collectionData.clothes.map((item) => item.id)
    }

    startTransition(async () => {
      const { ok, message } = await deleteCollectionById(collectionToDelete)

      setInputValue("")
      setIsInputValueIncorrect(true)

      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      } else {
        toast.error("Something wrong", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <AlertDialog
      open={isDeleteOptionOpen}
      onOpenChange={setIsDeleteOptionOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want delete{" "}
            <span className="text-foreground">{collectionData.name}</span>?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the item
            and all its variants from the database. Please make sure if you want
            to delete this item.
          </AlertDialogDescription>

          <div className="grid gap-4">
            <Label htmlFor="confirm-delete">
              Type{" "}
              <span className="text-foreground">{collectionData.name}</span> to
              confirm
            </Label>

            <Input
              id="confirm-delete"
              type="text"
              placeholder={collectionData.name}
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
  )
}
