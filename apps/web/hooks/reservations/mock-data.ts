import type { Reservation } from "./types"

export const mockReservations: Reservation[] = [
  {
    id: "res-001",
    reservationNumber: "RES-2026-001",
    customer: {
      id: "cust-001",
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "+1 (555) 123-4567",
    },
    offering: "Court A — Morning Session",
    offeringId: "off-001",
    date: "2026-06-20T09:00:00",
    duration: 60,
    status: "confirmed",
    notes: "Prefers the north court. First-time visitor.",
    timeline: [
      {
        id: "tl-001-1",
        label: "Reservation created",
        timestamp: "2026-06-18T08:45:00",
        description: "Booked online via public booking page.",
      },
      {
        id: "tl-001-2",
        label: "Confirmation email sent",
        timestamp: "2026-06-18T08:46:00",
      },
      {
        id: "tl-001-3",
        label: "Reservation confirmed",
        timestamp: "2026-06-19T10:00:00",
        description: "Confirmed by staff.",
      },
    ],
  },
  {
    id: "res-002",
    reservationNumber: "RES-2026-002",
    customer: {
      id: "cust-002",
      name: "Marcus Johnson",
      email: "marcus.j@email.com",
      phone: "+1 (555) 234-5678",
    },
    offering: "Private Coaching",
    offeringId: "off-002",
    date: "2026-06-20T11:30:00",
    duration: 90,
    status: "pending",
    notes: "Interested in advanced techniques.",
    timeline: [
      {
        id: "tl-002-1",
        label: "Reservation created",
        timestamp: "2026-06-19T11:15:00",
        description: "Booked online via public booking page.",
      },
      {
        id: "tl-002-2",
        label: "Awaiting confirmation",
        timestamp: "2026-06-19T11:15:00",
      },
    ],
  },
  {
    id: "res-003",
    reservationNumber: "RES-2026-003",
    customer: {
      id: "cust-003",
      name: "Emily Rodriguez",
      email: "emily.r@email.com",
      phone: "+1 (555) 345-6789",
    },
    offering: "Court B — Evening Session",
    offeringId: "off-004",
    date: "2026-06-21T18:00:00",
    duration: 60,
    status: "confirmed",
    timeline: [
      {
        id: "tl-003-1",
        label: "Reservation created",
        timestamp: "2026-06-17T17:50:00",
      },
      {
        id: "tl-003-2",
        label: "Reservation confirmed",
        timestamp: "2026-06-18T09:00:00",
      },
    ],
  },
  {
    id: "res-004",
    reservationNumber: "RES-2026-004",
    customer: {
      id: "cust-004",
      name: "David Kim",
      email: "david.kim@email.com",
    },
    offering: "Group Clinic — Beginners",
    offeringId: "off-003",
    date: "2026-06-15T10:00:00",
    duration: 120,
    status: "completed",
    notes: "Attended with a friend.",
    timeline: [
      {
        id: "tl-004-1",
        label: "Reservation created",
        timestamp: "2026-06-10T14:00:00",
      },
      {
        id: "tl-004-2",
        label: "Reservation confirmed",
        timestamp: "2026-06-11T09:00:00",
      },
      {
        id: "tl-004-3",
        label: "Session completed",
        timestamp: "2026-06-15T12:00:00",
      },
    ],
  },
  {
    id: "res-005",
    reservationNumber: "RES-2026-005",
    customer: {
      id: "cust-005",
      name: "Lisa Thompson",
      email: "lisa.t@email.com",
      phone: "+1 (555) 567-8901",
    },
    offering: "Court A — Afternoon Session",
    offeringId: "off-001",
    date: "2026-06-22T14:00:00",
    duration: 60,
    status: "cancelled",
    notes: "Cancelled due to travel plans.",
    timeline: [
      {
        id: "tl-005-1",
        label: "Reservation created",
        timestamp: "2026-06-14T16:00:00",
      },
      {
        id: "tl-005-2",
        label: "Reservation cancelled",
        timestamp: "2026-06-18T16:20:00",
        description: "Cancelled by customer.",
      },
    ],
  },
  {
    id: "res-006",
    reservationNumber: "RES-2026-006",
    customer: {
      id: "cust-006",
      name: "James Wilson",
      email: "james.w@email.com",
      phone: "+1 (555) 678-9012",
    },
    offering: "Court A — Morning Session",
    offeringId: "off-001",
    date: "2026-06-19T09:00:00",
    duration: 60,
    status: "no_show",
    timeline: [
      {
        id: "tl-006-1",
        label: "Reservation created",
        timestamp: "2026-06-16T12:00:00",
      },
      {
        id: "tl-006-2",
        label: "Reservation confirmed",
        timestamp: "2026-06-17T08:00:00",
      },
      {
        id: "tl-006-3",
        label: "Marked as no show",
        timestamp: "2026-06-19T09:30:00",
        description: "Customer did not arrive.",
      },
    ],
  },
]
