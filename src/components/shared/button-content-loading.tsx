import React from "react"
import { Spinner } from "./spinner"

type Props = {
  label: string
  isPending: boolean
}

export const ButtonContentLoading = ({ label, isPending }: Props) => {
  return isPending ? (
    <div className="flex items-center gap-2">
      <Spinner />
      {label}
    </div>
  ) : (
    label
  )
}
