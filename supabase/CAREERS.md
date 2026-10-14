# Careers application storage

Public entry points are `/careers` and `/careers/<role>`. The form posts multipart data to `/careers/submit`; this route is outside the engineering console's protected `/api` prefix and development rewrites.

The production server uses these Vercel variables:

- `CAREERS_SUPABASE_URL`: the API URL for the `aervox` Supabase project.
- `CAREERS_SUPABASE_SECRET_KEY`: a server-only Supabase secret key stored as a Vercel Secret. Never prefix it with `NEXT_PUBLIC_`, commit it, or print it.

The reference schema is in `careers-schema.sql`. It has been applied to the Supabase `aervox` project. Do not run the creation script again against an existing schema. Apply subsequent changes through a reviewed migration.

## Reviewing applications

Open the Supabase Table Editor and choose `public.career_applications`. New submissions have `status = new`. The table includes the role, applicant details, resume/profile links, work statement, consent time and private PDF storage path. Use `status` and `internal_notes` to record manual review. There is no automated applicant scoring or selection.

PDF files are in the private `career-resumes` Storage bucket. The `resume_path` field identifies the file; downloads require authorized dashboard access. No public download policy is configured.

## Submission behavior

- Required fields, listed role IDs, HTTPS links, consent and PDF signatures are validated on the server.
- PDF resumes are limited to 3 MB; candidates can provide a resume/profile link instead.
- Durable database limits allow at most three submissions per email in 24 hours and five per hashed address in an hour. The raw IP address is not stored.
- A browser-generated application ID makes retries idempotent. Success is shown only after storage confirms the record.
- The table and RPC deny `anon` and `authenticated` access. The RPC uses the caller's existing privileges; it does not elevate them.
- Personal data, provider responses and credentials are excluded from application error logs.

## Checks

Run `node --test tests/careers.test.mjs` and `npm run build`. Verify a browser submission against the production table after changing configuration. Identify test submissions clearly and close them after verification.
