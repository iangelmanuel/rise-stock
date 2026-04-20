"use client"

import type { TransitionStartFunction } from "react"
import { updateManyOrdersStatus } from "@/actions/ecommerce-orders/update-many-orders-status"
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
import { getOrderStatusConfig, orderStatusList } from "@/utils/get-order-status-config"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  ids: string[]
  startTransition: TransitionStartFunction
}

export function UpdateManyOrdersStatusForm({ ids, startTransition }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<{ orderStatus: string }>({ defaultValues: { orderStatus: "PENDING" } })

  const onSubmit = ({ orderStatus }: { orderStatus: string }) => {
    startTransition(async () => {
      const { ok, message } = await updateManyOrdersStatus(ids, orderStatus as never)
      if (ok) {
        toast.success("Done", { description: message, duration: 2000, position: "top-center" })
        reset()
      } else {
        toast.error("Error", { description: message, duration: 2000, position: "top-center" })
      }
    })
  }

  return (
    <form
      id="edit-many-order-status"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 pt-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="orderStatus">New status for {ids.length} order(s)</Label>

        <Controller
          name="orderStatus"
          control={control}
          rules={{ required: "Status is required" }}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger
                id="orderStatus"
                className="w-full"
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Order Status</SelectLabel>
                  {orderStatusList.map(({ value, label }) => {
                    const { icon: Icon } = getOrderStatusConfig(value)
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

        {errors.orderStatus && (
          <ErrorFormMessage message={errors.orderStatus.message} />
        )}
      </div>
    </form>
  )
}
