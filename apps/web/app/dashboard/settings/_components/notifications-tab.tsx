"use client"

import { useEffect, useState } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import { SettingsStateShell } from "./settings-state-shell"
import { SettingsSuccessAlert } from "./settings-success-alert"
import { FormSubmitButton, FormSwitch } from "@/components/forms"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { NotificationSettings } from "@/hooks/settings/types"

const notificationSettingsSchema = v.object({
  emailNotifications: v.boolean(),
  reservationNotifications: v.boolean(),
})

type NotificationSettingsFormValues = v.InferInput<
  typeof notificationSettingsSchema
>

function toFormValues(
  settings?: NotificationSettings
): NotificationSettingsFormValues {
  return {
    emailNotifications: settings?.emailNotifications ?? false,
    reservationNotifications: settings?.reservationNotifications ?? false,
  }
}

type NotificationsTabProps = {
  settings?: NotificationSettings
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
}

export function NotificationsTab({
  settings,
  isLoading,
  isError,
  error,
  onRetry,
}: NotificationsTabProps) {
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<NotificationSettingsFormValues>({
    resolver: valibotResolver(notificationSettingsSchema),
    defaultValues: toFormValues(),
  })

  useEffect(() => {
    if (settings) {
      form.reset(toFormValues(settings))
    }
  }, [settings, form])

  useEffect(() => {
    if (!showSuccess) return

    const timeout = window.setTimeout(() => setShowSuccess(false), 4000)
    return () => window.clearTimeout(timeout)
  }, [showSuccess])

  const onSubmit = (values: NotificationSettingsFormValues) => {
    // TODO: Connect mutation — PUT /api/settings/notifications
    void values
    setShowSuccess(true)
  }

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose which email notifications you receive.
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
              {showSuccess ? (
                <SettingsSuccessAlert message="Notification preferences updated successfully." />
              ) : null}

              <FormSwitch
                name="emailNotifications"
                label="Email notifications"
                description="Receive general account and system emails."
              />

              <FormSwitch
                name="reservationNotifications"
                label="Reservation notifications"
                description="Get notified when customers book, cancel, or reschedule."
              />

              <FormSubmitButton>Save notification settings</FormSubmitButton>
            </form>
          </FormProvider>
        </SettingsStateShell>
      </CardContent>
    </Card>
  )
}
