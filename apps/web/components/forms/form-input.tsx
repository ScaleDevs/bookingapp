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
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import type { BaseFieldProps } from "./types"
import { mergeNativeFieldProps, type SafeNativeInputProps } from "./utils"

export type FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = BaseFieldProps<TFieldValues, TName> & {
  placeholder?: string
  type?: React.ComponentProps<"input">["type"]
  inputProps?: SafeNativeInputProps
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  placeholder,
  disabled,
  className,
  type = "text",
  inputProps,
}: FormInputProps<TFieldValues, TName>) {
  const { register } = useFormContext<TFieldValues>()
  const field = register(name)

  return (
    <FormFieldShell name={name}>
      <FormItem className={cn("w-full self-start", className)}>
        <FormLabel>{label}</FormLabel>
        {description ? <FormDescription>{description}</FormDescription> : null}
        <FormControl>
          <Input
            type={type}
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
