"use client"

import type { FieldPath, FieldValues } from "react-hook-form"
import { useFormContext } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormFieldShell,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import type { BaseFieldProps } from "./types"
import { mergeNativeFieldProps, type SafeNativeTextareaProps } from "./utils"

export type FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = BaseFieldProps<TFieldValues, TName> & {
  placeholder?: string
  inputProps?: SafeNativeTextareaProps
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  placeholder,
  disabled,
  className,
  inputProps,
}: FormTextareaProps<TFieldValues, TName>) {
  const { register } = useFormContext<TFieldValues>()
  const field = register(name)

  return (
    <FormFieldShell name={name}>
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        {description ? <FormDescription>{description}</FormDescription> : null}
        <FormControl>
          <Textarea
            placeholder={placeholder}
            disabled={disabled}
            {...mergeNativeFieldProps({ field, props: inputProps })}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormFieldShell>
  )
}
