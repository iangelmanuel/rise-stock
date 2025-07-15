"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import type { ClothesImage } from "@/types/stock"

interface Props {
  images: ClothesImage[]
  productName: string
}

export const ImageCarousel = ({ images, productName }: Props) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  return (
    <>
      <section
        onClick={() => setIsImageModalOpen(true)}
        className="flex items-center justify-center"
      >
        <Image
          src={images[0].publicId ?? ""}
          alt={`Imagen del producto ${productName}`}
          width={50}
          height={50}
          className="cursor-pointer"
        />
      </section>

      <Dialog
        open={isImageModalOpen}
        onOpenChange={setIsImageModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Imagenes del producto: {productName}</DialogTitle>
          </DialogHeader>

          <Carousel className="mx-auto max-w-xs">
            <CarouselContent>
              {images.length > 1 &&
                images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <Image
                            src={image.publicId ?? ""}
                            alt={`Imagen del producto ${productName}`}
                            width={500}
                            height={500}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  )
}
