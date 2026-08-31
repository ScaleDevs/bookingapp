"use client"

import { useEffect } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { FormProvider, Resolver, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as v from "valibot"

import {
  FormInput,
  FormSelect,
  FormSubmitButton,
  FormSwitch,
} from "@/components/forms"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  createSheetHandle,
} from "@/components/ui/sheet"
import { offeringSchedules } from "@bookingapp/api-contracts"

import type { ContractOutputs } from "@/lib/contract-types"
import { offeringScheduleClient } from "@/lib/orpc/client"

type Schedule = ContractOutputs<typeof offeringSchedules>["list"]["items"][number]

export const editScheduleSheetHandle = createSheetHandle<Schedule>()

const editScheduleSchema = v.object({
  dayOfWeek: v.pipe(
    v.string(),
    v.minLength(1, "Day of week is required"),
    v.transform(Number),
    v.pipe(v.number(), v.minValue(0), v.maxValue(6))
  ),
  startTime: v.pipe(
    v.string(),
    v.minLength(1, "Start time is required"),
    v.regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "Start time must be in HH:MM format"
    )
  ),
  endTime: v.pipe(
    v.string(),
    v.minLength(1, "End time is required"),
    v.regex(
      /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/,
      "End time must be in HH:MM format"
    )
  ),
  isActive: v.boolean(),
})

type EditScheduleFormValues = v.InferInput<typeof editScheduleSchema>
type EditScheduleFormOutput = v.InferOutput<typeof editScheduleSchema>

const DAYS_OF_WEEK_OPTIONS = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
]

function toFormValues(schedule: Schedule): EditScheduleFormValues {
  return {
    dayOfWeek: schedule.dayOfWeek,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    isActive: schedule.isActive,
  }
}

type EditScheduleSheetContentProps = {
  schedule: Schedule
}

function EditScheduleSheetContent({ schedule }: EditScheduleSheetContentProps) {
  const queryClient = useQueryClient()
  const updateSchedule = useMutation(offeringScheduleClient.update.mutationOptions({
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: offeringScheduleClient.key() })
    },
  }))

  const form = useForm<EditScheduleFormValues>({
    resolver: valibotResolver(
      editScheduleSchema
    ) as unknown as Resolver<EditScheduleFormValues>,
    defaultValues: toFormValues(schedule),
  })

  useEffect(() => {
    form.reset(toFormValues(schedule))
  }, [schedule, form])

  const onSubmit = async (values: EditScheduleFormOutput) => {
    try {
      await updateSchedule.mutateAsync({
        id: schedule.id,
        data: {
          dayOfWeek: values.dayOfWeek.toString(),
          startTime: values.startTime,
          endTime: values.endTime,
          isActive: values.isActive,
        },
      })

      toast.success("Schedule updated successfully")
      editScheduleSheetHandle.close()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update schedule"
      )
    }
  }

  return (
    <SheetContent className="flex w-full flex-col sm:max-w-lg">
      <SheetHeader>
        <SheetTitle>Edit Schedule</SheetTitle>
        <SheetDescription>
          Update the time slot for this offering.
        </SheetDescription>
      </SheetHeader>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit((data) =>
            onSubmit(data as unknown as EditScheduleFormOutput)
          )}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4">
            <FormSelect
              name="dayOfWeek"
              label="Day of Week"
              placeholder="Select a day"
              options={DAYS_OF_WEEK_OPTIONS}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormInput
                name="startTime"
                label="Start Time"
                placeholder="09:00"
                type="time"
              />
              <FormInput
                name="endTime"
                label="End Time"
                placeholder="17:00"
                type="time"
              />
            </div>

            <FormSwitch
              name="isActive"
              label="Active status"
              description="Only active schedules are available for booking."
            />
          </div>

          <SheetFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => editScheduleSheetHandle.close()}
            >
              Cancel
            </Button>
            <FormSubmitButton loading={updateSchedule.isPending}>
              Save Changes
            </FormSubmitButton>
          </SheetFooter>
        </form>
      </FormProvider>
    </SheetContent>
  )
}

export function EditScheduleSheet() {
  return (
    <Sheet handle={editScheduleSheetHandle}>
      {({ payload: schedule }) =>
        schedule ? (
          <EditScheduleSheetContent key={schedule.id} schedule={schedule} />
        ) : null
      }
    </Sheet>
  )
}
