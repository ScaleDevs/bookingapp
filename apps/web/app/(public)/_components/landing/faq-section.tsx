import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { MotionSection } from "./motion/motion-section"

const faqs = [
  {
    id: "item-1",
    question: "Can I create multiple offerings?",
    answer:
      "Yes, you can create unlimited offerings. Whether you have multiple courts, different service types, or various appointment durations, you can set up as many as you need. Each offering can have its own pricing, duration, and availability settings.",
  },
  {
    id: "item-2",
    question: "Do customers need accounts?",
    answer:
      "No, customers don't need to create an account to make a reservation. They simply provide their name and contact information when booking. This reduces friction and makes it easier for customers to reserve with you.",
  },
  {
    id: "item-3",
    question: "Can I manage availability?",
    answer:
      "Absolutely. You have full control over your availability. Set operating hours, block off specific time slots, mark certain dates as unavailable, and define buffer times between bookings. The system automatically prevents double bookings.",
  },
  {
    id: "item-4",
    question: "Can I accept reservations for different types of businesses?",
    answer:
      "Yes, the platform is designed to work for any reservation-based business. While we use pickleball courts as an example, it works equally well for fitness classes, tutoring sessions, consulting appointments, clinic visits, photography sessions, and any other bookable service.",
  },
  {
    id: "item-5",
    question: "Can I track customer history?",
    answer:
      "Yes, the platform automatically tracks all customer interactions. You can see each customer's booking history, frequency, preferences, and contact information. This helps you build stronger relationships and provide better service.",
  },
]

export function FaqSection() {
  return (
    <MotionSection id="faq" className="py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center md:mb-16">
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the platform.
          </p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </MotionSection>
  )
}
