import { fileURLToPath } from 'node:url';

import { db, sql } from '../db/index';
import { offering } from '../db/schema';
import type { OfferingCreateInput } from '../services/offerings/atomic';

const offeringsData: OfferingCreateInput[] = [
    {
        name: 'Standard Consultation',
        description: 'One-on-one consultation session',
        durationMinutes: '60',
        capacity: '1',
        price: '300.00',
        isActive: true,
    },
    {
        name: 'Group Workshop',
        description: 'Interactive group workshop with limited seats',
        durationMinutes: '90',
        capacity: '12',
        price: '450.00',
        isActive: true,
    },
    {
        name: 'Express Session',
        description: 'Short follow-up or quick check-in',
        durationMinutes: '30',
        capacity: '1',
        price: '150.00',
        isActive: true,
    },
    {
        name: 'Extended Consultation',
        description: 'In-depth one-on-one session for complex needs',
        durationMinutes: '120',
        capacity: '1',
        price: '400.00',
        isActive: true,
    },
    {
        name: 'Introductory Session',
        description: 'First-time client orientation and needs assessment',
        durationMinutes: '45',
        capacity: '1',
        price: '200.00',
        isActive: true,
    },
    {
        name: 'Team Training',
        description: 'Structured training for small teams',
        durationMinutes: '180',
        capacity: '8',
        price: '500.00',
        isActive: true,
    },
    {
        name: 'Open House Tour',
        description: 'Walkthrough of facilities and available services',
        durationMinutes: '45',
        capacity: '20',
        price: '100.00',
        isActive: true,
    },
    {
        name: 'Private Class',
        description: 'Dedicated session for a single participant',
        durationMinutes: '60',
        capacity: '1',
        price: '350.00',
        isActive: true,
    },
    {
        name: 'Semi-Private Class',
        description: 'Shared session for up to three participants',
        durationMinutes: '60',
        capacity: '3',
        price: '250.00',
        isActive: true,
    },
    {
        name: 'Weekend Intensive',
        description: 'Full-day immersive program',
        durationMinutes: '480',
        capacity: '15',
        price: '500.00',
        isActive: true,
    },
    {
        name: 'Lunch & Learn',
        description: 'Midday educational session over lunch',
        durationMinutes: '60',
        capacity: '25',
        price: '150.00',
        isActive: true,
    },
    {
        name: 'Evening Seminar',
        description: 'After-hours presentation and Q&A',
        durationMinutes: '90',
        capacity: '30',
        price: '250.00',
        isActive: true,
    },
    {
        name: 'Quick Assessment',
        description: 'Brief evaluation to determine next steps',
        durationMinutes: '20',
        capacity: '1',
        price: '120.00',
        isActive: true,
    },
    {
        name: 'Follow-Up Review',
        description: 'Progress check after a prior session',
        durationMinutes: '30',
        capacity: '1',
        price: '170.00',
        isActive: true,
    },
    {
        name: 'Family Session',
        description: 'Session accommodating multiple family members',
        durationMinutes: '75',
        capacity: '6',
        price: '400.00',
        isActive: true,
    },
    {
        name: 'Corporate Briefing',
        description: 'Executive overview for business clients',
        durationMinutes: '60',
        capacity: '10',
        price: '470.00',
        isActive: true,
    },
    {
        name: 'Skills Bootcamp',
        description: 'Hands-on practice in a small group setting',
        durationMinutes: '240',
        capacity: '10',
        price: '500.00',
        isActive: true,
    },
    {
        name: 'Virtual Consultation',
        description: 'Remote one-on-one session via video call',
        durationMinutes: '45',
        capacity: '1',
        price: '220.00',
        isActive: true,
    },
    {
        name: 'On-Site Visit',
        description: 'In-person visit at the client location',
        durationMinutes: '120',
        capacity: '2',
        price: '470.00',
        isActive: true,
    },
    {
        name: 'Legacy Workshop',
        description: 'Discontinued workshop kept for historical records',
        durationMinutes: '90',
        capacity: '12',
        price: '150.00',
        isActive: false,
    },
    {
        name: 'Seasonal Event',
        description: 'Limited-time special event with open registration',
        durationMinutes: '150',
        capacity: '50',
        price: '260.00',
        isActive: true,
    },
    {
        name: 'Membership Orientation',
        description: 'Onboarding session for new members',
        durationMinutes: '30',
        capacity: '15',
        price: '120.00',
        isActive: true,
    },
];


/**
 * Example usage:
 * 
 *   pnpm db:seed:offerings <organizationId>
 * 
 * Example:
 * 
 *   pnpm db:seed:offerings 8lxlGOL4Bp6m528s65UPnKko9nziEOds
 */
async function main() {
    const organizationId = process.argv[2];
    console.log('organizationId', organizationId);

    if (!organizationId) {
        console.error('Usage: tsx src/seeds/offerings.ts <organizationId>');
        process.exitCode = 1;
        return;
    }

    try {
        const results = await db
            .insert(offering)
            .values(
                offeringsData.map((item) => ({
                    ...item,
                    organizationId,
                })),
            )
            .returning();

        console.log(`Seeded ${results.length} offering(s) for organization ${organizationId}`);
        for (const result of results) {
            console.log(`  - ${result.name} (${result.id})`);
        }
    } catch (error) {
        console.error('Offering seed failed:', error);
        process.exitCode = 1;
    } finally {
        await sql.end();
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    void main();
}
