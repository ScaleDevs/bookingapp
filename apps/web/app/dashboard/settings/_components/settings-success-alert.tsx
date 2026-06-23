"use client"

import { IconCheck } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type SettingsSuccessAlertProps = {
  message?: string
}

export function SettingsSuccessAlert({
  message = "Your changes have been saved successfully.",
}: SettingsSuccessAlertProps) {
  return (
    <Alert className="border-green-600/30 bg-green-500/10 text-green-800 dark:text-green-300">
      <IconCheck />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
