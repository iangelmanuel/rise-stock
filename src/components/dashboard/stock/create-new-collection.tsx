"use client"

import type { TransitionStartFunction } from "react"
import { useTransition } from "react"
import { createCollection } from "@/actions/stock/create-collection"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { ErrorFormMessage } from "@/components/shared/error-form-message"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { stockValidation } from "@/form-config/stock"
import type { CreateCollectionForm } from "@/types/stock"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

export const CreateNewCollection = () => {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="w-full sm:w-auto mt-3 sm:mt-0"
        >
          Create Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create a new Collection</DialogTitle>
          <DialogDescription>
            This is the form to create a new collection. You can add clothes to
            this collection later.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <CreateNewCollectionForm startTransition={startTransition} />

        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            form="create-new-collection"
          >
            <ButtonContentLoading
              label="Create Collection"
              isPending={isPending}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CreateNewCollectionForm({
  startTransition
}: {
  startTransition: TransitionStartFunction
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateCollectionForm>()

  const onSubmit = async ({ name }: CreateCollectionForm) => {
    startTransition(async () => {
      const { ok, message } = await createCollection(name)
      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
      } else {
        toast.error("Somethings wrong", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <form
      id="create-new-collection"
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
          {...register("name", stockValidation.name)}
        />

        {errors.name && <ErrorFormMessage message={errors.name.message} />}
      </div>
    </form>
  )
}
