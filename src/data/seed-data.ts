type SeedData = {
  sizes: string[]
  clothes: {
    design: string
    color: string
    image: string
  }[]
}

export const data: SeedData = {
  sizes: ["S", "M", "L", "XL"],

  clothes: [
    {
      design: "Tshirt",
      color: "White",
      image:
        "https://res.cloudinary.com/dxer3pinh/image/upload/v1747793971/white-tshirt_h5pfdx.webp"
    },
    {
      design: "Tshirt",
      color: "Black",
      image:
        "https://res.cloudinary.com/dxer3pinh/image/upload/v1747793971/black-tshirt_u89xlf.webp"
    },
    {
      design: "Christ Fashion",
      color: "White",
      image:
        "https://res.cloudinary.com/dxer3pinh/image/upload/v1747793971/christ-fashion-white_shpezf.webp"
    },
    {
      design: "Christ Fashion",
      color: "Black",
      image:
        "https://res.cloudinary.com/dxer3pinh/image/upload/v1747793972/christ-fashion-black_s2b0yc.webp"
    },
    {
      design: "Last Dinner",
      color: "White",
      image:
        "https://res.cloudinary.com/dxer3pinh/image/upload/v1747793973/last-dinner-white_qaf8mt.webp"
    },
    {
      design: "Last Dinner",
      color: "Black",
      image:
        "https://res.cloudinary.com/dxer3pinh/image/upload/v1747793972/last-dinner-black_xuf7d5.webp"
    }
  ]
} as const
