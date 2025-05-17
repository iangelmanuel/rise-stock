export const stockValidation = {
  design: {
    required: "This field is required",
    minLength: {
      value: 3,
      message: "Minimum length is 3 characters"
    },
    maxLength: {
      value: 20,
      message: "Maximum length is 20 characters"
    }
  },
  color: {
    required: "This field is required",
    minLength: {
      value: 3,
      message: "Minimum length is 3 characters"
    },
    maxLength: {
      value: 20,
      message: "Maximum length is 20 characters"
    }
  },
  price: {
    required: "This field is required",
    min: {
      value: 0,
      message: "Minimum value is 0"
    },
    max: {
      value: 1000000,
      message: "Maximum value is 1000000"
    }
  },
  size: { required: "This field is required" },
  stock: {
    required: "This field is required",
    min: { value: 0, message: "Stock must be at least 0" }
  },
  max: { value: 100, message: "Stock must be at most 100" }
}
