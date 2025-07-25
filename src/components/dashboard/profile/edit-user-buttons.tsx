"use client"

import type { TransitionStartFunction } from "react"
import { useState, useTransition } from "react"
import type { Session } from "next-auth"
import { updateUserInfoById } from "@/actions/user/update-user-info-by-id"
import { updateUserPasswordById } from "@/actions/user/update-user-password-by-id"
import { ButtonContentLoading } from "@/components/shared/button-content-loading"
import { ErrorFormMessage } from "@/components/shared/error-form-message"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  profileFormData,
  profileUpdatePasswordFormData,
  userValidation
} from "@/form-config/user"
import type { UpdateUserPasswordType } from "@/types/user"
import { type UpdateUser } from "@/types/user"
import { Delete, Lock, Settings, UserPen } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

type Props = {
  user: Session["user"]
}

export function EditUserButtons({ user }: Props) {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isUpdatePasswordOpen, setIsUpdatePasswordOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="sm:-ml-2 mb-2"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="flex items-center"
            >
              <UserPen className="mr-2 h-4 w-4" />
              Update profile
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <button
              onClick={() => setIsUpdatePasswordOpen(true)}
              className="flex items-center"
            >
              <Lock className="mr-2 h-4 w-4" />
              Change password
            </button>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            disabled
            className="text-destructive"
          >
            <button className="flex items-center">
              <Delete className="mr-2 h-4 w-4 text-destructive" />
              Delete account
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>

            <DialogDescription>
              Edit your profile information.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <InfoUserForm
            user={user}
            startTransition={startTransition}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              form="update-profile"
            >
              <ButtonContentLoading
                label="Update Profile"
                isPending={isPending}
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isUpdatePasswordOpen}
        onOpenChange={setIsUpdatePasswordOpen}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Update your password</DialogTitle>

            <DialogDescription>
              Update your password to ensure your account is secure.
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <UpdateUserPassword
            userId={user.id}
            startTransition={startTransition}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              form="update-password"
            >
              <ButtonContentLoading
                label="Update Password"
                isPending={isPending}
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const InfoUserForm = ({
  user,
  startTransition
}: {
  user: Session["user"]
  startTransition: TransitionStartFunction
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateUser>({
    defaultValues: { ...user }
  })

  const onSubmit = (formData: UpdateUser) => {
    startTransition(async () => {
      const { ok, message } = await updateUserInfoById(formData, user.id)
      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
      } else {
        toast.error("Something went wrong", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <form
      id="update-profile"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 py-4"
    >
      {profileFormData.map((field) => (
        <div
          key={field.name}
          className="grid gap-2"
        >
          <Label htmlFor={field.id.toString()}>{field.label}</Label>

          <Input
            id={field.id.toString()}
            type={field.type}
            placeholder={field.placeholder}
            {...register(
              field.name,
              userValidation[field.name as keyof typeof userValidation]
            )}
            className="w-full"
          />

          <ErrorFormMessage message={errors[field.name]?.message} />
        </div>
      ))}
    </form>
  )
}

export const UpdateUserPassword = ({
  userId,
  startTransition
}: {
  userId: Session["user"]["id"]
  startTransition: TransitionStartFunction
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UpdateUserPasswordType>()

  const onSubmit = (formData: UpdateUserPasswordType) => {
    startTransition(async () => {
      const { ok, message } = await updateUserPasswordById(formData, userId)
      if (ok) {
        toast.success("Good news", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
        reset()
      } else {
        toast.error("Something went wrong", {
          description: message,
          duration: 2000,
          position: "top-center"
        })
      }
    })
  }

  return (
    <form
      id="update-password"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-4 py-4"
    >
      {profileUpdatePasswordFormData.map((field) => (
        <div
          key={field.name}
          className="grid gap-2"
        >
          <Label htmlFor={field.id.toString()}>{field.label}</Label>

          <Input
            id={field.id.toString()}
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name, {
              ...userValidation[field.name as keyof typeof userValidation],
              validate: (value) => {
                if (field.id === 3 && value !== watch("password")) {
                  return "The field of repeat password is incorrect"
                }
              }
            })}
            className="w-full"
          />

          <ErrorFormMessage message={errors[field.name]?.message} />
        </div>
      ))}
    </form>
  )
}
