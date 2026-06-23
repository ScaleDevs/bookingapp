"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"

import { TableFilter } from "@/app/dashboard/blocked-schedules/_components/table-filter"
import { CreateForm } from "@/app/dashboard/blocked-schedules/_components/create-form"

import { Button } from "@/components/ui/button"

export function Header() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Blocked Schedules
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage blocked time periods when offerings are unavailable.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TableFilter />

          <Button onClick={() => setOpen(true)} className="shrink-0">
            <IconPlus />
            Block Time
          </Button>
        </div>
      </div>

      <CreateForm open={open} onOpenChange={setOpen} />
    </>
  )
}
