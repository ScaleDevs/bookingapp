"use client"

import { useEffect } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import { SettingsStateShell } from "./settings-state-shell"
import { SettingsSuccessAlert } from "./settings-success-alert"
import {
  FormInput,
  FormSubmitButton,
  FormSwitch,
  FormTextarea,
} from "@/components/forms"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { BookingSettings } from "@/hooks/settings/types"

const bookingSettingsSchema = v.object({
  autoConfirm: v.boolean(),
  cancellationRules: v.pipe(
    v.string(),
    v.minLength(10, "Cancellation rules must be at least 10 characters")
  ),
  bookingWindowDays: v.pipe(
    v.string(),
    v.minLength(1, "Booking window is required"),
    v.regex(/^\d+$/, "Enter a whole number"),
    v.transform(Number),
    v.pipe(v.number(), v.minValue(1, "Must be at least 1 day"))
  ),
})

type BookingSettingsFormInput = v.InferInput<typeof bookingSettingsSchema>
type BookingSettingsFormOutput = v.InferOutput<typeof bookingSettingsSchema>

function toFormValues(settings?: BookingSettings): BookingSettingsFormInput {
  return {
    autoConfirm: settings?.autoConfirm ?? false,
    cancellationRules: settings?.cancellationRules ?? "",
    bookingWindowDays: settings ? String(settings.bookingWindowDays) : "30",
  }
}

type BookingSettingsTabProps = {
  settings?: BookingSettings
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  onSave: (values: BookingSettingsFormOutput) => void
  isSaving?: boolean
  isSuccess?: boolean
  onSuccessDismiss?: () => void
}

export function BookingSettingsTab({
  settings,
  isLoading,
  isError,
  error,
  onRetry,
  onSave,
  isSaving,
  isSuccess,
  onSuccessDismiss,
}: BookingSettingsTabProps) {
  const form = useForm<
    BookingSettingsFormInput,
    unknown,
    BookingSettingsFormOutput
  >({
    resolver: valibotResolver(bookingSettingsSchema),
    defaultValues: toFormValues(),
  })

  useEffect(() => {
    if (settings) {
      form.reset(toFormValues(settings))
    }
  }, [settings, form])

  useEffect(() => {
    if (!isSuccess) return

    const timeout = window.setTimeout(() => {
      onSuccessDismiss?.()
    }, 4000)

    return () => window.clearTimeout(timeout)
  }, [isSuccess, onSuccessDismiss])

  const onSubmit = (values: BookingSettingsFormOutput) => {
    onSave(values)
  }

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Booking settings</CardTitle>
        <CardDescription>
          Configure how reservations are confirmed and managed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SettingsStateShell
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={onRetry}
        >
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {isSuccess ? (
                <SettingsSuccessAlert message="Booking settings updated successfully." />
              ) : null}

              <FormSwitch
                name="autoConfirm"
                label="Auto confirm"
                description="Automatically confirm new reservations without manual review."
              />

              <FormTextarea
                name="cancellationRules"
                label="Cancellation rules"
                description="Displayed to customers when they book."
                placeholder="Describe your cancellation policy"
              />

              <FormInput
                name="bookingWindowDays"
                label="Booking window"
                description="Number of days customers can view and book ahead."
                placeholder="30"
                type="number"
                inputProps={{ min: 1 }}
              />

              <FormSubmitButton loading={isSaving}>
                Save booking settings
              </FormSubmitButton>
            </form>
          </FormProvider>
        </SettingsStateShell>
      </CardContent>
    </Card>
  )
}
