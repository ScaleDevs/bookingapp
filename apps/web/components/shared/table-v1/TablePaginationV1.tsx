import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Default page size when callers omit `defaultPageSize` on `TablePaginationV1`. */
export const DEFAULT_TABLE_V1_PAGE_SIZE = 10

export interface TablePaginationV1Props {
  /** Current page (1-based, matches typical list APIs). */
  page: number
  pageSize: number
  total: number
  totalPages: number
  onPageChange: (page: number) => void
  /** When the user picks a new size, reset `page` to `1` in the parent before refetching. */
  onPageSizeChange: (pageSize: number) => void
  /** Ensures this size appears in the page-size menu; defaults to 10. */
  defaultPageSize?: number
  pageSizeOptions?: number[]
  className?: string
  /** Shows a skeleton placeholder while list data is loading. */
  isLoading?: boolean
  disabled?: boolean
}

export interface TablePaginationSkeletonV1Props {
  className?: string
}

export const TablePaginationSkeletonV1: React.FC<
  TablePaginationSkeletonV1Props
> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
      aria-busy="true"
      aria-label="Loading pagination"
    >
      <div className="h-4 w-40 animate-pulse rounded bg-muted/50" />

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
          <div className="h-8 min-w-18 animate-pulse rounded-md bg-muted/50" />
        </div>

        <div className="flex items-center gap-0.5">
          <div className="size-8 animate-pulse rounded-md bg-muted/50" />
          <div className="size-8 animate-pulse rounded-md bg-muted/50" />
          <div className="h-4 min-w-22 animate-pulse rounded bg-muted/50" />
          <div className="size-8 animate-pulse rounded-md bg-muted/50" />
          <div className="size-8 animate-pulse rounded-md bg-muted/50" />
        </div>
      </div>
    </div>
  )
}

export const TablePaginationV1: React.FC<TablePaginationV1Props> = ({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  defaultPageSize = DEFAULT_TABLE_V1_PAGE_SIZE,
  pageSizeOptions = [10, 25, 50, 100],
  className,
  isLoading = false,
  disabled = false,
}) => {
  const sizeChoices = React.useMemo(() => {
    const merged = new Set([defaultPageSize, ...pageSizeOptions, pageSize])
    return Array.from(merged).sort((a, b) => a - b)
  }, [defaultPageSize, pageSize, pageSizeOptions])

  if (isLoading) {
    return <TablePaginationSkeletonV1 className={className} />
  }

  const rangeFrom = total === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeTo = Math.min(page * pageSize, total)

  const canGoPrev = !disabled && total > 0 && page > 1
  const canGoNext = !disabled && total > 0 && page < totalPages

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
    >
      <p className="text-sm text-muted-foreground tabular-nums">
        {total === 0 ? (
          <>
            Showing <span className="font-medium text-foreground">0</span>{" "}
            results
          </>
        ) : (
          <>
            Showing{" "}
            <span className="font-medium text-foreground">
              {rangeFrom}–{rangeTo}
            </span>{" "}
            of <span className="font-medium text-foreground">{total}</span>
          </>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="whitespace-nowrap">Rows per page</span>
          <select
            className={cn(
              "h-8 min-w-18 rounded-md border border-input bg-background px-2 text-sm text-foreground shadow-xs",
              "outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:opacity-50"
            )}
            value={pageSize}
            disabled={disabled}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {sizeChoices.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8"
            disabled={!canGoPrev}
            aria-label="First page"
            onClick={() => onPageChange(1)}
          >
            <IconChevronsLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8"
            disabled={!canGoPrev}
            aria-label="Previous page"
            onClick={() => onPageChange(page - 1)}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <span className="min-w-22 px-2 text-center text-sm text-muted-foreground tabular-nums">
            {total === 0 ? (
              "—"
            ) : (
              <>
                <span className="font-medium text-foreground">{page}</span>
                {" / "}
                {totalPages}
              </>
            )}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8"
            disabled={!canGoNext}
            aria-label="Next page"
            onClick={() => onPageChange(page + 1)}
          >
            <IconChevronRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8"
            disabled={!canGoNext}
            aria-label="Last page"
            onClick={() => onPageChange(totalPages)}
          >
            <IconChevronsRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
