import { Clothes, ClothesVariant, Collection } from "@prisma/client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { imageValidator } from "@/utils/image-validator"
import Image from "next/image"
import { Ruler, Shirt } from "lucide-react"
import { EditStockVariant } from "./edit-stock-variants"

interface Props {
  collection:
    | (Collection & {
        clothes:
          | (Clothes & {
              variants: ClothesVariant[] | null
            })[]
          | null
      })
    | null
}

export const ClothesGrid = ({ collection }: Props) => {
  return (
    <>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {collection?.clothes ? (
          collection.clothes.map((item) => (
            <Card
              key={item.id}
              className="group"
            >
              <CardHeader>
                <div className="overflow-hidden mb-3">
                  <Image
                    src={imageValidator(item.image)}
                    alt={item.design}
                    width={500}
                    height={500}
                    className="w-80 h-[300px] object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <CardTitle className="text-lg font-bold">
                  <h2 className="text-2xl font-bold">
                    {item.design} - {item.color}
                  </h2>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between w-full p-2 border-b">
                  {item.variants ? (
                    item.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex-1 items-center justify-start w-full p-2"
                      >
                        <div className="flex gap-3 items-center justify-center mr-2">
                          <Ruler
                            size={24}
                            className="w-6 h-6"
                          />
                          <p className="text-sm font-semibold">
                            {variant.size}
                          </p>
                        </div>

                        <div className="flex gap-3 items-center justify-center mr-2">
                          <Shirt
                            size={24}
                            className="w-6 h-6"
                          />
                          <p className="text-sm font-semibold">
                            {variant.stock}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-semibold">
                      No variants available
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-2">
                <EditStockVariant item={item} />
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex items-center justify-center w-full h-48 border">
            <p className="text-gray-600">No collection available</p>
          </div>
        )}
      </section>
    </>
  )
}
