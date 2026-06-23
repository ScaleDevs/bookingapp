import * as React from "react"
import { IconFilesOff } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface TableEmptyStateV1Props {
  colSpan: number
  message?: string
  icon?: React.ReactNode
  className?: string
}

export const TableEmptyStateV1: React.FC<TableEmptyStateV1Props> = ({
  colSpan,
  message = "No data available",
  icon,
  className,
}) => {
  return (
    <tr>
      <td colSpan={colSpan} className={cn("h-32", className)}>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-2 text-muted-foreground">
            {icon || <IconFilesOff className="h-8 w-8" />}
          </div>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </td>
    </tr>
  )
}
