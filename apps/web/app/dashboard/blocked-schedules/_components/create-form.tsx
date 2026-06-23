"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as v from "valibot"

import {
  FormInput,
  FormSelect,
  FormSubmitButton,
  FormTextarea,
} from "@/components/forms"
import { Button } from "@/components/ui/button"
import { trpc } from "@/lib/trpc/client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const createBlockedTimeSchema = v.object({
  offeringId: v.pipe(v.string(), v.minLength(1, "Offering is required")),
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

type CreateFormValues = v.InferInput<typeof createBlockedTimeSchema>
type CreateFormOutput = v.InferOutput<typeof createBlockedTimeSchema>

const defaultValues: CreateFormValues = {
  offeringId: "",
  startsAt: "",
  endsAt: "",
  reason: "",
}

type CreateFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateForm({ open, onOpenChange }: CreateFormProps) {
  const utils = trpc.useUtils()
  const createBlockedTime = trpc.blockedTimes.create.useMutation({
    onSuccess: () => {
      void utils.blockedTimes.list.invalidate()
    },
  })

  const offeringsQuery = trpc.offerings.getSelectOptions.useQuery()

  const offerings = offeringsQuery.data ?? []

  const form = useForm<CreateFormValues>({
    resolver: valibotResolver(
      createBlockedTimeSchema
    ) as unknown as Resolver<CreateFormValues>,
    defaultValues,
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(defaultValues)
    }
    onOpenChange(nextOpen)
  }

  const onSubmit = async (values: CreateFormOutput) => {
    try {
      await createBlockedTime.mutateAsync({
        offeringId: values.offeringId,
        startsAt: values.startsAt,
        endsAt: values.endsAt,
        reason: values.reason || null,
      })

      toast.success("Blocked time created successfully")
      handleOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create blocked time"
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Block Time</SheetTitle>
          <SheetDescription>
            Create a blocked time period when an offering is unavailable.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit(data as unknown as CreateFormOutput)
            )}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
              <FormSelect
                name="offeringId"
                label="Offering"
                placeholder="Select an offering"
                options={offerings}
              />

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
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <FormSubmitButton loading={createBlockedTime.isPending}>
                Block Time
              </FormSubmitButton>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
