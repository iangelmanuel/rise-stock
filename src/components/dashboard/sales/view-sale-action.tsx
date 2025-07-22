"use client"

import type { Dispatch, SetStateAction } from "react"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import type { GeneralSale } from "@/types/sales"
import { formatCurrency } from "@/utils/format-currency"
import { formatDate } from "@/utils/format-date"
import { getStatusConfig } from "@/utils/get-status-config"
import clsx from "clsx"
import {
  Copy,
  CreditCard,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Shirt,
  Truck,
  User
} from "lucide-react"

type Props = {
  sale: GeneralSale
  isViewOptionOpen: boolean
  setIsViewOptionOpen: Dispatch<SetStateAction<boolean>>
}

export const ViewSaleAction = ({
  sale,
  isViewOptionOpen,
  setIsViewOptionOpen
}: Props) => {
  const statusConfig = getStatusConfig(sale.status)
  const StatusIcon = statusConfig.icon

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Dialog
      open={isViewOptionOpen}
      onOpenChange={setIsViewOptionOpen}
    >
      <DialogContent className="sm:max-w-[65%]">
        <ScrollArea className="max-h-[80vh] w-full">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <Package className="h-6 w-6" />
                    Sale #{sale.id.toLocaleUpperCase()}
                  </DialogTitle>

                  <p className="text-muted-foreground mt-1">
                    {formatDate(sale.saleDate)}
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

          <div className="p-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    Customer Information
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {sale.client
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{sale.client}</h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {sale.city}, {sale.state}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Call customer</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Send email</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  {sale.note && (
                    <Alert
                      variant="default"
                      className="bg-transparent"
                    >
                      <FileText className="h-4 w-4" />
                      <AlertTitle>Special note:</AlertTitle>
                      <AlertDescription>{sale.note}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-yellow-600" />
                    Salesperson
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-yellow-100 text-yellow-600 font-semibold">
                        {sale.user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-semibold">{sale.user.name}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-muted-foreground">
                          ID: {sale.userId.toLocaleUpperCase()}
                        </p>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          onClick={() => copyToClipboard(sale.userId)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                  Product Details
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2">
                        {sale.clothe.design}
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Color:</span>
                          <p className="font-medium text-muted-foreground">
                            {sale.clothe.color}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold">Size:</span>
                          <p className="font-medium text-muted-foreground">
                            {sale.clotheSize}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold">SKU:</span>
                          <p className="font-medium text-muted-foreground">
                            {sale.clotheId.toLocaleUpperCase()}
                          </p>
                        </div>

                        <div>
                          <span className="font-semibold">Collection:</span>
                          <p className="font-medium text-muted-foreground">
                            {sale.clothe.collection?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Unit price
                      </p>

                      <p className="text-3xl font-bold">
                        {formatCurrency(sale.clothe.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    {sale.clothe.clothesImage.length > 0 && (
                      <div className="relative group">
                        <div className="relative overflow-hidden rounded-xl border-2">
                          <Image
                            src={
                              sale.clothe.clothesImage[0].secureUrl ||
                              "/placeholder.svg"
                            }
                            alt={sale.clothe.design}
                            width={250}
                            height={250}
                            className="rounded-lg object-cover transition-transform group-hover:scale-105"
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 backdrop-blur-sm"
                          onClick={() =>
                            window.open(
                              sale.clothe.clothesImage[0].secureUrl,
                              "_blank",
                              "noopener,noreferrer"
                            )
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Shirt className="h-4 w-4 mr-1" />
                          Product price:
                        </span>

                        <span className="font-semibold">
                          {formatCurrency(sale.clothe.price)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          Shipping cost:
                        </span>

                        <span className="font-semibold">
                          {formatCurrency(sale.delivery)}
                        </span>
                      </div>

                      <Separator />

                      <div className="flex justify-between items-center p-2 rounded-lg">
                        <span className="font-semibold text-lg text-muted-foreground">
                          Total to pay:
                        </span>

                        <span className="font-bold text-2xl">
                          {formatCurrency(sale.total + sale.delivery)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center p-6 rounded-xl border">
                        <StatusIcon className="h-12 w-12 mx-auto mb-3 text-blue-600" />

                        <p className="text-sm text-muted-foreground mb-2">
                          Status of the order
                        </p>

                        <Badge
                          className={clsx(
                            statusConfig.color,
                            "border text-base font-medium px-4"
                          )}
                        >
                          {statusConfig.text}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
