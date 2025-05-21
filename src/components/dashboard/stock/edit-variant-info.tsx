"use client"

import type { TransitionStartFunction } from "react"
import { useTransition } from "react"
import { useState } from "react"
import { editClothesInfoById } from "@/actions/stock/update-clothes-info-by-id.action"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { ErrorFormMessage } from "@/components/shared/error-form-message"
import { Button } from "@/components/ui/button"
import { Card, CardDescription } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { stockValidation } from "@/form-config/stock"
import type { EditClothesInfoForm } from "@/types/stock"
import type { Clothes, ClothesVariant } from "@prisma/client"
import { ChevronDown, Upload } from "lucide-react"
import Dropzone from "react-dropzone"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  item: Clothes & {
    variants: ClothesVariant[] | null
  }
}

export const EditVariantInfo = ({ item }: Props) => {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger
        className="cursor-pointer"
        asChild
      >
        <Button
          variant="default"
          className="w-full"
        >
          Edit Info
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {item.design} collection</DialogTitle>
          <DialogDescription>
            Edit the details of {item.design} collection.
          </DialogDescription>

          {/* Form */}
          <EditVariantInfoForm
            item={item}
            startTransition={startTransition}
          />
        </DialogHeader>

        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            form="create-clothes-variant"
          >
            <ButtonContentLoading
              label="Update Stock"
              isPending={isPending}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditVariantInfoForm({
  item,
  startTransition
}: {
  item: Props["item"]
  startTransition: TransitionStartFunction
}) {
  const [image, setImage] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<EditClothesInfoForm>({
    defaultValues: {
      design: item.design,
      color: item.color,
      price: item.price
    }
  })

  const onSubmit = ({ design, color, price }: EditClothesInfoForm) => {
    const formData = new FormData()
    image.forEach((file) => {
      formData.append("image", file)
    })

    const updatedClothesVariants = {
      design,
      color,
      price,
      image: formData
    }

    startTransition(async () => {
      const { ok, message } = await editClothesInfoById(
        item.id,
        updatedClothesVariants
      )
      if (ok) {
        toast.success("Stock updated successfully", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      } else {
        toast.error("Error updating stock", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <form
      id="create-clothes-variant"
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 py-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="design">Design name</Label>

        <Input
          type="text"
          id="design"
          placeholder="Ej. Last Dinner"
          className="col-span-3"
          {...register("design", stockValidation.design)}
        />

        {errors.design && <ErrorFormMessage message={errors.design.message} />}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="color">Color</Label>

        <Input
          type="text"
          id="color"
          placeholder="Ej. Black"
          className="col-span-3"
          {...register("color", stockValidation.color)}
        />

        {errors.color && <ErrorFormMessage message={errors.color.message} />}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="price">Price</Label>

        <Input
          type="number"
          id="price"
          placeholder="Ej. 80000"
          className="col-span-3"
          {...register("price", stockValidation.price)}
        />

        {errors.price && <ErrorFormMessage message={errors.price.message} />}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image">Image</Label>

        <Dropzone
          onDrop={(acceptedFiles) => {
            setImage(acceptedFiles ? acceptedFiles : [])
            setValue("image", acceptedFiles[0])
          }}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <Card className="cursor-pointer py-1.5">
              <div {...getRootProps()}>
                <input
                  id="image"
                  {...getInputProps({
                    multiple: false,
                    accept: "image/*",
                    max: 1
                  })}
                />

                {isDragActive ? (
                  <>
                    <ChevronDown
                      size={30}
                      className="text-muted-foreground m-auto"
                    />
                    <CardDescription className="mt-2 text-center">
                      Drop the files here...
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <Upload
                      size={30}
                      className="text-muted-foreground m-auto"
                    />
                    <CardDescription className="mt-2 text-center">
                      Drag and drop your images here
                    </CardDescription>
                  </>
                )}
              </div>
            </Card>
          )}
        </Dropzone>

        {errors.image && (
          <ErrorFormMessage message={errors.image.message as string} />
        )}
      </div>
    </form>
  )
}
