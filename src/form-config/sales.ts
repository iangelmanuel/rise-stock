import { EXISTANT_SIZES } from "@/constants/existant-sizes"
import { departamentsWithCities } from "@/data/departament-city"

export const salesFormData = [
  {
    id: 1,
    name: "clotheId",
    label: "Clothes",
    type: "select",
    placeholder: "Select a clothe",
    options: []
  },
  {
    id: 2,
    name: "clotheSize",
    label: "Clothe Size",
    type: "select",
    placeholder: "Select a size",
    options: EXISTANT_SIZES.map((size) => ({
      value: size,
      label: size
    }))
  },
  {
    id: 3,
    name: "client",
    label: "Client Name",
    type: "text",
    placeholder: "Ej. Betún Ramos"
  },
  {
    id: 4,
    name: "note",
    label: "Note",
    type: "text",
    placeholder: "Ej. This is a note for the sale"
  },
  {
    id: 5,
    name: "status",
    label: "Status",
    type: "select",
    placeholder: "Select a status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "COOKING", label: "Cooking" },
      { value: "READY", label: "Ready" },
      { value: "SENDING", label: "Sending" },
      { value: "PENDING_PAYMENT", label: "Pending Payment" },
      { value: "COMPLETED", label: "Completed" },
      { value: "CANCELLED", label: "Cancelled" },
      { value: "PAUSED", label: "Paused" }
    ]
  },
  {
    id: 6,
    name: "state",
    label: "Departament",
    type: "select",
    placeholder: "Select a departament",
    options: departamentsWithCities.map(({ department }) => ({
      value: department,
      label: department
    }))
  },
  {
    id: 7,
    name: "delivery",
    label: "Delivery Cost",
    type: "number",
    placeholder: "Ej. 80,000"
  },
  {
    id: 8,
    name: "city",
    label: "City",
    type: "select",
    placeholder: "Select a city",
    options: []
  },
  {
    id: 9,
    name: "total",
    label: "Total Amount",
    type: "number",
    placeholder: "Ej. 100,000"
  },
  {
    id: 10,
    name: "saleDate",
    label: "Select a date",
    type: "date",
    placeholder: ""
  },
  {
    id: 11,
    name: "userId",
    label: "User",
    type: "select",
    placeholder: "Select a user",
    options: []
  }
] as const

export const saleValidation = {
  clothesId: {
    required: "Clothes ID is required"
  },
  clotheSize: {
    required: "Clothes size is required"
  },
  client: {
    required: "Client name is required",
    minLength: {
      value: 3,
      message: "Client name must be at least 3 characters long"
    }
  },
  note: {
    minLength: {
      value: 5,
      message: "Note must be at least 5 characters long"
    },
    maxLength: {
      value: 100,
      message: "Note cannot exceed 100 characters"
    }
  },
  status: {
    required: "Status is required"
  },
  delivery: {
    min: {
      value: 0,
      message: "Delivery cost cannot be negative"
    }
  },
  total: {
    required: "Total amount is required",
    min: {
      value: 0,
      message: "Total amount cannot be negative"
    },
    max: {
      value: 10000000,
      message: "Total amount cannot exceed 10,000,000"
    }
  },
  state: {
    required: "State is required"
  },
  city: {
    required: "City is required"
  },
  saleDate: {
    required: "Sale date is required"
  },
  userId: {
    required: "User ID is required"
  }
}
