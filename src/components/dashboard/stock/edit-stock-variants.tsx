"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Controller, useForm } from "react-hook-form"
import { Input } from "../../ui/input"
import type { StockVariantsFormData } from "@/interfaces/stock"
import { Clothes } from "@prisma/client"
import { stockValidation } from "@/form-config/stock-variants"
import { EXISTANT_SIZES } from "@/constants/existant-sizes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useState, useTransition } from "react"
import { updateClothesVariantStock } from "@/actions/clothes/update-clothes-variant-stock.action"
import { Button } from "../../ui/button"
import { toast } from "sonner"
import { ErrorFormMessage } from "../../shared/error-form-message"

interface Props {
  item: Clothes
}

export const EditStockVariant = ({ item }: Props) => {
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<StockVariantsFormData>()

  const onSubmit = (data: StockVariantsFormData) => {
    startTransition(async () => {
      const { ok, message } = await updateClothesVariantStock({
        id: item.id,
        size: data.size,
        stock: Number(data.stock)
      })

      if (ok) {
        toast.success("Stock updated successfully", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <div className="grid gap-2">
              <label htmlFor="sizes">Sizes</label>
              <Controller
                name="size"
                control={control}
                rules={stockValidation.size}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="sizes"
                      className="w-full cursor-pointer"
                    >
                      <SelectValue placeholder="Sizes" />
                    </SelectTrigger>

                    <SelectContent>
                      {EXISTANT_SIZES.map((size) => (
                        <SelectItem
                          key={size}
                          value={size}
                        >
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.size && (
                <ErrorFormMessage message={errors.size.message} />
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="stock">Stock</label>
              <Input
                type="number"
                id="stock"
                placeholder="Enter stock"
                {...register("stock", stockValidation.stock)}
              />
              {errors.stock && (
                <ErrorFormMessage message={errors.stock.message} />
              )}
            </div>

            <div className="flex items-center justify-end">
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
