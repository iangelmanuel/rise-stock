"use client"

import type { Dispatch, SetStateAction } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { DashboardEcommerceOrder } from "@/types/ecommerce-orders"
import { formatCurrency } from "@/utils/format-currency"
import { formatDate } from "@/utils/format-date"
import { getOrderStatusConfig } from "@/utils/get-order-status-config"
import clsx from "clsx"
import {
  BadgePercent,
  Copy,
  CreditCard,
  ExternalLink,
  Mail,
  MapPin,
  Package,
  Phone,
  Shirt,
  Truck,
  User
} from "lucide-react"

type Props = {
  order: DashboardEcommerceOrder
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function ViewOrderAction({ order, isOpen, setIsOpen }: Props) {
  const statusConfig = getOrderStatusConfig(order.orderStatus)
  const StatusIcon = statusConfig.icon

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  const couponDiscountPct =
    order.orderDiscount ? ((1 - order.orderDiscount.discount) * 100).toFixed(0) : null

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent className="sm:max-w-[70%]">
        <ScrollArea className="max-h-[85vh] w-full">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </DialogTitle>
                  <p className="text-muted-foreground mt-1">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <Badge
                  className={clsx(
                    statusConfig.color,
                    "border text-sm font-medium px-3 py-1"
                  )}
                >
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {statusConfig.text}
                </Badge>
              </div>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6 space-y-6">
            {/* Client + Address */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    Customer
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3 text-sm">
                  <p className="font-semibold text-base">
                    {order.client.name} {order.client.lastname}
                  </p>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{order.client.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{order.client.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <p className="text-xs">
                      Client ID:{" "}
                      <span className="font-mono">
                        {order.clientId.toUpperCase()}
                      </span>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() => copyToClipboard(order.clientId)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {order.orderAddress && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      Shipping Address
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-sm space-y-1">
                    <p className="font-semibold">
                      {order.orderAddress.firstName} {order.orderAddress.lastName}
                    </p>
                    <p className="text-muted-foreground">
                      {order.orderAddress.typeOfIdentification}:{" "}
                      {order.orderAddress.identification}
                    </p>
                    <p>{order.orderAddress.address}</p>
                    {order.orderAddress.address2 && (
                      <p>{order.orderAddress.address2}</p>
                    )}
                    <p>
                      {order.orderAddress.city}, {order.orderAddress.department}{" "}
                      {order.orderAddress.postalCode}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{order.orderAddress.phone}</span>
                    </div>
                    {order.orderAddress.additionalData && (
                      <p className="text-muted-foreground italic">
                        {order.orderAddress.additionalData}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Items */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shirt className="h-5 w-5 text-purple-600" />
                  Items ({order.itemsInOrder})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4"
                  >
                    {item.clothes.clothesImage[0] && (
                      <div className="relative overflow-hidden rounded-lg border">
                        <Image
                          src={item.clothes.clothesImage[0].secureUrl}
                          alt={item.clothes.design}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 h-5 w-5 p-0 backdrop-blur-sm"
                          onClick={() =>
                            window.open(
                              item.clothes.clothesImage[0].secureUrl,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="font-semibold">{item.clothes.design}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.clothes.color}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">Size: {item.size}</Badge>
                        <Badge variant="outline">Qty: {item.quantity}</Badge>
                        {item.discount < 1 && (
                          <Badge variant="secondary">
                            -{((1 - item.discount) * 100).toFixed(0)}% off
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.price * item.discount * item.quantity)}
                      </p>
                      {item.discount < 1 && (
                        <p className="text-sm text-muted-foreground line-through">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tracking + Financial */}
            <div className="grid gap-6 lg:grid-cols-2">
              {order.orderTracking ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Truck className="h-5 w-5 text-blue-600" />
                      Tracking
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-muted-foreground">
                        Carrier:
                      </span>
                      <p>{order.orderTracking.company}</p>
                    </div>

                    <div>
                      <span className="font-semibold text-muted-foreground">
                        Tracking code:
                      </span>
                      <div className="flex items-center gap-2">
                        <p className="font-mono">
                          {order.orderTracking.trackingCode}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() =>
                            copyToClipboard(order.orderTracking!.trackingCode)
                          }
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="flex items-center justify-center h-full py-8 text-muted-foreground text-sm">
                    <Truck className="h-4 w-4 mr-2" />
                    No tracking assigned yet
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-emerald-600" />
                    Financial Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>

                  {order.discount < 1 && (
                    <div className="flex justify-between text-emerald-600">
                      <span className="flex items-center gap-1">
                        <BadgePercent className="h-3 w-3" />
                        {order.orderDiscount
                          ? `Coupon (${order.orderDiscount.code} −${couponDiscountPct}%)`
                          : "Discount"}
                      </span>
                      <span>
                        −{formatCurrency(order.subtotal * (1 - order.discount))}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{formatCurrency(order.delivery)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>

                  {order.paidAt && (
                    <p className="text-xs text-muted-foreground pt-2">
                      Paid at:{" "}
                      {formatDate(order.paidAt, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  )}

                  {order.transactionId && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>Txn: {order.transactionId}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => copyToClipboard(order.transactionId!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
