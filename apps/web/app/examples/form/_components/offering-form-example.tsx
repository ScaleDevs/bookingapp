"use client"

import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import {
  FormCheckbox,
  FormDatePicker,
  FormInput,
  FormSelect,
  FormSubmitButton,
  FormSwitch,
  FormTextarea,
} from "@/components/forms"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const offeringSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Name must be at least 2 characters"),
  ),
  description: v.pipe(
    v.string(),
    v.minLength(10, "Description must be at least 10 characters"),
  ),
  category: v.pipe(
    v.string(),
    v.minLength(1, "Please select a category"),
  ),
  termsAccepted: v.pipe(
    v.boolean(),
    v.check((value) => value === true, "You must accept the terms"),
  ),
  notificationsEnabled: v.boolean(),
  eventDate: v.pipe(
    v.union([v.date(), v.undefined()]),
    v.check(
      (value): value is Date => value instanceof Date,
      "Please select a date",
    ),
  ),
})

type OfferingFormValues = v.InferInput<typeof offeringSchema>

export function OfferingFormExample() {
  const form = useForm<OfferingFormValues>({
    resolver: valibotResolver(offeringSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      termsAccepted: false,
      notificationsEnabled: true,
      eventDate: undefined,
    },
  })

  const onSubmit = (values: OfferingFormValues) => {
    console.log("Form submitted:", values)
  }

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>Create Offering</CardTitle>
        <CardDescription>
          Example form using React Hook Form, Valibot, and reusable form
          components.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormInput
              name="name"
              label="Name"
              placeholder="Enter name"
              description="The public name for this offering."
            />

            <FormTextarea
              name="description"
              label="Description"
              placeholder="Describe your offering"
              description="Include details guests should know before booking."
            />

            <FormSelect
              name="category"
              label="Category"
              placeholder="Select a category"
              options={[
                { label: "Class", value: "class" },
                { label: "Service", value: "service" },
              ]}
            />

            <FormDatePicker
              name="eventDate"
              label="Event Date"
              description="When this offering is available."
              placeholder="Select a date"
            />

            <FormSwitch
              name="notificationsEnabled"
              label="Enable notifications"
              description="Receive email updates about bookings."
            />

            <FormCheckbox
              name="termsAccepted"
              label="Accept terms and conditions"
              description="You must accept the terms to continue."
            />

            <FormSubmitButton className="w-full">
              Create Offering
            </FormSubmitButton>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}
