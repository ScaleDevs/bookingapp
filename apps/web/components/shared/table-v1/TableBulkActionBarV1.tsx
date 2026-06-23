import * as React from "react"
import { IconX } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface TableBulkActionBarV1Props {
  selectedCount: number
  onClearSelection: () => void
  children?: React.ReactNode
  className?: string
}

export const TableBulkActionBarV1: React.FC<TableBulkActionBarV1Props> = ({
  selectedCount,
  onClearSelection,
  children,
  className,
}) => {
  if (selectedCount === 0) return null

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        "flex items-center gap-4",
        "px-4 py-3",
        "bg-primary text-primary-foreground",
        "rounded-lg shadow-lg",
        "border border-primary/20",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
        </span>
        <button
          onClick={onClearSelection}
          className="ml-2 rounded-sm p-1 transition-colors hover:bg-primary-foreground/10"
          aria-label="Clear selection"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>
      {children && (
        <>
          <div className="h-6 w-px bg-primary-foreground/20" />
          <div className="flex items-center gap-2">{children}</div>
        </>
      )}
    </div>
  )
}
