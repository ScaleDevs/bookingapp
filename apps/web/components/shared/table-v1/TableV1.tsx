"use client"

import * as React from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
  type PaginationState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { TableHeaderV1 } from "./TableHeaderV1"
import { TableRowV1 } from "./TableRowV1"
import { TableEmptyStateV1 } from "./TableEmptyStateV1"
import { TableSkeletonV1 } from "./TableSkeletonV1"
import { TableBulkActionBarV1 } from "./TableBulkActionBarV1"

export interface TableV1Props<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  isLoading?: boolean
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  enableRowSelection?: boolean
  enableMultiRowSelection?: boolean
  onRowSelectionChange?: (selectedRows: TData[]) => void
  bulkActions?: React.ReactNode
  className?: string
  containerClassName?: string
  skeletonRows?: number
  skeletonColumns?: number
}

export const TableV1 = <TData,>({
  data,
  columns,
  isLoading = false,
  emptyMessage,
  emptyIcon,
  enableRowSelection = false,
  enableMultiRowSelection = true,
  onRowSelectionChange,
  bulkActions,
  className,
  containerClassName,
  skeletonRows,
  skeletonColumns,
}: TableV1Props<TData>) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    enableRowSelection,
    enableMultiRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)

  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(selectedRows)
    }
  }, [rowSelection])

  const handleClearSelection = React.useCallback(() => {
    table.resetRowSelection()
  }, [table])

  return (
    <>
      <div className={cn("overflow-x-auto", containerClassName)}>
        <table className={cn("w-full", className)}>
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHeaderV1 key={header.id} header={header} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeletonV1
                rows={skeletonRows}
                columns={skeletonColumns || columns.length}
              />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableEmptyStateV1
                colSpan={columns.length}
                message={emptyMessage}
                icon={emptyIcon}
              />
            ) : (
              table
                .getRowModel()
                .rows.map((row) => <TableRowV1 key={row.id} row={row} />)
            )}
          </tbody>
        </table>
      </div>

      {enableRowSelection && bulkActions && (
        <TableBulkActionBarV1
          selectedCount={selectedCount}
          onClearSelection={handleClearSelection}
        >
          {bulkActions}
        </TableBulkActionBarV1>
      )}
    </>
  )
}
