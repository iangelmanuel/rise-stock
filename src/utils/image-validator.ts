export const imageValidator = (image: string | null) => {
  if (!image) return "/assets/images/image-not-available.png"
  return image
}
