"use client"

import type { TransitionStartFunction } from "react"
import { updateOrderStatus } from "@/actions/ecommerce-orders/update-order-status"
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
import type { DashboardEcommerceOrder } from "@/types/ecommerce-orders"
import { getOrderStatusConfig, orderStatusList } from "@/utils/get-order-status-config"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  dataToEdit: { id: string; orderStatus: DashboardEcommerceOrder["orderStatus"] }
  startTransition: TransitionStartFunction
}

export function UpdateOrderStatusForm({ dataToEdit, startTransition }: Props) {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm({ defaultValues: { orderStatus: dataToEdit.orderStatus } })

  const onSubmit = ({ orderStatus }: { orderStatus: DashboardEcommerceOrder["orderStatus"] }) => {
    startTransition(async () => {
      const { ok, message } = await updateOrderStatus(dataToEdit.id, orderStatus)
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
      id="edit-order-status"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 pt-4"
    >
      <div className="grid gap-2">
        <Label htmlFor="orderStatus">Status</Label>

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
