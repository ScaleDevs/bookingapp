export const easeOut = [0.25, 0.1, 0.25, 1] as const

export const transitions = {
  fast: { duration: 0.4, ease: easeOut },
  medium: { duration: 0.6, ease: easeOut },
  slow: { duration: 0.8, ease: easeOut },
  float: { duration: 4, ease: "easeInOut" as const, repeat: Infinity },
}

export const viewport = {
  once: true,
  amount: 0.2,
} as const

export const staggerDelay = 0.06
