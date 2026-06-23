"use client"

import * as React from "react"
import { format, isValid } from "date-fns"
import type { FieldPath, FieldValues } from "react-hook-form"
import { useFormContext } from "react-hook-form"
import { IconCalendar } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import type { BaseFieldProps } from "./types"

export type FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Pick<
  BaseFieldProps<TFieldValues, TName>,
  "name" | "label" | "description" | "className" | "disabled"
> & {
  placeholder?: string
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  description,
  placeholder = "Pick a date",
  disabled,
  className,
}: FormDatePickerProps<TFieldValues, TName>) {
  const { control } = useFormContext<TFieldValues>()
  const [open, setOpen] = React.useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedDate = isValid(field.value) ? field.value : undefined

        return (
          <FormItem className={cn("flex flex-col", className)}>
            <FormLabel>{label}</FormLabel>
            {description ? (
              <FormDescription>{description}</FormDescription>
            ) : null}
            <Popover open={open} onOpenChange={setOpen}>
              <FormControl>
                <PopoverTrigger
                  disabled={disabled}
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !selectedDate && "text-muted-foreground",
                      )}
                    />
                  }
                >
                  {selectedDate ? format(selectedDate, "PPP") : placeholder}
                  <IconCalendar className="ml-auto size-4 opacity-50" />
                </PopoverTrigger>
              </FormControl>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    field.onChange(date)
                    setOpen(false)
                  }}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
