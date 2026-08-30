"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import { useFilters } from "@/app/dashboard/blocked-schedules/_providers/filters-context"
import { filtersToListInput } from "@/app/dashboard/blocked-schedules/_components/table-filter"
import {
  DetailsSheet,
  detailsSheetHandle,
} from "@/app/dashboard/blocked-schedules/_components/details-sheet"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DEFAULT_TABLE_V1_PAGE_SIZE,
  TablePaginationV1,
  TableV1,
} from "@/components/shared/table-v1"
import { orpc, type APIOutputs } from "@/lib/orpc/client"
import { useORPCUtils } from "@/lib/orpc/utils"

type ListItem = APIOutputs["blockedTimes"]["list"]["items"][number]

function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

type CreateColumnsProps = {
  onEditClick: (item: ListItem) => void
  onDeleteClick: (item: ListItem) => void
}

const createColumns = ({
  onEditClick,
  onDeleteClick,
}: CreateColumnsProps): ColumnDef<ListItem>[] => [
  {
    accessorKey: "startsAt",
    header: "Starts At",
    cell: ({ row }) => formatDateTime(row.getValue("startsAt") as string),
  },
  {
    accessorKey: "endsAt",
    header: "Ends At",
    cell: ({ row }) => formatDateTime(row.getValue("endsAt") as string),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      const reason = row.getValue("reason") as string | null
      return (
        reason || (
          <span className="text-muted-foreground italic">No reason</span>
        )
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const item = row.original

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <IconDotsVertical />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEditClick(item)}>
                <IconEdit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(item)}
                variant="destructive"
              >
                <IconTrash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export function Table() {
  const { filters } = useFilters()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_V1_PAGE_SIZE)
  const [deleteTarget, setDeleteTarget] = useState<ListItem | null>(null)

  const utils = useORPCUtils()

  useEffect(() => {
    setPage(1)
  }, [filters])

  const filterInput = filtersToListInput(filters)

  const blockedTimesQuery = useQuery(
    orpc.blockedTimes.list.queryOptions({
      input: {
        offeringId: filters.offeringId!,
        page,
        pageSize,
        sortOrder: "desc",
        filters: filterInput,
      },
      enabled: !!filters.offeringId,
    })
  )

  const deleteMutation = useMutation(orpc.blockedTimes.delete.mutationOptions({
    onSuccess: () => {
      void utils.blockedTimes.list.invalidate()
      toast.success("Blocked time deleted successfully")
      setDeleteTarget(null)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  }))

  const list = blockedTimesQuery.data
  const tableRows: ListItem[] = list?.items ?? []

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  const handleEditClick = (item: ListItem) => {
    detailsSheetHandle.openWithPayload(item)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate({ id: deleteTarget.id })
  }

  const columns = createColumns({
    onEditClick: handleEditClick,
    onDeleteClick: setDeleteTarget,
  })

  if (!filters.offeringId) {
    return (
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="flex min-h-[400px] items-center justify-center p-8">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Select an offering to view blocked schedules
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Use the filter above to choose an offering
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <TableV1
            data={tableRows}
            columns={columns}
            isLoading={blockedTimesQuery.isLoading}
            emptyMessage="No blocked schedules found"
          />
          <TablePaginationV1
            page={list?.page ?? page}
            pageSize={list?.pageSize ?? pageSize}
            total={list?.total ?? 0}
            totalPages={list?.totalPages ?? 0}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            isLoading={blockedTimesQuery.isLoading}
          />
        </div>
      </div>

      <DetailsSheet />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blocked schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently remove the blocked time from ${formatDateTime(deleteTarget.startsAt)} to ${formatDateTime(deleteTarget.endsAt)}.`
                : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
