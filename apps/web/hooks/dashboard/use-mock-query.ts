"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import type { QueryState } from "./types"

type UseMockQueryOptions<T> = {
  queryFn: () => Promise<T> | T
  delay?: number
  isEmpty?: (data: T) => boolean
}

export function useMockQuery<T>({
  queryFn,
  delay = 600,
  isEmpty,
}: UseMockQueryOptions<T>): QueryState<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [fetchId, setFetchId] = useState(0)
  const queryFnRef = useRef(queryFn)

  useEffect(() => {
    queryFnRef.current = queryFn
  }, [queryFn])

  const refetch = useCallback(() => {
    setIsLoading(true)
    setFetchId((id) => id + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    void (async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, delay))
        const result = await queryFnRef.current()

        if (cancelled) return

        setData(result)
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
  }, [delay, fetchId])

  return {
    data,
    isLoading,
    isError,
    error,
    isEmpty: data !== null && isEmpty ? isEmpty(data) : false,
    refetch,
  }
}
