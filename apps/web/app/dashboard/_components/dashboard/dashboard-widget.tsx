"use client"

import * as React from "react"
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type DashboardWidgetProps = {
  title: string
  description?: string
  action?: React.ReactNode
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  isEmpty?: boolean
  emptyIcon?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  onRetry?: () => void
  loadingContent?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
}

export function DashboardWidget({
  title,
  description,
  action,
  isLoading = false,
  isError = false,
  error,
  isEmpty = false,
  emptyIcon,
  emptyTitle = "No data yet",
  emptyDescription = "Check back later for updates.",
  onRetry,
  loadingContent,
  className,
  contentClassName,
  children,
}: DashboardWidgetProps) {
  return (
    <Card className={cn("shadow-xs", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>{title}</CardTitle>
          {description ? (
            <CardDescription>{description}</CardDescription>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className={contentClassName}>
        {isLoading ? (
          loadingContent ?? <DashboardWidgetSkeleton />
        ) : isError ? (
          <Alert variant="destructive">
            <IconAlertCircle />
            <AlertTitle>Failed to load</AlertTitle>
            <AlertDescription className="flex flex-col gap-3">
              <span>{error?.message ?? "Something went wrong. Please try again."}</span>
              {onRetry ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={onRetry}
                >
                  <IconRefresh />
                  Try again
                </Button>
              ) : null}
            </AlertDescription>
          </Alert>
        ) : isEmpty ? (
          <Empty className="border py-8">
            <EmptyHeader>
              {emptyIcon ? (
                <EmptyMedia variant="icon">{emptyIcon}</EmptyMedia>
              ) : null}
              <EmptyTitle>{emptyTitle}</EmptyTitle>
              <EmptyDescription>{emptyDescription}</EmptyDescription>
            </EmptyHeader>
            {onRetry ? (
              <EmptyContent>
                <Button variant="outline" size="sm" onClick={onRetry}>
                  <IconRefresh />
                  Refresh
                </Button>
              </EmptyContent>
            ) : null}
          </Empty>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardWidgetSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="shadow-xs">
          <CardHeader>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-2 h-8 w-20" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
