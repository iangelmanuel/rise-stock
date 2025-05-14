interface Props {
  message: string | undefined
}

export const ErrorFormMessage = ({ message }: Props) => {
  return <span className="text-red-500 text-sm">{message}</span>
}
