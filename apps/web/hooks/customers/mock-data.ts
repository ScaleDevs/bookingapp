import type { Customer, CustomerDetails } from "./types"

export const mockCustomers: Customer[] = [
  {
    id: "cust-001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 123-4567",
    totalReservations: 12,
    lastReservation: "2026-06-19T09:00:00",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
  },
  {
    id: "cust-002",
    name: "Marcus Johnson",
    email: "marcus.j@email.com",
    phone: "+1 (555) 234-5678",
    totalReservations: 8,
    lastReservation: "2026-06-18T11:30:00",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
  },
  {
    id: "cust-003",
    name: "Emily Rodriguez",
    email: "emily.r@email.com",
    phone: "+1 (555) 345-6789",
    totalReservations: 15,
    lastReservation: "2026-06-17T18:00:00",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily",
  },
  {
    id: "cust-004",
    name: "David Kim",
    email: "david.kim@email.com",
    totalReservations: 3,
    lastReservation: "2026-06-16T10:00:00",
  },
  {
    id: "cust-005",
    name: "Lisa Thompson",
    email: "lisa.t@email.com",
    phone: "+1 (555) 567-8901",
    totalReservations: 6,
    lastReservation: "2026-06-15T14:00:00",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa",
  },
  {
    id: "cust-006",
    name: "James Wilson",
    email: "james.w@email.com",
    phone: "+1 (555) 678-9012",
    totalReservations: 1,
    lastReservation: "2026-06-19T09:00:00",
  },
]

export const mockCustomerDetails: Record<string, CustomerDetails> = {
  "cust-001": {
    id: "cust-001",
    profile: {
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah",
      joinedAt: "2025-11-12T10:00:00",
    },
    reservationHistory: [
      {
        id: "res-001",
        offering: "Court A — Morning Session",
        date: "2026-06-20T09:00:00",
        status: "confirmed",
      },
      {
        id: "res-h-001",
        offering: "Court B — Evening Session",
        date: "2026-06-19T09:00:00",
        status: "completed",
      },
      {
        id: "res-h-002",
        offering: "Private Coaching",
        date: "2026-06-10T11:00:00",
        status: "completed",
      },
    ],
    notes: [
      "Prefers morning sessions on weekdays.",
      "First-time visitor referral from Emily Rodriguez.",
    ],
  },
  "cust-002": {
    id: "cust-002",
    profile: {
      name: "Marcus Johnson",
      email: "marcus.j@email.com",
      phone: "+1 (555) 234-5678",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
      joinedAt: "2026-01-08T14:30:00",
    },
    reservationHistory: [
      {
        id: "res-002",
        offering: "Private Coaching",
        date: "2026-06-20T11:30:00",
        status: "pending",
      },
      {
        id: "res-h-003",
        offering: "Group Clinic — Beginners",
        date: "2026-06-05T10:00:00",
        status: "completed",
      },
    ],
    notes: ["Interested in advanced coaching packages."],
  },
  "cust-003": {
    id: "cust-003",
    profile: {
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Emily",
      joinedAt: "2025-09-20T09:15:00",
    },
    reservationHistory: [
      {
        id: "res-003",
        offering: "Court B — Evening Session",
        date: "2026-06-21T18:00:00",
        status: "confirmed",
      },
      {
        id: "res-h-004",
        offering: "Court A — Morning Session",
        date: "2026-06-14T09:00:00",
        status: "completed",
      },
      {
        id: "res-h-005",
        offering: "Court B — Evening Session",
        date: "2026-06-07T18:00:00",
        status: "cancelled",
      },
    ],
    notes: [
      "Regular evening player.",
      "Referred Sarah Chen to the club.",
    ],
  },
  "cust-004": {
    id: "cust-004",
    profile: {
      name: "David Kim",
      email: "david.kim@email.com",
      joinedAt: "2026-03-15T16:00:00",
    },
    reservationHistory: [
      {
        id: "res-004",
        offering: "Group Clinic — Beginners",
        date: "2026-06-22T10:00:00",
        status: "confirmed",
      },
      {
        id: "res-h-006",
        offering: "Group Clinic — Beginners",
        date: "2026-06-15T10:00:00",
        status: "completed",
      },
    ],
    notes: [],
  },
  "cust-005": {
    id: "cust-005",
    profile: {
      name: "Lisa Thompson",
      email: "lisa.t@email.com",
      phone: "+1 (555) 567-8901",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Lisa",
      joinedAt: "2026-02-01T11:00:00",
    },
    reservationHistory: [
      {
        id: "res-005",
        offering: "Court A — Afternoon Session",
        date: "2026-06-22T14:00:00",
        status: "cancelled",
      },
      {
        id: "res-h-007",
        offering: "Court A — Afternoon Session",
        date: "2026-06-08T14:00:00",
        status: "completed",
      },
    ],
    notes: ["Cancelled due to travel — may rebook in July."],
  },
  "cust-006": {
    id: "cust-006",
    profile: {
      name: "James Wilson",
      email: "james.w@email.com",
      phone: "+1 (555) 678-9012",
      joinedAt: "2026-06-19T07:30:00",
    },
    reservationHistory: [
      {
        id: "res-006",
        offering: "Court A — Morning Session",
        date: "2026-06-19T09:00:00",
        status: "no_show",
      },
    ],
    notes: [],
  },
}
