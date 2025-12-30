# Supabase Setup Guide

## Quick Setup Instructions

### 1. Run the Migration

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy the entire contents of `supabase/migrations/20250101000000_legal_documents_and_accreditation.sql`
5. Paste and run the migration
6. Wait for completion (should take ~30 seconds)

### 2. Verify Tables Created

Check that the following tables exist in **Database** > **Tables**:
- ✅ `generated_documents`
- ✅ `document_signatures`
- ✅ `accreditation_responses`
- ✅ `verification_documents`
- ✅ `investor_profiles` (updated with new columns)
- ✅ `investment_limits`

### 3. Verify Storage Buckets

Navigate to **Storage** and verify:
- ✅ `verification-documents` (private bucket)
- ✅ `signed-documents` (private bucket)

If these weren't auto-created, manually create them with these settings:
- **Public**: NO (Private)
- **File size limit**: 10MB
- **Allowed MIME types**: `application/pdf`, `image/png`, `image/jpeg`

### 4. Test Investment Limits

You can test the investment limit calculation function:

```sql
-- Test for a non-accredited domestic investor
SELECT * FROM calculate_investment_limit(
'user-uuid-here',
150000, -- annual income
800000  -- net worth
);
```

## What Was Created

### Tables

**generated_documents**
- Stores generated legal documents (subscription agreements, SAFEs, NDAs)
- Links to investors and campaigns
- Tracks document status

**document_signatures** 
- Electronic signature records
- Full audit trails with IP, timestamp, consent
- ESIGN/UETA compliance

**accreditation_responses**
- Investor accreditation questionnaire responses
- Automatic determination (non_accredited, accredited, qualified_purchaser)
- Admin review workflow

**verification_documents**
- Uploaded verification files (tax returns, bank statements, licenses)
- Review status tracking

**investor_profiles**
- Extended with accreditation fields
- Jurisdiction tracking (state, country, US person status)
- Investment limits and totals

**investment_limits**
- State-specific investment limits
- New Mexico securities law compliance
- Supports domestic and international investors

### Functions

**calculate_investment_limit()**
- Calculates maximum investment based on:
  - Accreditation status
  - Residence state
  - Domestic vs international
  - Income/net worth (for percentage-based limits)

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can only view/edit their own data
- Investment limits are readable by all authenticated users
- Admins will need separate policies (future enhancement)

### Investment Limits - New Mexico

Pre-populated with New Mexico-specific limits:

| Investor Type | Domestic | International | Limit |
|--------------|----------|---------------|-------|
| Non-Accredited | Yes | Yes | Greater of $5K or 10% income/net worth |
| Non-Accredited | No | Yes | 5% income/net worth |
| Accredited | Yes/No | Yes/No | Unlimited |
| Qualified Purchaser | Yes/No | Yes/No | Unlimited |

## Troubleshooting

### Migration Errors

**Error: "column already exists"**
- Solution: The migration checks for existing columns. This is safe to ignore if running multiple times.

**Error: "table already exists"**
- Solution: Safe to ignore. The migration uses `CREATE TABLE IF NOT EXISTS`.

### Storage Bucket Issues

If storage buckets weren't created automatically:

1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Name: `verification-documents`
4. Uncheck "Public bucket"
5. Click Create
6. Repeat for `signed-documents`

Then manually run the storage policies from the migration file.

### RLS Issues

If you can't access data:
1. Check you're authenticated
2. Verify the user ID matches the data owner
3. Check RLS policies are enabled on tables
4. For testing, you can temporarily disable RLS on a table (NOT recommended for production)

## Next Steps After Setup

1. **Test the onboarding flow**: Visit `/nexus/onboarding`
2. **Check investor dashboard**: Visit `/nexus/dashboard` to see status card
3. **Verify accreditation logic**: Complete the questionnaire and check determination
4. **Test document generation**: Generate a subscription agreement
5. **Test signing workflow**: Sign a document and verify audit trail

## Admin Features (To Be Implemented)

- Manual accreditation review interface
- Document verification dashboard
- Investment limit overrides
- Bulk investor management

## Legal Compliance

This system implements:
- ✅ SEC Rule 501 (Accredited Investor Definition)
- ✅ Investment Company Act Section 3(c)(7) (Qualified Purchaser)
- ✅ New Mexico Securities Act (State Investment Limits)
- ✅ ESIGN Act (Electronic Signatures)
- ✅ UETA (Uniform Electronic Transactions Act)

**Note**: This is a self-certification system with admin review. For official accreditation verification, consider integrating with third-party verification services or requiring CPA letters.
