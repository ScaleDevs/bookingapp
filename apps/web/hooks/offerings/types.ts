export type OfferingStatus = "active" | "archived"

export type OfferingType = "court" | "class" | "coaching" | "service"

export type Offering = {
  id: string
  name: string
  description: string
  type: OfferingType
  duration: number
  capacity: number
  price: number
  status: OfferingStatus
}

export type CreateOfferingInput = {
  name: string
  description: string
  duration: number
  capacity: number
  price: number
  isActive: boolean
}

export type UpdateOfferingInput = {
  id: string
  name?: string
  description?: string
  duration?: number
  capacity?: number
  price?: number
  isActive?: boolean
}

export type ArchiveOfferingInput = {
  id: string
}

export type OfferingsQueryState = {
  data: Offering[] | null
  isLoading: boolean
  isError: boolean
  error: Error | null
  isEmpty: boolean
  refetch: () => void
}
