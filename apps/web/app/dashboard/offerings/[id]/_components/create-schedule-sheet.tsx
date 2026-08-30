"use client"

import { useState } from "react"
import { IconPlus } from "@tabler/icons-react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { useMutation } from "@tanstack/react-query"
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
  SheetTrigger,
} from "@/components/ui/sheet"
import { orpc } from "@/lib/orpc/client"
import { useORPCUtils } from "@/lib/orpc/utils"

const createScheduleSchema = v.pipe(
  v.object({
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
  }),
  v.forward(
    v.partialCheck(
      [["startTime"], ["endTime"]],
      ({ startTime, endTime }) => startTime <= endTime,
      "Start time must not be later than end time"
    ),
    ["startTime"]
  )
)

type CreateScheduleFormValues = v.InferInput<typeof createScheduleSchema>
type CreateScheduleFormOutput = v.InferOutput<typeof createScheduleSchema>

const defaultValues: CreateScheduleFormValues = {
  dayOfWeek: "",
  startTime: "",
  endTime: "",
  isActive: true,
}

const DAYS_OF_WEEK_OPTIONS = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
]

type CreateScheduleSheetProps = {
  offeringId: string
}

export function CreateScheduleSheet({ offeringId }: CreateScheduleSheetProps) {
  const [open, setOpen] = useState(false)
  const utils = useORPCUtils()
  const createSchedule = useMutation(orpc.offeringSchedules.create.mutationOptions({
    onSuccess: () => {
      void utils.offeringSchedules.list.invalidate()
    },
  }))

  const form = useForm<CreateScheduleFormValues>({
    resolver: valibotResolver(
      createScheduleSchema
    ) as unknown as Resolver<CreateScheduleFormValues>,
    defaultValues,
  })

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset(defaultValues)
    }
    setOpen(nextOpen)
  }

  const onSubmit = async (values: CreateScheduleFormOutput) => {
    try {
      await createSchedule.mutateAsync({
        offeringId,
        dayOfWeek: values.dayOfWeek.toString(),
        startTime: values.startTime,
        endTime: values.endTime,
        isActive: values.isActive,
      })

      toast.success("Schedule created successfully")
      handleOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create schedule"
      )
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button size="sm">
            <IconPlus />
            Add Schedule
          </Button>
        }
      />
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Create Schedule</SheetTitle>
          <SheetDescription>
            Add a new time slot for this offering.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit(data as unknown as CreateScheduleFormOutput)
            )}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex flex-1 flex-col gap-2 overflow-y-auto px-4">
              <FormSelect
                name="dayOfWeek"
                label="Day of Week"
                placeholder="Select a day"
                options={DAYS_OF_WEEK_OPTIONS}
              />

              <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2">
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
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <FormSubmitButton loading={createSchedule.isPending}>
                Create Schedule
              </FormSubmitButton>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}
