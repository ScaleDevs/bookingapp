"use client"

import { useMemo, useState } from "react"
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react"

import { CustomerDetailsDrawer } from "@/app/dashboard/customers/_components/customer-details-drawer"
import { CustomersEmptyState } from "@/app/dashboard/customers/_components/customers-empty-state"
import { CustomersHeader } from "@/app/dashboard/customers/_components/customers-header"
import { CustomersTable } from "@/app/dashboard/customers/_components/customers-table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCustomerDetails } from "@/hooks/customers/use-customer-details"
import { useCustomers } from "@/hooks/customers/use-customers"
import type { Customer } from "@/hooks/customers/types"

function TableSkeleton() {
  return (
    <div className="space-y-3 px-4 lg:px-6">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full" />
      ))}
    </div>
  )
}

export function CustomersContent() {
  const customersQuery = useCustomers()

  const [search, setSearch] = useState("")
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  )
  const [drawerOpen, setDrawerOpen] = useState(false)

  const customerDetailsQuery = useCustomerDetails(selectedCustomerId)

  const filteredCustomers = useMemo(() => {
    if (!customersQuery.data) return []

    const normalizedSearch = search.trim().toLowerCase()

    return customersQuery.data.filter((customer) => {
      if (normalizedSearch.length === 0) return true

      return (
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch) ||
        (customer.phone?.toLowerCase().includes(normalizedSearch) ?? false)
      )
    })
  }, [customersQuery.data, search])

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomerId(customer.id)
    setDrawerOpen(true)
  }

  const handleDrawerOpenChange = (open: boolean) => {
    setDrawerOpen(open)
    if (!open) {
      setSelectedCustomerId(null)
    }
  }

  const showEmptyState =
    !customersQuery.isLoading &&
    !customersQuery.isError &&
    customersQuery.isEmpty

  const showFilteredEmpty =
    !customersQuery.isLoading &&
    !customersQuery.isError &&
    !customersQuery.isEmpty &&
    filteredCustomers.length === 0

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CustomersHeader search={search} onSearchChange={setSearch} />

          {customersQuery.isLoading ? (
            <TableSkeleton />
          ) : customersQuery.isError ? (
            <div className="px-4 lg:px-6">
              <Alert variant="destructive">
                <IconAlertCircle />
                <AlertTitle>Failed to load customers</AlertTitle>
                <AlertDescription className="flex flex-col gap-3">
                  <span>
                    {customersQuery.error?.message ??
                      "Something went wrong. Please try again."}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={customersQuery.refetch}
                  >
                    <IconRefresh />
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          ) : showEmptyState ? (
            <CustomersEmptyState />
          ) : showFilteredEmpty ? (
            <div className="px-4 text-sm text-muted-foreground lg:px-6">
              No customers match your search.
            </div>
          ) : (
            <CustomersTable
              customers={filteredCustomers}
              onSelect={handleSelectCustomer}
            />
          )}
        </div>
      </div>

      <CustomerDetailsDrawer
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
        details={customerDetailsQuery.data}
        isLoading={drawerOpen && customerDetailsQuery.isLoading}
        isError={customerDetailsQuery.isError}
        error={customerDetailsQuery.error}
        onRetry={customerDetailsQuery.refetch}
      />
    </div>
  )
}
