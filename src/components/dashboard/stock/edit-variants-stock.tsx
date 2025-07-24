"use client"

import type { TransitionStartFunction } from "react"
import { useTransition } from "react"
import { updateClothesVariantStock } from "@/actions/stock/update-clothes-variant-stock.action"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { ErrorFormMessage } from "@/components/shared/error-form-message"
import { Button } from "@/components/ui/button"
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
import { EXISTANT_SIZES } from "@/constants/existant-sizes"
import { stockValidation } from "@/form-config/stock"
import type { EditVariantStockForm } from "@/types/stock"
import type { Clothes, ClothesVariant } from "@prisma/client"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  item: Clothes & {
    variants: ClothesVariant[] | null
  }
}

export const EditVariantStock = ({ item }: Props) => {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger
        className="cursor-pointer"
        asChild
      >
        <Button
          variant="outline"
          className="w-full"
        >
          Edit Stock
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {item.design} collection</DialogTitle>

          <DialogDescription>
            Edit the details of {item.design} collection.
          </DialogDescription>

          {/* Form */}
          <EditVariantStockForm
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

function EditVariantStockForm({
  item,
  startTransition
}: {
  item: Props["item"]
  startTransition: TransitionStartFunction
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditVariantStockForm>()

  const onSubmit = ({ stock }: EditVariantStockForm) => {
    const updatedClothesVariants = {
      item,
      stock: stock.map(({ size, stock }) => ({
        size,
        stock: Number(stock)
      }))
    }

    startTransition(async () => {
      const { ok, message } = await updateClothesVariantStock(
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
        <Label
          htmlFor="sizes"
          className="mb-3"
        >
          Sizes
        </Label>
        {EXISTANT_SIZES.map((size, index) => (
          <div
            key={size}
            className="grid gap-2"
          >
            <Label
              htmlFor={`stock.${index}.stock`}
              className="capitalize"
            >
              {size}
            </Label>

            <Input
              type="hidden"
              value={size}
              {...register(`stock.${index}.size`, stockValidation.size)}
            />

            <Input
              type="number"
              id={`stock.${index}.stock`}
              placeholder="Ej. 5"
              className="col-span-3"
              defaultValue={
                item.variants?.find((item) => item.size === size)?.stock
              }
              {...register(`stock.${index}.stock`, stockValidation.stock)}
            />

            {errors.stock && (
              <ErrorFormMessage message={errors.stock.message} />
            )}
          </div>
        ))}
      </div>
    </form>
  )
}
