type Props = {
  message: string | undefined
}

export function ErrorFormMessage({ message }: Props) {
  return <span className="text-sm text-red-500">{message}</span>
}
