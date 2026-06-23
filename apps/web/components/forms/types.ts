import type { FieldPath, FieldValues } from "react-hook-form"

export type FormSelectOption = {
  label: string
  value: string
}

export type BaseFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
  label: string
  description?: string
  className?: string
  disabled?: boolean
}
