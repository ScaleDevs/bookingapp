export type ContactInformation = {
  email: string
  phone?: string
  address?: string
  website?: string
}

export type BookingSettings = {
  autoConfirm: boolean
  cancellationRules: string
  bookingWindowDays: number
}

export type BusinessProfile = {
  name: string
  description: string
  logoUrl?: string
  contact: ContactInformation
  bookingSettings: BookingSettings
}

export type NotificationSettings = {
  emailNotifications: boolean
  reservationNotifications: boolean
}

export type TeamMemberRole = "owner" | "admin" | "staff"

export type TeamMember = {
  id: string
  name: string
  email: string
  role: TeamMemberRole
  avatarUrl?: string
}

export type UpdateBusinessProfileInput = {
  name?: string
  description?: string
  logoUrl?: string
  contact?: ContactInformation
  bookingSettings?: BookingSettings
}

export type UpdateNotificationSettingsInput = NotificationSettings

export type InviteTeamMemberInput = {
  email: string
  role: TeamMemberRole
}

export type BusinessProfileQueryState = {
  data: BusinessProfile | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}

export type NotificationSettingsQueryState = {
  data: NotificationSettings | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}

export type TeamMembersQueryState = {
  data: TeamMember[] | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}

export const teamRoleLabels: Record<TeamMemberRole, string> = {
  owner: "Owner",
  admin: "Admin",
  staff: "Staff",
}
