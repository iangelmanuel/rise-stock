import type { StockVariantsFormData } from "@/interfaces/stock-vatiansts"

export const stockVariantsDefaultValues: StockVariantsFormData = {
  size: "S",
  stock: 0
}

export const stockValidation = {
  size: { required: "This field is required" },
  stock: {
    required: "This field is required",
    min: { value: 0, message: "Stock must be at least 0" }
  },
  max: { value: 100, message: "Stock must be at most 100" }
}
