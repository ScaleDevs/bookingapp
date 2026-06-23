"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  IconCircleCheck,
  IconInfoCircle,
  IconAlertTriangle,
  IconAlertOctagon,
  IconLoader,
} from "@tabler/icons-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <IconCircleCheck className="size-4 text-success" />,
        info: <IconInfoCircle className="size-4 text-blue-300" />,
        warning: <IconAlertTriangle className="size-4 text-warning" />,
        error: <IconAlertOctagon className="size-4 text-destructive" />,
        loading: <IconLoader className="size-4 animate-spin" />,
      }}
      position="top-center"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          description: "!text-muted-foreground opacity-90 text-sm",
          toast: "!rounded-md !border-2",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
