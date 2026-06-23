"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBusinessProfile } from "@/hooks/settings/use-business-profile"
import { useNotificationSettings } from "@/hooks/settings/use-notification-settings"
import { useTeamMembers } from "@/hooks/settings/use-team-members"
import { useUpdateBusinessProfile } from "@/hooks/settings/use-update-business-profile"

import { BusinessProfileTab } from "./business-profile-tab"
import { BookingSettingsTab } from "./booking-settings-tab"
import { NotificationsTab } from "./notifications-tab"
import { TeamMembersTab } from "./team-members-tab"

export function SettingsContent() {
  const businessProfileQuery = useBusinessProfile()
  const notificationSettingsQuery = useNotificationSettings()
  const teamMembersQuery = useTeamMembers()
  const updateBusinessProfile = useUpdateBusinessProfile()

  const handleSaveProfile = (values: {
    name: string
    description: string
    logoUrl?: string
    contact: {
      email: string
      phone?: string
      address?: string
      website?: string
    }
  }) => {
    // TODO: Connect useUpdateBusinessProfile mutation and refetch profile
    updateBusinessProfile.mutate({
      name: values.name,
      description: values.description,
      logoUrl: values.logoUrl || undefined,
      contact: {
        email: values.contact.email,
        phone: values.contact.phone || undefined,
        address: values.contact.address || undefined,
        website: values.contact.website || undefined,
      },
    })
  }

  const handleSaveBookingSettings = (values: {
    autoConfirm: boolean
    cancellationRules: string
    bookingWindowDays: number
  }) => {
    // TODO: Connect useUpdateBusinessProfile mutation and refetch profile
    updateBusinessProfile.mutate({
      bookingSettings: {
        autoConfirm: values.autoConfirm,
        cancellationRules: values.cancellationRules,
        bookingWindowDays: values.bookingWindowDays,
      },
    })
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="flex flex-col gap-1 px-4 lg:px-6">
            <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
            <p className="text-sm text-muted-foreground">
              Manage your business profile, booking rules, and team access.
            </p>
          </div>

          <div className="px-4 lg:px-6">
            <Tabs defaultValue="profile" className="gap-4">
              <TabsList
                variant="line"
                className="w-full flex-wrap justify-start overflow-x-auto"
              >
                <TabsTrigger value="profile">Business profile</TabsTrigger>
                <TabsTrigger value="booking">Booking settings</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="team">Team members</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <BusinessProfileTab
                  profile={businessProfileQuery.data ?? undefined}
                  isLoading={businessProfileQuery.isLoading}
                  isError={businessProfileQuery.isError}
                  error={businessProfileQuery.error}
                  onRetry={businessProfileQuery.refetch}
                  onSave={handleSaveProfile}
                  isSaving={updateBusinessProfile.isPending}
                  isSuccess={updateBusinessProfile.isSuccess}
                  onSuccessDismiss={updateBusinessProfile.reset}
                />
              </TabsContent>

              <TabsContent value="booking">
                <BookingSettingsTab
                  settings={
                    businessProfileQuery.data?.bookingSettings ?? undefined
                  }
                  isLoading={businessProfileQuery.isLoading}
                  isError={businessProfileQuery.isError}
                  error={businessProfileQuery.error}
                  onRetry={businessProfileQuery.refetch}
                  onSave={handleSaveBookingSettings}
                  isSaving={updateBusinessProfile.isPending}
                  isSuccess={updateBusinessProfile.isSuccess}
                  onSuccessDismiss={updateBusinessProfile.reset}
                />
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationsTab
                  settings={notificationSettingsQuery.data ?? undefined}
                  isLoading={notificationSettingsQuery.isLoading}
                  isError={notificationSettingsQuery.isError}
                  error={notificationSettingsQuery.error}
                  onRetry={notificationSettingsQuery.refetch}
                />
              </TabsContent>

              <TabsContent value="team">
                <TeamMembersTab
                  members={teamMembersQuery.data}
                  isLoading={teamMembersQuery.isLoading}
                  isError={teamMembersQuery.isError}
                  error={teamMembersQuery.error}
                  isEmpty={teamMembersQuery.isEmpty}
                  onRetry={teamMembersQuery.refetch}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
