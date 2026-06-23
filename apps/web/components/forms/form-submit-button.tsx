"use client"

import { useFormContext, useFormState } from "react-hook-form"

import { Button } from "@/components/ui/button"

export type FormSubmitButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean
}

export function FormSubmitButton({
  loading,
  disabled,
  children,
  ...props
}: FormSubmitButtonProps) {
  const { control } = useFormContext()
  const { isSubmitting } = useFormState({ control })

  const isLoading = loading ?? isSubmitting

  return (
    <Button type="submit" disabled={disabled || isLoading} {...props}>
      {children}
    </Button>
  )
}
