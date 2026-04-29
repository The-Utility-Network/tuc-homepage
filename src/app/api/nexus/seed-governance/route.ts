import { NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function createAdminClient() {
    return createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function POST() {
    try {
        const adminClient = createAdminClient()

        // 1. BOARD OF DIRECTORS (Class F — §5.2)
        const boardData = [
            {
                name: 'Krishna Patel', email: 'kpatel@basalthq.com',
                seat_type: 'founder', seat_class: 'F-1', title: 'Chairman & Director',
                committees: ['governance', 'strategy', 'finance'],
                appointed_by: 'Class F-1 Stockholder Election',
                equity_percentage: 20.0, voting_rights: true,
                bio: 'Co-founder. CEO of BasaltHQ Inc. Oversees corporate strategy, governance framework, and the Fixed Algebra equity model.',
                term_start: new Date('2025-01-01'), is_active: true
            },
            {
                name: 'Devin Turner', email: 'dturner@basalthq.com',
                seat_type: 'founder', seat_class: 'F-2', title: 'Director',
                committees: ['strategy', 'compensation'],
                appointed_by: 'Class F-2 Stockholder Election',
                equity_percentage: 20.0, voting_rights: true,
                bio: 'Co-founder. CTO of BasaltHQ Inc. Leads platform engineering, protocol development, and technical architecture.',
                term_start: new Date('2025-01-01'), is_active: true
            },
            {
                name: 'De\'Aundre Milton', email: 'dmilton@basalthq.com',
                seat_type: 'founder', seat_class: 'F-3', title: 'Director',
                committees: ['strategy', 'audit'],
                appointed_by: 'Class F-3 Stockholder Election',
                equity_percentage: 20.0, voting_rights: true,
                bio: 'Co-founder. CRO of BasaltHQ Inc. Drives revenue operations, market expansion, and partnership development.',
                term_start: new Date('2025-01-01'), is_active: true
            }
        ]

        for (const member of boardData) {
            // Upsert on email
            const { data: existing } = await adminClient.from('board_members').select('id').eq('email', member.email).single()
            if (existing) {
                await adminClient.from('board_members').update(member).eq('id', existing.id)
            } else {
                await adminClient.from('board_members').insert([member])
            }
        }

        // 2. CORPORATE OFFICERS (§142)
        const officerData = [
            {
                name: 'Krishna Patel', email: 'kpatel@basalthq.com',
                title: 'Chief Executive Officer', department: 'Executive',
                appointed_by: 'board', appointment_date: new Date('2025-01-01'),
                responsibilities: 'Overall corporate management, investor relations, strategic direction, and governance compliance.',
                is_active: true
            },
            {
                name: 'Devin Turner', email: 'dturner@basalthq.com',
                title: 'Chief Technology Officer', department: 'Engineering',
                appointed_by: 'board', appointment_date: new Date('2025-01-01'),
                responsibilities: 'Technical architecture, platform engineering, protocol development, and infrastructure operations.',
                is_active: true
            },
            {
                name: 'De\'Aundre Milton', email: 'dmilton@basalthq.com',
                title: 'Chief Revenue Officer', department: 'Revenue',
                appointed_by: 'board', appointment_date: new Date('2025-01-01'),
                responsibilities: 'Revenue operations, market strategy, business development, and partnership acquisition.',
                is_active: true
            },
            {
                name: 'Krishna Patel', email: 'kpatel@basalthq.com',
                title: 'Secretary', department: 'Corporate',
                appointed_by: 'board', appointment_date: new Date('2025-01-01'),
                responsibilities: 'Corporate records, meeting minutes, board communications, Delaware filing compliance.',
                is_active: true
            },
            {
                name: 'Krishna Patel', email: 'kpatel@basalthq.com',
                title: 'Treasurer', department: 'Finance',
                appointed_by: 'board', appointment_date: new Date('2025-01-01'),
                responsibilities: 'Financial oversight, bank account management, tax compliance, franchise tax payments.',
                is_active: true
            }
        ]

        for (const officer of officerData) {
            // Upsert on email & title
            const { data: existing } = await adminClient.from('officers').select('id').eq('email', officer.email).eq('title', officer.title).single()
            if (existing) {
                await adminClient.from('officers').update(officer).eq('id', existing.id)
            } else {
                await adminClient.from('officers').insert([officer])
            }
        }

        // 3. BYLAWS & CORPORATE DOCUMENTS
        const bylawsData = [
            // Certificate of Incorporation
            {
                document_type: 'certificate_of_incorporation', article_number: 'I', section_number: '1.1',
                title: 'Corporate Name', is_protected: false,
                content: 'The name of the corporation is The Utility Company Inc.',
                filed_with_delaware: true, delaware_filing_date: new Date('2025-01-01')
            },
            {
                document_type: 'certificate_of_incorporation', article_number: 'II', section_number: '2.1',
                title: 'Registered Agent & Office', is_protected: false,
                content: 'The registered office of the corporation in the State of Delaware is located in New Castle County. The corporation maintains a registered agent as required by the Delaware General Corporation Law.'
            },
            {
                document_type: 'certificate_of_incorporation', article_number: 'IV', section_number: '4.1',
                title: 'Authorized Capital Stock', is_protected: true, protection_type: 'unanimous_consent',
                content: 'The total number of shares of all classes of stock that the Corporation shall have authority to issue is 10,000,000 shares, consisting of:\n\n(a) 6,000,000 shares of Class F Common Stock (Founder Stock), par value $0.001 per share, divided into:\n    - 2,000,000 shares of Series F-1\n    - 2,000,000 shares of Series F-2\n    - 2,000,000 shares of Series F-3\n\n(b) 4,000,000 shares of Class A Common Stock, par value $0.001 per share.'
            },
            {
                document_type: 'certificate_of_incorporation', article_number: 'IV', section_number: '4.4',
                title: 'Protective Provisions — Fixed Algebra', is_protected: true, protection_type: 'unanimous_consent',
                content: 'So long as any shares of Class F Common Stock remain outstanding, the Corporation shall not, without the unanimous written consent of the holders of all series of Class F Common Stock:\n\n(a) Amend, alter, or repeal any provision of this Certificate of Incorporation or the Bylaws in a manner that adversely affects the rights, preferences, or privileges of the Class F Common Stock;\n(b) Authorize or issue, or obligate itself to issue, any equity security senior to or on a parity with the Class F Common Stock;\n(c) Consummate a merger, consolidation, or sale of all or substantially all of the assets;\n(d) Incur or guarantee any indebtedness for borrowed money in excess of $50,000 in any 12-month period;\n(e) Declare or pay dividends on any class of stock.',
                tags: ['fixed_algebra', 'founder_protection', 'unanimous_consent']
            },
            {
                document_type: 'certificate_of_incorporation', article_number: 'V', section_number: '5.2',
                title: 'Board Composition — Founder Directors', is_protected: true, protection_type: 'unanimous_consent',
                content: 'The holders of Class F Common Stock, voting as separate series, shall be entitled to elect three (3) Founder Directors, one for each Series (F-1, F-2, and F-3).\n\nExpansion Protocol: If the Board is expanded beyond three members, any additional seats shall be designated as At-Large Directors, elected by the holders of all outstanding shares of Common Stock voting together as a single class.'
            },
            // Bylaws
            {
                document_type: 'bylaws', article_number: 'III', section_number: '3.1',
                title: 'Regular Meetings', is_protected: false,
                content: 'Regular meetings of the Board of Directors shall be held at least quarterly, at such time and place as determined by the Board or the Chairman. Notice of regular meetings is not required if the date, time, and place have been fixed by the Board.'
            },
            {
                document_type: 'bylaws', article_number: 'III', section_number: '3.2',
                title: 'Special Meetings', is_protected: false,
                content: 'Special meetings of the Board of Directors may be called by the Chairman or by any two directors, upon at least two (2) days\' written notice to each director. Notice may be waived in writing by any director.'
            },
            {
                document_type: 'bylaws', article_number: 'III', section_number: '3.6',
                title: 'Founder Director Removal Protections', is_protected: true, protection_type: 'unanimous_consent',
                content: 'Founder Directors may only be removed through:\n\n1. Voluntary Resignation; or\n2. A mandatory three-stage dispute resolution process:\n   (a) Mandatory Mediation: 30 days of good-faith mediation;\n   (b) Binding AAA Arbitration: Removal only for material breach, fraud, or misconduct;\n   (c) Mandatory Buyout: Removal is not effective until a full-value buyout (no minority discounts) of the founder\'s 20% stake is completed.',
                tags: ['founder_protection', 'dispute_resolution']
            },
            {
                document_type: 'bylaws', article_number: 'VII', section_number: '7.1',
                title: 'Officers — Generally', is_protected: false,
                content: 'The officers of the Corporation shall be a Chief Executive Officer, a Secretary, and a Treasurer. The Board of Directors may also appoint such other officers as it may deem necessary. Any number of offices may be held by the same person.'
            },
            {
                document_type: 'bylaws', article_number: 'VIII', section_number: '8.6A',
                title: 'Debt Gating Mechanism', is_protected: true, protection_type: 'unanimous_consent',
                content: 'A Board resolution to borrow money or guarantee indebtedness is VOID unless accompanied by unanimous written consent of all Class F stockholders. This applies to any lease or financing arrangement exceeding $50,000 in any 12-month period.\n\nDe Minimis Exception: Routine operational expenses under $50,000 require only simple Board majority approval.',
                tags: ['debt_gate', 'founder_protection']
            },
            // Stockholder Agreement
            {
                document_type: 'stockholder_agreement', article_number: 'II', section_number: '2.1',
                title: 'Vesting Schedule — Class F', is_protected: false,
                content: 'All Class F shares are subject to the same 2-year quarterly vesting schedule: 250,000 shares per quarter per founder (1,000,000 shares per year). Total vesting period: 2 years from the date of grant.\n\nAll founders must file Section 83(b) elections within 30 days of the grant date.\n\nCliff: None. Vesting begins immediately upon grant.',
                tags: ['vesting', '83b']
            }
        ]

        for (const bylaw of bylawsData) {
            const { data: existing } = await adminClient.from('bylaws').select('id').eq('document_type', bylaw.document_type).eq('section_number', bylaw.section_number).single()
            if (existing) {
                await adminClient.from('bylaws').update({ ...bylaw, effective_date: new Date('2025-01-01'), version: 1, is_current: true, updated_at: new Date() }).eq('id', existing.id)
            } else {
                await adminClient.from('bylaws').insert([{ ...bylaw, effective_date: new Date('2025-01-01'), version: 1, is_current: true, updated_at: new Date() }])
            }
        }

        // Clean up resolutions
        await adminClient.from('resolutions').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

        return NextResponse.json({
            success: true,
            seeded: {
                boardMembers: boardData.length,
                officers: officerData.length,
                bylaws: bylawsData.length,
                resolutions: 'cleared'
            }
        })
    } catch (error: any) {
        console.error('Seed error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
