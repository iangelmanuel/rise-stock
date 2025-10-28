export const getPriceWithDiscount = (price: number, discount: number) => {
  switch (discount) {
    case 0:
      return price
    case 1:
      return 0
    default:
      return price - price * discount
  }
}

export const formatDiscount = (discount: number) => {
  return `${(discount * 100).toFixed(0)}%`
}
