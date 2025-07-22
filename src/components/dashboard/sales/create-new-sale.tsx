"use client"

import type { TransitionStartFunction } from "react"
import { useState } from "react"
import { useTransition } from "react"
import { createSale } from "@/actions/sales/create-sale"
import { editSale } from "@/actions/sales/edit-sale"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { departamentsWithCities } from "@/data/departament-city"
import { saleValidation, salesFormData } from "@/form-config/sales"
import type {
  CreateNewSaleForm,
  GetAllClothes,
  GetAllUsers
} from "@/types/sales"
import type { Sale } from "@prisma/client"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  users: GetAllUsers[]
  clothes: GetAllClothes[]
}

export const CreateNewSale = ({ users, clothes }: Props) => {
  const [isPending, startTransition] = useTransition()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Sale</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create a new Sale</DialogTitle>
          <DialogDescription>
            This is the form to create a new sale. You can add clothes to this
            sale later.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <SaleForm
          users={users}
          clothes={clothes}
          startTransition={startTransition}
        />

        <DialogFooter>
          <Button
            type="submit"
            disabled={isPending}
            form="create-sale"
          >
            <ButtonContentLoading
              label="Create Sale"
              isPending={isPending}
            />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function SaleForm({
  users,
  clothes,
  dataToEdit,
  startTransition
}: {
  users: GetAllUsers[]
  clothes: GetAllClothes[]
  dataToEdit?: (CreateNewSaleForm & { id: Sale["id"] }) | undefined
  startTransition: TransitionStartFunction
}) {
  const [cities, setCities] = useState<string[]>([])

  const { id, ...restOfDataToEdit } = dataToEdit || {}

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
    reset
  } = useForm<CreateNewSaleForm>({
    defaultValues: { ...restOfDataToEdit }
  })

  const onStateChange = (state: string) => {
    const getCitiesByState = departamentsWithCities.find(
      (item) => item.department === state
    )
    setCities(getCitiesByState ? getCitiesByState.cities : [])
  }

  const onSubmit = async (formData: CreateNewSaleForm) => {
    const { delivery, total, saleDate, ...restOfData } = formData

    const dataFormatted = {
      ...restOfData,
      delivery: Number(delivery) || 0,
      total: Number(total) || 0,
      saleDate: new Date(saleDate)
    }

    startTransition(async () => {
      const { ok, message } = dataToEdit
        ? await editSale(dataFormatted, id)
        : await createSale(dataFormatted)
      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
        setCities([])
        setValue("clotheId", "")
        setValue("clotheSize", "")
        setValue("state", "")
        setValue("userId", "")
      } else {
        toast.error("Something went wrong", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <form
      id={dataToEdit ? "edit-sale" : "create-sale"}
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4"
    >
      {salesFormData.map((field) => (
        <div
          key={field.id}
          className="grid gap-2"
        >
          <Label htmlFor={field.name}>{field.label}</Label>

          {field.type === "select" ? (
            <Controller
              name={field.name}
              control={control}
              rules={saleValidation[field.name as keyof typeof saleValidation]}
              render={({ field: controllerField }) => (
                <Select
                  disabled={
                    field.id === 8 &&
                    cities.length === 0 &&
                    getValues("state") === ""
                  }
                  value={controllerField.value}
                  onValueChange={(value) => {
                    controllerField.onChange(value)
                    field.id === 6 ? onStateChange(value) : null
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{field.label}</SelectLabel>

                      {field.id === 8
                        ? cities.map((city) => (
                            <SelectItem
                              key={city}
                              value={city}
                            >
                              {city}
                            </SelectItem>
                          ))
                        : field.id === 1
                          ? clothes?.map((clothe) => (
                              <SelectItem
                                key={clothe.id}
                                value={clothe.id}
                              >
                                {clothe.design} - {clothe.color}
                              </SelectItem>
                            ))
                          : field.id === 11
                            ? users?.map((user) => (
                                <SelectItem
                                  key={user.id}
                                  value={user.id}
                                >
                                  {user.name}
                                </SelectItem>
                              ))
                            : field.options.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          ) : (
            <Input
              type={field.type}
              id={field.name}
              placeholder={field.placeholder}
              className="w-full"
              {...register(
                field.name,
                saleValidation[field.name as keyof typeof saleValidation]
              )}
            />
          )}
          {errors[field.name] && (
            <ErrorFormMessage message={errors[field.name]!.message} />
          )}
        </div>
      ))}
    </form>
  )
}
