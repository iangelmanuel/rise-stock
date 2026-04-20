"use client"

import type { Dispatch, SetStateAction } from "react"
import { UserAvatar } from "@/components/shared/user-avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { DashboardClient } from "@/types/clients"
import { formatCurrency } from "@/utils/format-currency"
import { formatDate } from "@/utils/format-date"
import {
  BadgeCheck,
  Mail,
  Package,
  Phone,
  ShoppingBag,
  User,
  UserX
} from "lucide-react"

type Props = {
  client: DashboardClient
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function ViewClientAction({ client, isOpen, setIsOpen }: Props) {
  const fullName = `${client.name} ${client.lastname}`

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent className="sm:max-w-[60%]">
        <ScrollArea className="max-h-[80vh] w-full">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    <User className="h-6 w-6" />
                    {fullName}
                  </DialogTitle>
                  <p className="text-muted-foreground mt-1">
                    Registered {formatDate(client.createdAt)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Badge variant={client.isConfirmed ? "default" : "secondary"}>
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    {client.isConfirmed ? "Confirmed" : "Pending"}
                  </Badge>

                  {client.isUserDeleted && (
                    <Badge variant="destructive">
                      <UserX className="h-3 w-3 mr-1" />
                      Deactivated
                    </Badge>
                  )}
                </div>
              </div>
            </DialogHeader>
          </div>

          <div className="px-6 pb-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-blue-600" />
                    Personal Info
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      userName={fullName}
                      color="bg-blue-100 text-blue-600"
                      className="size-14"
                    />

                    <div>
                      <p className="font-semibold text-lg">{fullName}</p>
                      <p className="text-xs text-muted-foreground">
                        ID: {client.id.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{client.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5 text-emerald-600" />
                    Order Summary
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-center p-6 rounded-xl border">
                    <Package className="h-12 w-12 mx-auto mb-3 text-emerald-600" />
                    <p className="text-4xl font-bold">{client._count.orders}</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      Total orders placed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BadgeCheck className="h-5 w-5 text-purple-600" />
                  Account Details
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Status
                    </span>
                    <p className="mt-1">
                      {client.isUserDeleted ? "Deactivated" : "Active"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Email verified
                    </span>
                    <p className="mt-1">
                      {client.isConfirmed ? "Yes" : "No"}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Registered
                    </span>
                    <p className="mt-1">
                      {formatDate(client.createdAt, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold text-muted-foreground">
                      Last updated
                    </span>
                    <p className="mt-1">
                      {formatDate(client.updatedAt, {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </p>
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
