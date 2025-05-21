import Image from "next/image"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { imageValidator } from "@/utils/image-validator"
import type {
  Clothes,
  ClothesImage,
  ClothesVariant,
  Collection
} from "@prisma/client"
import { Ruler, Shirt } from "lucide-react"
import { DeleteClothesButton } from "./delete-clothes-button"
import { EditVariantInfo } from "./edit-variant-info"
import { EditVariantStock } from "./edit-variants-stock"

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

export const ClothesGrid = ({ collection }: Props) => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {collection?.clothes ? (
        collection.clothes.map((item) => (
          <Card
            key={item.id}
            className="group relative"
          >
            <DeleteClothesButton
              item={item}
              publicId={item.clothesImage[0].publicId}
            />

            <CardHeader>
              <div className="mb-3 overflow-hidden">
                <Image
                  src={imageValidator(item.clothesImage[0].secureUrl)}
                  alt={item.design}
                  width={500}
                  height={500}
                  className="h-[300px] w-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <CardTitle className="text-lg font-bold">
                <h2 className="text-2xl font-bold">
                  {item.design} - {item.color}
                </h2>
              </CardTitle>
            </CardHeader>

            {/* Card Content */}
            <ClothesGridCardContent item={item} />

            <CardFooter className="flex flex-col gap-2">
              <EditVariantStock item={item} />
              <EditVariantInfo item={item} />
            </CardFooter>
          </Card>
        ))
      ) : (
        <div className="flex h-48 w-full items-center justify-center border">
          <p className="text-gray-600">No collection available</p>
        </div>
      )}
    </section>
  )
}

type CardContentProps = {
  item: Clothes & {
    variants: ClothesVariant[] | null
  }
}

function ClothesGridCardContent({ item }: CardContentProps) {
  return (
    <CardContent>
      <div className="flex w-full items-center justify-between border-b p-2">
        {item.variants ? (
          item.variants.map((variant) => (
            <div
              key={variant.id}
              className="w-full flex-1 items-center justify-start p-2"
            >
              <div className="mr-2 flex items-center justify-center gap-3">
                <Ruler
                  size={24}
                  className="h-6 w-6"
                />
                <p className="text-sm font-semibold">{variant.size}</p>
              </div>

              <div className="mr-2 flex items-center justify-center gap-3">
                <Shirt
                  size={24}
                  className="h-6 w-6"
                />
                <p className="text-sm font-semibold">{variant.stock}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm font-semibold">No variants available</p>
        )}
      </div>
    </CardContent>
  )
}
