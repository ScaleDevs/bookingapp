import type {
  BusinessProfile,
  NotificationSettings,
  TeamMember,
} from "./types"

export const mockBusinessProfile: BusinessProfile = {
  name: "Sunset Pickleball Club",
  description:
    "Premier pickleball facility with indoor and outdoor courts, coaching, and community events.",
  logoUrl: "https://api.dicebear.com/9.x/initials/svg?seed=SPC",
  contact: {
    email: "hello@sunsetpickleball.com",
    phone: "+1 (555) 987-6543",
    address: "123 Court Lane, San Diego, CA 92101",
    website: "https://sunsetpickleball.com",
  },
  bookingSettings: {
    autoConfirm: true,
    cancellationRules:
      "Cancellations must be made at least 24 hours before the scheduled session. Late cancellations may be charged in full.",
    bookingWindowDays: 30,
  },
}

export const mockNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  reservationNotifications: true,
}

export const mockTeamMembers: TeamMember[] = [
  {
    id: "team-001",
    name: "Alex Rivera",
    email: "alex.rivera@sunsetpickleball.com",
    role: "owner",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex",
  },
  {
    id: "team-002",
    name: "Jordan Lee",
    email: "jordan.lee@sunsetpickleball.com",
    role: "admin",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan",
  },
  {
    id: "team-003",
    name: "Mia Patel",
    email: "mia.patel@sunsetpickleball.com",
    role: "staff",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Mia",
  },
]
