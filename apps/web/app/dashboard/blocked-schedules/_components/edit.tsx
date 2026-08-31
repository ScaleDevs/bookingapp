"use client"

import { useEffect } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormProvider, Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as v from "valibot"

import {
  FormInput,
  FormSubmitButton,
  FormTextarea,
} from "@/components/forms"
import { Button } from "@/components/ui/button"
import { SheetFooter } from "@/components/ui/sheet"
import { blockedTimes } from "@bookingapp/api-contracts"

import type { ContractOutputs } from "@/lib/contract-types"
import { blockedTimeClient } from "@/lib/orpc/client"

type BlockedTime = ContractOutputs<typeof blockedTimes>["list"]["items"][number]

const updateBlockedTimeSchema = v.object({
  startsAt: v.pipe(
    v.string(),
    v.minLength(1, "Start date/time is required"),
    v.transform((val) => new Date(val))
  ),
  endsAt: v.pipe(
    v.string(),
    v.minLength(1, "End date/time is required"),
    v.transform((val) => new Date(val))
  ),
  reason: v.optional(v.string()),
})

type UpdateFormValues = v.InferInput<typeof updateBlockedTimeSchema>
type UpdateFormOutput = v.InferOutput<typeof updateBlockedTimeSchema>

type EditProps = {
  blockedTime: BlockedTime
  onSuccess: () => void
  onCancel: () => void
}

function formatDateTimeLocal(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  const hours = String(d.getHours()).padStart(2, "0")
  const minutes = String(d.getMinutes()).padStart(2, "0")
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function Edit({
  blockedTime,
  onSuccess,
  onCancel,
}: EditProps) {
  const queryClient = useQueryClient()
  const updateBlockedTime = useMutation(blockedTimeClient.update.mutationOptions({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: blockedTimeClient.key() })
    },
  }))

  const form = useForm<UpdateFormValues>({
    resolver: valibotResolver(
      updateBlockedTimeSchema
    ) as unknown as Resolver<UpdateFormValues>,
    defaultValues: {
      startsAt: "",
      endsAt: "",
      reason: "",
    },
  })

  useEffect(() => {
    if (blockedTime) {
      form.reset({
        startsAt: formatDateTimeLocal(blockedTime.startsAt),
        endsAt: formatDateTimeLocal(blockedTime.endsAt),
        reason: blockedTime.reason || "",
      })
    }
  }, [blockedTime, form])

  const onSubmit = async (values: UpdateFormOutput) => {
    try {
      await updateBlockedTime.mutateAsync({
        id: blockedTime.id,
        data: {
          startsAt: values.startsAt,
          endsAt: values.endsAt,
          reason: values.reason || null,
        },
      })

      toast.success("Blocked time updated successfully")
      onSuccess()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update blocked time"
      )
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((data) =>
          onSubmit(data as unknown as UpdateFormOutput)
        )}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
          <FormInput
            name="startsAt"
            label="Start Date & Time"
            type="datetime-local"
          />

          <FormInput
            name="endsAt"
            label="End Date & Time"
            type="datetime-local"
          />

          <FormTextarea
            name="reason"
            label="Reason (optional)"
            placeholder="e.g. Maintenance, Holiday, etc."
          />
        </div>

        <SheetFooter className="flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <FormSubmitButton loading={updateBlockedTime.isPending}>
            Save Changes
          </FormSubmitButton>
        </SheetFooter>
      </form>
    </FormProvider>
  )
}
