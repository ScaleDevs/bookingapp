"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import {
  IconDotsVertical,
  IconEye,
  IconEdit,
  IconArchive,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react"

import { useFilters } from "@/app/dashboard/offerings/_providers/filters-context"
import { filtersToListInput } from "@/app/dashboard/offerings/_components/table-filter"
import {
  DetailsSheet,
  detailsSheetHandle,
} from "@/app/dashboard/offerings/_components/details-sheet"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  DEFAULT_TABLE_V1_PAGE_SIZE,
  TablePaginationV1,
  TableV1,
} from "@/components/shared/table-v1"
import { offerings } from "@bookingapp/api-contracts"

import type { ContractOutputs } from "@/lib/contract-types"
import { offeringClient } from "@/lib/orpc/client"
import { cn } from "@/lib/utils"
import { EmptyState } from "./empty-state"

type ListItem = ContractOutputs<typeof offerings>["list"]["items"][number]

function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${remainingMinutes} min`
}

type CreateColumnsProps = {
  onViewClick: (id: string) => void
  onEditClick: (id: string) => void
  onToggleStatus: (id: string) => void
  onViewDetailsPage: (id: string) => void
}

const createColumns = ({
  onViewClick,
  onEditClick,
  onToggleStatus,
  onViewDetailsPage,
}: CreateColumnsProps): ColumnDef<ListItem>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <button
        onClick={() => onViewDetailsPage(row.original.id)}
        className="max-w-[200px] truncate text-left font-medium hover:underline focus:underline focus:outline-none"
      >
        {row.getValue("name")}
      </button>
    ),
  },
  {
    accessorKey: "durationMinutes",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDuration(Number(row.getValue("durationMinutes")))}
      </span>
    ),
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => row.getValue("capacity"),
    meta: {
      headerClassName: "hidden sm:table-cell",
      cellClassName: "hidden sm:table-cell",
    },
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
          {isActive ? "Active" : "Archived"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      const offering = row.original

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
              <DropdownMenuItem onClick={() => onViewDetailsPage(offering.id)}>
                <IconExternalLink />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewClick(offering.id)}>
                <IconEye />
                Quick view
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEditClick(offering.id)}>
                <IconEdit />
                Quick edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleStatus(offering.id)}
                variant={offering.isActive ? "destructive" : "default"}
              >
                {offering.isActive ? (
                  <>
                    <IconArchive />
                    Archive
                  </>
                ) : (
                  <>
                    <IconCheck />
                    Activate
                  </>
                )}
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
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_TABLE_V1_PAGE_SIZE)

  const queryClient = useQueryClient()

  useEffect(() => {
    setPage(1)
  }, [filters])

  const filterInput = filtersToListInput(filters)

  const offeringsQuery = useQuery(
    offeringClient.list.queryOptions({
      input: {
        page,
        pageSize,
        sortOrder: "desc",
        filters: filterInput,
      },
    })
  )

  const toggleStatusMutation = useMutation(
    offeringClient.toggleStatus.mutationOptions({
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: offeringClient.key() })
      },
    })
  )

  const list = offeringsQuery.data
  const tableRows: ListItem[] = list?.items ?? []

  const handlePageSizeChange = (nextPageSize: number) => {
    setPageSize(nextPageSize)
    setPage(1)
  }

  const handleViewClick = (id: string) => {
    detailsSheetHandle.openWithPayload({ id, tab: "view" })
  }

  const handleEditClick = (id: string) => {
    detailsSheetHandle.openWithPayload({ id, tab: "edit" })
  }

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate({ id })
  }

  const handleViewDetailsPage = (id: string) => {
    router.push(`/dashboard/offerings/${id}`)
  }

  const columns = createColumns({
    onViewClick: handleViewClick,
    onEditClick: handleEditClick,
    onToggleStatus: handleToggleStatus,
    onViewDetailsPage: handleViewDetailsPage,
  })

  return (
    <>
      <div className="px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          {tableRows.length === 0 && !offeringsQuery.isLoading ? (
            <EmptyState />
          ) : (
            <TableV1
              data={tableRows}
              columns={columns}
              isLoading={offeringsQuery.isLoading}
            />
          )}
          <TablePaginationV1
            page={list?.page ?? page}
            pageSize={list?.pageSize ?? pageSize}
            total={list?.total ?? 0}
            totalPages={list?.totalPages ?? 0}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            isLoading={offeringsQuery.isLoading}
          />
        </div>
      </div>

      <DetailsSheet />
    </>
  )
}
