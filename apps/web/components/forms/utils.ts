import type { UseFormRegisterReturn } from "react-hook-form"

import { cn } from "@/lib/utils"

type RegistrationKeys = "name" | "onChange" | "onBlur" | "ref"

export type SafeNativeInputProps = Omit<
  React.ComponentProps<"input">,
  | RegistrationKeys
  | "id"
  | "disabled"
  | "placeholder"
  | "type"
  | "aria-describedby"
  | "aria-invalid"
>

export type SafeNativeTextareaProps = Omit<
  React.ComponentProps<"textarea">,
  | RegistrationKeys
  | "id"
  | "disabled"
  | "placeholder"
  | "aria-describedby"
  | "aria-invalid"
>

export function mergeNativeFieldProps<
  TProps extends { className?: string },
>({
  field,
  props,
  className,
}: {
  field: UseFormRegisterReturn
  props?: TProps
  className?: string
}) {
  const { className: propsClassName, ...restProps } = props ?? {}

  return {
    ...restProps,
    ...field,
    className: cn(propsClassName, className),
  }
}
