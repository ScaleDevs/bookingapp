"use client"

import { useCallback, useEffect, useState } from "react"

import { mockCustomerDetails } from "./mock-data"
import type { CustomerDetails, CustomerDetailsQueryState } from "./types"

const DETAILS_DELAY = 400

export function useCustomerDetails(
  customerId: string | null
): CustomerDetailsQueryState {
  const [data, setData] = useState<CustomerDetails | null>(null)
  const [isLoading, setIsLoading] = useState(!!customerId)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [fetchId, setFetchId] = useState(0)
  const [trackedCustomerId, setTrackedCustomerId] = useState(customerId)

  if (customerId !== trackedCustomerId) {
    setTrackedCustomerId(customerId)
    setData(null)
    setIsError(false)
    setError(null)
    setIsLoading(!!customerId)
  }

  const refetch = useCallback(() => {
    if (!customerId) return
    setIsLoading(true)
    setFetchId((id) => id + 1)
  }, [customerId])

  useEffect(() => {
    if (!customerId) return

    let cancelled = false

    void (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, DETAILS_DELAY))

        // TODO: Replace with API call — GET /api/customers/:id
        const details = mockCustomerDetails[customerId]

        if (cancelled) return

        if (!details) {
          throw new Error("Customer not found")
        }

        setData(details)
        setIsError(false)
        setError(null)
      } catch (err) {
        if (cancelled) return

        setIsError(true)
        setError(err instanceof Error ? err : new Error("Something went wrong"))
        setData(null)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [customerId, fetchId])

  return {
    data,
    isLoading,
    isError,
    error,
    isEmpty: data !== null && data.reservationHistory.length === 0,
    refetch,
  }
}
