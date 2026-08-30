"use client"

import { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"

import {
  DEFAULT_TABLE_V1_PAGE_SIZE,
  TablePaginationV1,
  TableV1,
} from "@/components/shared/table-v1"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatTime12Hour } from "@/lib/format-time"
import { orpc, type APIOutputs } from "@/lib/orpc/client"
import { useORPCUtils } from "@/lib/orpc/utils"
import { cn } from "@/lib/utils"
import {
  EditScheduleSheet,
  editScheduleSheetHandle,
} from "./edit-schedule-sheet"

type ListItem = APIOutputs["offeringSchedules"]["list"]["items"][number]

type SchedulesTableProps = {
  offeringId: string
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

type CreateColumnsProps = {
  onEditClick: (schedule: ListItem) => void
  onDeleteClick: (schedule: ListItem) => void
}

const createColumns = ({
  onEditClick,
  onDeleteClick,
}: CreateColumnsProps): ColumnDef<ListItem>[] => [
  {
    accessorKey: "dayOfWeek",
    header: "Day of Week",
    cell: ({ row }) => {
      const dayOfWeek = row.getValue("dayOfWeek") as string
      return DAYS_OF_WEEK[Number(dayOfWeek)] || dayOfWeek
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => formatTime12Hour(row.getValue("startTime") as string),
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => formatTime12Hour(row.getValue("endTime") as string),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean

      return (
        <Badge
          variant={isActive ? "default" : "secondary"}
          className={cn("capitalize")}
        >
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const schedule = row.original

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
              <DropdownMenuItem onClick={() => onEditClick(schedule)}>
                <IconEdit />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteClick(schedule)}
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

export function SchedulesTable({ offeringId }: SchedulesTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_V1_PAGE_SIZE)
  const [deleteTarget, setDeleteTarget] = useState<ListItem | null>(null)

  const utils = useORPCUtils()

  const schedulesQuery = useQuery(
    orpc.offeringSchedules.list.queryOptions({
      input: { offeringId, page, pageSize, sortOrder: "asc" },
    })
  )

  const deleteMutation = useMutation(orpc.offeringSchedules.delete.mutationOptions({
    onSuccess: () => {
      void utils.offeringSchedules.list.invalidate()
      toast.success("Schedule deleted successfully")
      setDeleteTarget(null)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  }))

  const list = schedulesQuery.data
  const tableRows: ListItem[] = list?.items ?? []

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate({ id: deleteTarget.id })
  }

  const columns = createColumns({
    onEditClick: (schedule) =>
      editScheduleSheetHandle.openWithPayload(schedule),
    onDeleteClick: setDeleteTarget,
  })

  return (
    <>
      <TableV1
        data={tableRows}
        columns={columns}
        isLoading={schedulesQuery.isLoading}
        emptyMessage="No schedules available"
      />
      <TablePaginationV1
        page={list?.page ?? page}
        pageSize={list?.pageSize ?? pageSize}
        total={list?.total ?? 0}
        totalPages={list?.totalPages ?? 0}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
        isLoading={schedulesQuery.isLoading}
      />

      <EditScheduleSheet />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete schedule?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget
                ? `This will permanently remove the ${DAYS_OF_WEEK[Number(deleteTarget.dayOfWeek)] ?? deleteTarget.dayOfWeek} schedule (${formatTime12Hour(deleteTarget.startTime)} – ${formatTime12Hour(deleteTarget.endTime)}).`
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
