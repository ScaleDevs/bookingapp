"use client"

import { IconAlertCircle, IconRefresh } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type SettingsStateShellProps = {
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  loadingContent?: React.ReactNode
  children: React.ReactNode
}

function DefaultSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function SettingsStateShell({
  isLoading,
  isError,
  error,
  onRetry,
  loadingContent,
  children,
}: SettingsStateShellProps) {
  if (isLoading) {
    return loadingContent ?? <DefaultSkeleton />
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <IconAlertCircle />
        <AlertTitle>Failed to load settings</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <span>
            {error?.message ?? "Something went wrong. Please try again."}
          </span>
          {onRetry ? (
            <Button variant="outline" size="sm" className="w-fit" onClick={onRetry}>
              <IconRefresh />
              Try again
            </Button>
          ) : null}
        </AlertDescription>
      </Alert>
    )
  }

  return children
}
