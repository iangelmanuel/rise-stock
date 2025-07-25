import clsx from "clsx"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type Props = {
  name: string
  className?: string
  color?: string
  textSize?: string
}

export function AvatarWithLetters({ name, className, color, textSize }: Props) {
  return (
    <Avatar className={className}>
      <AvatarImage src="/placeholder.svg" />
      <AvatarFallback className={clsx("font-semibold", color, textSize)}>
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  )
}
