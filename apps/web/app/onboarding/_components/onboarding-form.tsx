"use client"

import { useEffect, useState } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import { FormInput, FormSubmitButton } from "@/components/forms"
import { useAuthStore } from "@/hooks/auth/useAuthStore"
import { authClient } from "@/lib/auth-client"

const onboardingSchema = v.object({
  organizationName: v.pipe(
    v.string(),
    v.minLength(2, "Organization name must be at least 2 characters")
  ),
  organizationSlug: v.pipe(
    v.string(),
    v.minLength(2, "Organization slug must be at least 2 characters"),
    v.regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
  ),
})

type OnboardingFormValues = v.InferInput<typeof onboardingSchema>

const defaultValues: OnboardingFormValues = {
  organizationName: "",
  organizationSlug: "",
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function OnboardingForm() {
  const authState = useAuthStore()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<OnboardingFormValues>({
    resolver: valibotResolver(onboardingSchema),
    defaultValues,
  })

  const { setValue, watch } = form

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "organizationName") {
        setValue(
          "organizationSlug",
          generateSlug(value.organizationName ?? ""),
          { shouldValidate: true }
        )
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, setValue])

  const onSubmit = async (values: OnboardingFormValues) => {
    setServerError(null)

    try {
      const { data: slugData, error: slugError } =
        await authClient.organization.checkSlug({
          slug: values.organizationSlug,
        })

      if (slugError) {
        setServerError(
          slugError.message ?? "Failed to check slug. Please try again."
        )
        return
      }

      if (!slugData.status) {
        setServerError("Slug already exists. Please try a different one.")
        return
      }

      const { data, error } = await authClient.organization.create({
        name: values.organizationName,
        slug: values.organizationSlug,
      })

      if (error) {
        setServerError(
          error.message ?? "Failed to create organization. Please try again."
        )
        return
      }

      if (data) {
        const { data: setActiveData, error: setActiveError } =
          await authClient.organization.setActive({
            organizationId: data.id,
          })

        if (setActiveError) {
          setServerError(
            setActiveError.message ??
              "Failed to set active organization. Please try again."
          )
          return
        }

        if (setActiveData) {
          authState.setActiveOrganizationId(data.id)
          window.location.href = "/dashboard"
        }
      }
    } catch {
      setServerError("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormInput
          name="organizationName"
          label="Organization Name"
          placeholder="Acme Inc"
        />

        <FormInput
          name="organizationSlug"
          label="Organization Slug"
          placeholder="acme-inc"
          description="This will be used in URLs and cannot be changed later"
        />

        {serverError ? (
          <p className="text-sm text-destructive" role="alert">
            {serverError}
          </p>
        ) : null}

        <FormSubmitButton className="w-full">
          {form.formState.isSubmitting
            ? "Creating organization..."
            : "Create Organization"}
        </FormSubmitButton>
      </form>
    </FormProvider>
  )
}
