import type { TransitionStartFunction } from "react"
import { updateManyStatusByIds } from "@/actions/sales/update-many-status-by-ids"
import { ErrorFormMessage } from "@/components/shared/error-form-message"
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
import { status } from "@/constants/status"
import { saleValidation } from "@/form-config/sales"
import type { UpdateSaleStatus } from "@/types/sales"
import { getStatusConfig } from "@/utils/get-status-config"
import type { Sale } from "@prisma/client"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  ids: Sale["id"][]
  startTransition: TransitionStartFunction
}

export function UpdateManyStatusForm({ ids, startTransition }: Props) {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<UpdateSaleStatus>()

  const onSubmit = (formData: UpdateSaleStatus) => {
    startTransition(async () => {
      const { ok, message } = await updateManyStatusByIds(ids, formData.status)
      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 3000,
          position: "top-center"
        })
        reset()
      } else {
        toast.error("Something went wrong", {
          description: message,
          duration: 3000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <form
      id="edit-many-status"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 pt-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>

        <Controller
          name="status"
          control={control}
          rules={saleValidation.status}
          render={({ field: controllerField }) => (
            <Select
              value={controllerField.value}
              onValueChange={controllerField.onChange}
            >
              <SelectTrigger
                id="status"
                className="w-full"
              >
                <SelectValue placeholder="Select the status" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>

                  {status.map(({ value, label }) => {
                    const { icon: Icon } = getStatusConfig(value)
                    return (
                      <SelectItem
                        key={value}
                        value={value}
                      >
                        <Icon className="size-4" />
                        {label}
                      </SelectItem>
                    )
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />

        {errors.status && <ErrorFormMessage message={errors.status?.message} />}
      </div>
    </form>
  )
}
