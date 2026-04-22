"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/format-currency"
import { imageValidator } from "@/utils/image-validator"
import type {
  Clothes,
  ClothesImage,
  ClothesVariant,
  Collection
} from "@prisma/client"
import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2, PackageOpen } from "lucide-react"
import { DeleteClothesButton } from "./delete-clothes-button"
import { EditVariantInfo } from "./edit-variant-info"
import { EditVariantStock } from "./edit-variants-stock"

const LOW_STOCK_THRESHOLD = 5

const gridVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const }
  }
}

type Props = {
  collection:
    | (Collection & {
        clothes:
          | (Clothes & {
              variants: ClothesVariant[] | null
              clothesImage: ClothesImage[]
            })[]
          | null
      })
    | null
}

export function ClothesGrid({ collection }: Props) {
  const clothes = collection?.clothes ?? []
  return (
    <motion.section
      variants={gridVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {clothes.length ? (
        clothes.map((item) => {
          const variants = item.variants ?? []
          const totalStock = variants.reduce(
            (acc, variant) => acc + variant.stock,
            0
          )
          const lowStockCount = variants.filter(
            (variant) => variant.stock <= LOW_STOCK_THRESHOLD
          ).length

          const status =
            totalStock === 0
              ? {
                  label: "Out of stock",
                  className:
                    "border-destructive/40 bg-destructive/10 text-destructive",
                  icon: PackageOpen
                }
              : lowStockCount > 0
                ? {
                    label: "Low stock",
                    className:
                      "border-amber-500/40 bg-amber-500/10 text-amber-600",
                    icon: AlertTriangle
                  }
                : {
                    label: "Healthy stock",
                    className:
                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-600",
                    icon: CheckCircle2
                  }

          const StatusIcon = status.icon

          return (
            <motion.article
              key={item.id}
              variants={cardVariants}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
            >
              <Card className="group relative gap-0 overflow-hidden border bg-card/80 py-0 shadow-sm transition-all duration-200 hover:shadow-lg">
                <DeleteClothesButton
                  item={item}
                  clothesImage={item.clothesImage}
                />

                <div className="relative">
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={imageValidator(
                        item.clothesImage[0]?.secureUrl ?? null
                      )}
                      alt={item.design}
                      width={600}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">
                        Design
                      </p>
                      <h2 className="truncate text-lg font-semibold text-white">
                        {item.design}
                      </h2>
                    </div>

                    <Badge className="bg-white/90 text-slate-900 shadow-sm">
                      {item.color}
                    </Badge>
                  </div>
                </div>

                <CardContent className="space-y-4 px-6 pb-4 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Total stock
                      </p>
                      <p className="text-2xl font-semibold tracking-tight">
                        {totalStock}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(Number(item.price))}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-medium", status.className)}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="text-xs text-muted-foreground"
                    >
                      Variants {variants.length}
                    </Badge>
                  </div>

                  <Separator />

                  {variants.length ? (
                    <div className="grid grid-cols-2 gap-2">
                      {variants.map((variant) => (
                        <StockPill
                          key={variant.id}
                          variant={variant}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No variants available
                    </p>
                  )}
                </CardContent>

                <CardFooter className="grid grid-cols-1 gap-2 border-t px-6 pb-6 pt-4 sm:grid-cols-2">
                  <EditVariantStock item={item} />
                  <EditVariantInfo
                    item={item}
                    collectionName={collection?.name ?? ""}
                    clothesImage={item.clothesImage}
                  />
                </CardFooter>
              </Card>
            </motion.article>
          )
        })
      ) : (
        <div className="col-span-full flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-6 text-center">
          <p className="text-sm font-medium">No clothes in this collection</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Create a new variant to start tracking stock.
          </p>
        </div>
      )}
    </motion.section>
  )
}

function StockPill({ variant }: { variant: ClothesVariant }) {
  const isOut = variant.stock === 0
  const isLow = variant.stock > 0 && variant.stock <= LOW_STOCK_THRESHOLD

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border px-3 py-2 text-xs",
        isOut
          ? "border-destructive/40 bg-destructive/5"
          : isLow
            ? "border-amber-500/40 bg-amber-500/5"
            : "border-border/70 bg-muted/30"
      )}
    >
      <span className="font-semibold uppercase tracking-wide text-muted-foreground">
        {variant.size}
      </span>
      <span
        className={cn(
          "text-sm font-semibold",
          isOut
            ? "text-destructive"
            : isLow
              ? "text-amber-600"
              : "text-foreground"
        )}
      >
        {variant.stock}
      </span>
    </div>
  )
}
