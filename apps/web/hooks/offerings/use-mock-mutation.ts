"use client"

import { useCallback, useState } from "react"

type UseMockMutationOptions<TInput, TOutput> = {
  mutationFn: (input: TInput) => Promise<TOutput> | TOutput
  delay?: number
}

export function useMockMutation<TInput, TOutput = void>({
  mutationFn,
  delay = 400,
}: UseMockMutationOptions<TInput, TOutput>) {
  const [isPending, setIsPending] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const reset = useCallback(() => {
    setIsError(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  const mutateAsync = useCallback(
    async (input: TInput) => {
      setIsPending(true)
      setIsError(false)
      setError(null)
      setIsSuccess(false)

      try {
        await new Promise((resolve) => setTimeout(resolve, delay))
        await mutationFn(input)
        setIsSuccess(true)
      } catch (err) {
        setIsError(true)
        setError(err instanceof Error ? err : new Error("Something went wrong"))
        throw err
      } finally {
        setIsPending(false)
      }
    },
    [delay, mutationFn]
  )

  const mutate = useCallback(
    (input: TInput) => {
      void mutateAsync(input)
    },
    [mutateAsync]
  )

  return {
    mutate,
    mutateAsync,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  }
}
