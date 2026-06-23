"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface TableSkeletonV1Props {
  rows?: number
  columns?: number
  className?: string
}

export const TableSkeletonV1: React.FC<TableSkeletonV1Props> = ({
  rows = 5,
  columns = 4,
  className,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-border">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="h-10 px-4 py-2">
              <div
                className={cn(
                  "h-4 animate-pulse rounded bg-muted/50",
                  className
                )}
                style={{
                  width: "70%",
                }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}
