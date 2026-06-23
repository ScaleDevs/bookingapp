"use client"

import { useEffect } from "react"
import { valibotResolver } from "@hookform/resolvers/valibot"
import { FormProvider, useForm } from "react-hook-form"
import * as v from "valibot"

import { SettingsStateShell } from "./settings-state-shell"
import { SettingsSuccessAlert } from "./settings-success-alert"
import { FormInput, FormSubmitButton, FormTextarea } from "@/components/forms"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { BusinessProfile } from "@/hooks/settings/types"

const businessProfileSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(2, "Business name must be at least 2 characters")
  ),
  description: v.pipe(
    v.string(),
    v.minLength(10, "Description must be at least 10 characters")
  ),
  logoUrl: v.optional(
    v.pipe(
      v.string(),
      v.check(
        (value) => value === "" || /^https?:\/\/.+/.test(value),
        "Enter a valid URL"
      )
    )
  ),
  contact: v.object({
    email: v.pipe(v.string(), v.email("Enter a valid email address")),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    website: v.optional(
      v.pipe(
        v.string(),
        v.check(
          (value) => value === "" || /^https?:\/\/.+/.test(value),
          "Enter a valid URL"
        )
      )
    ),
  }),
})

type BusinessProfileFormValues = v.InferInput<typeof businessProfileSchema>

function toFormValues(profile?: BusinessProfile): BusinessProfileFormValues {
  return {
    name: profile?.name ?? "",
    description: profile?.description ?? "",
    logoUrl: profile?.logoUrl ?? "",
    contact: {
      email: profile?.contact.email ?? "",
      phone: profile?.contact.phone ?? "",
      address: profile?.contact.address ?? "",
      website: profile?.contact.website ?? "",
    },
  }
}

type BusinessProfileTabProps = {
  profile?: BusinessProfile
  isLoading?: boolean
  isError?: boolean
  error?: Error | null
  onRetry?: () => void
  onSave: (values: BusinessProfileFormValues) => void
  isSaving?: boolean
  isSuccess?: boolean
  onSuccessDismiss?: () => void
}

export function BusinessProfileTab({
  profile,
  isLoading,
  isError,
  error,
  onRetry,
  onSave,
  isSaving,
  isSuccess,
  onSuccessDismiss,
}: BusinessProfileTabProps) {
  const form = useForm<BusinessProfileFormValues>({
    resolver: valibotResolver(businessProfileSchema),
    defaultValues: toFormValues(),
  })

  const logoUrl = form.watch("logoUrl")

  useEffect(() => {
    if (profile) {
      form.reset(toFormValues(profile))
    }
  }, [profile, form])

  useEffect(() => {
    if (!isSuccess) return

    const timeout = window.setTimeout(() => {
      onSuccessDismiss?.()
    }, 4000)

    return () => window.clearTimeout(timeout)
  }, [isSuccess, onSuccessDismiss])

  const onSubmit = (values: BusinessProfileFormValues) => {
    onSave(values)
  }

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle>Business profile</CardTitle>
        <CardDescription>
          Update your public business information shown on your booking page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SettingsStateShell
          isLoading={isLoading}
          isError={isError}
          error={error}
          onRetry={onRetry}
        >
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              {isSuccess ? (
                <SettingsSuccessAlert message="Business profile updated successfully." />
              ) : null}

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar size="lg" className="size-16">
                  {logoUrl ? (
                    <AvatarImage src={logoUrl} alt="Business logo preview" />
                  ) : null}
                  <AvatarFallback>
                    {profile?.name?.slice(0, 2).toUpperCase() ?? "BP"}
                  </AvatarFallback>
                </Avatar>
                <FormInput
                  name="logoUrl"
                  label="Logo"
                  description="URL to your business logo image."
                  placeholder="https://example.com/logo.png"
                  className="flex-1"
                />
              </div>

              <FormInput
                name="name"
                label="Business name"
                placeholder="Sunset Pickleball Club"
              />

              <FormTextarea
                name="description"
                label="Description"
                placeholder="Describe your business"
              />

              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-sm font-medium">
                  Contact information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    name="contact.email"
                    label="Email"
                    type="email"
                    placeholder="hello@business.com"
                  />
                  <FormInput
                    name="contact.phone"
                    label="Phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                  />
                  <FormInput
                    name="contact.address"
                    label="Address"
                    placeholder="123 Main St, City, State"
                    className="sm:col-span-2"
                  />
                  <FormInput
                    name="contact.website"
                    label="Website"
                    placeholder="https://yourbusiness.com"
                    className="sm:col-span-2"
                  />
                </div>
              </div>

              <FormSubmitButton loading={isSaving}>
                Save business profile
              </FormSubmitButton>
            </form>
          </FormProvider>
        </SettingsStateShell>
      </CardContent>
    </Card>
  )
}
