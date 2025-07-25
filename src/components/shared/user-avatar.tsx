import type { Session } from "next-auth"
import Image from "next/image"
import clsx from "clsx"
import { AvatarWithLetters } from "./avatar-with-letters"

type Props = {
  userName: Session["user"]["name"]
  avatar?: string | null
  color?: string
  textSize?: string
  className?: string
}

export function UserAvatar({
  userName,
  avatar,
  color,
  textSize,
  className
}: Props) {
  return avatar ? (
    <Image
      src={avatar}
      alt="User Avatar"
      width={40}
      height={40}
      className={clsx(["rounded-full object-cover"], className)}
    />
  ) : (
    <AvatarWithLetters
      name={userName}
      color={color}
      textSize={textSize}
      className={className}
    />
  )
}
