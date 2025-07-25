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
  clotheName: string
}

export function ImageCarousel({ images, clotheName }: Props) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  console.log(images)

  return (
    <>
      <section
        onClick={() => setIsImageModalOpen(true)}
        className="flex items-center justify-center"
      >
        <Image
          src={images[0].secureUrl}
          alt={`Imagen del producto ${clotheName}`}
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
            <DialogTitle>Image(s) of clothe(s) {clotheName}</DialogTitle>
          </DialogHeader>

          <Carousel className="mx-auto max-w-xs">
            <CarouselContent>
              {images.map((image) => (
                <CarouselItem key={image.id}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <Image
                          src={image.secureUrl}
                          alt={`Images of clothes: ${clotheName}`}
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
