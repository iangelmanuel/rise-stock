"use client"

import type { TransitionStartFunction } from "react"
import { useTransition } from "react"
import { useState } from "react"
import Image from "next/image"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EditClothesInfoForm } from "@/types/stock"
import type {
  Clothes,
  ClothesImage,
  ClothesVariant,
  Collection
} from "@prisma/client"
import { ChevronDown, Upload } from "lucide-react"
import Dropzone from "react-dropzone"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  item: Clothes & {
    variants: ClothesVariant[] | null
  }
  collectionName: Collection["name"]
  publicId: ClothesImage["publicId"] | null
}

export function EditVariantInfo({ item, collectionName, publicId }: Props) {
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
        <ScrollArea className="max-h-[70vh] w-full">
          <DialogHeader>
            <DialogTitle>Edit {item.design} collection</DialogTitle>

            <DialogDescription>
              Edit the details of {item.design} collection.
            </DialogDescription>

            {/* Form */}
            <EditVariantInfoForm
              item={item}
              startTransition={startTransition}
              collectionName={collectionName}
              publicId={publicId}
            />
          </DialogHeader>
        </ScrollArea>

        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            form="edit-variant-info"
          >
            <ButtonContentLoading
              label="Update Info"
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
  startTransition,
  collectionName,
  publicId
}: {
  item: Props["item"]
  startTransition: TransitionStartFunction
  collectionName: Props["collectionName"]
  publicId: Props["publicId"]
}) {
  const [image, setImage] = useState<File | undefined>(undefined)

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
    if (image) formData.append("image", image)

    const updatedClothesVariants = {
      design,
      color,
      price,
      image: formData
    }

    startTransition(async () => {
      const { ok, message } = await editClothesInfoById(
        item.id,
        collectionName,
        updatedClothesVariants,
        publicId
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
      id="edit-variant-info"
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
          {...register("design")}
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
          {...register("color")}
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
          {...register("price")}
        />

        {errors.price && <ErrorFormMessage message={errors.price.message} />}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="image">Image</Label>

        <Dropzone
          onDrop={(acceptedFiles) => {
            setImage(acceptedFiles ? acceptedFiles[0] : undefined)
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

        {image !== undefined && (
          <div className="mt-2 flex items-center justify-center">
            <Image
              key={image.name}
              src={URL.createObjectURL(image)}
              alt={image.name}
              width={128}
              height={128}
              className="h-32 w-32 rounded-md object-cover"
            />
          </div>
        )}
      </div>
    </form>
  )
}
