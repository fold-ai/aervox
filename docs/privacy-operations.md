# ACTPROVE website privacy operations

Owner: Menuo Inc. Publication version: 2026-10-17-v5.
Contact: contact@actprove.com. The founder must assign a named person to monitor it.

This is an internal operating checklist, not a public webpage or a legal opinion.
The policies do not establish that every applicable law has been satisfied. Counsel
should check applicability, employment recordkeeping and international transfers.

## Confirmed facts and technical checks

- User confirmed Menuo Inc., Delaware C-corp; six months for unsuccessful/withdrawn applications; contact email approved.
- Postal correspondence address has been requested, not invented. Add it to the shared company identity after confirmation.
- Vercel serves the website. Supabase aervox application project uses us-west-2.
- On 2026-10-14 a metadata-only live query confirmed career_applications RLS is enabled and neither anon nor authenticated has SELECT permission.
- career-resumes is private, limited to 3 MB PDF uploads. No storage.objects policies give public access.
- Frontend has no Supabase secret. Application requests go through the server.
- Public source has no advertising or optional analytics integration; font files are self-hosted by next/font.
- Restricted console uses actprove_session, act1.layout.* and act1.record.
- Current form collects only the information listed in the applicant notice.
- Existing consent_version and consent_at database fields remain for compatibility.
  New records use notice version 2026-10-17-v5. The new checkbox acknowledges the
  notice; it is not a consent legal basis or marketing opt-in. Keep older notice
  language in version control and do not relabel existing application records.

## Six-month retention: manual process

Publishing the policy does NOT install automated erasure. No existing applications
were read or deleted for this change. Menuo must operate this process:

1. At submission, the created_at date is the initial last-contact date.
2. Record actual subsequent recruitment contacts and closure/withdrawal dates in
   internal_notes using ISO dates until dedicated fields/workflows are introduced.
   An administrative review does not restart retention.
3. Review pending expirations at least monthly. Include open applications with no
   ongoing discussion. Determine the governing legal minimum before scheduling
   deletion. Where no longer requirement applies, arrange removal by the normal
   six-calendar-month deadline after actual contact, not an administrative update.
4. Before deleting, check applicable mandatory employment recordkeeping and any
   documented specific legal hold. Consult counsel about U.S. federal/state
   coverage before choosing the default for a record. Record the exception,
   limited scope, reason and next review date. Do not silently extend all records.
5. For an approved deletion, remove the PDF via Supabase Storage's supported API
   or dashboard, then the application record, relevant correspondence, exports,
   reviewer notes and other copies under company control. Do not DELETE directly
   from storage.objects: that does not reliably remove the stored file.
6. Record completion with minimal non-content audit data. Resolve uncertain uploads
   and orphaned resumes separately; match paths to confirmed records before removal.
7. For hires, move only necessary information into employment records and apply the
   relevant employment notice and legal schedule. Delete unnecessary duplicates.
8. Verify provider backup retention and recovery handling. After a restore, reapply
   deletion decisions before returning restored data to normal use.

Do not claim automated retention until a reviewed worker, failure alerts and a
verified deletion workflow exist. This change intentionally does not add a cron
job that could destroy applicant data without operational review.

## Privacy requests

- Monitor the approved mailbox and date-stamp receipt, request type and response due date.
- Determine applicable jurisdiction and statutory deadline immediately; this runbook
  does not replace local-law review or extend the deadline.
- Use the application email and reference to locate records; verify identity
  proportionately. Do not request passports by default or disclose whether a
  person applied to an unverified sender.
- Search active application records, PDF storage, correspondence and reviewer copies.
- Fulfil access/correction/deletion/restriction or explain the specific legal
  exception. Supply any applicable appeal and regulatory complaint route.
- Do not put full applications, resumes or sensitive verification material into logs.

## Vendor and legal follow-up

- Record the actual corporate email provider, retention configuration and access list.
- Verify executed processor terms/DPAs, subprocessors and applicable international
  transfer safeguards for Vercel, Supabase and email before claiming compliance.
- Check whether a representative, DPO, local notice or employment-specific duties
  apply based on actual activities and recruiting locations. No such appointment
  or certification is asserted on the website.
- Confirm provider log/backup lifetimes; avoid invented fixed lifetimes in public copy.
- Confirm the public postal contact address when supplied.
- Add any new data field, vendor, analytics or embed to the policy before activation.
  Implement consent controls before loading a non-essential tracker where required.

## Research references

- https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/
- https://www.ftc.gov/business-guidance/resources/protecting-personal-information-guide-business
- https://supabase.com/docs/guides/storage/security/access-control
- https://supabase.com/privacy
- https://vercel.com/legal/privacy-notice

- https://www.eeoc.gov/employers/recordkeeping-requirements

## U.S. hiring form update, 2026-10-17

The applicant notice now explicitly covers on-site availability, willingness to
relocate, relocation-assistance needs and earliest on-site start availability.
New acknowledgements use 2026-10-17-v4; older records keep their original notice
version. No new processor or public access to applicant data was introduced.

## Applicant policy audit, 2026-10-17

Public policies now include a dedicated Recruitment Policy. The form links the
Applicant Privacy Notice and Recruitment Policy before the first input and keeps
an acknowledgement at submission. This acknowledgement is neither marketing
consent nor authorization for a third-party background report. Version v5 adds
source/later-check explanations and makes legal retention precedence explicit;
no additional applicant fields or processors are introduced.

Coverage checked against the current form:
- Identity and contact: full name, email, current city/country.
- Role and scheduling: role selection and earliest on-site start availability.
- Professional evidence: resume/profile, optional portfolio, experience,
  motivation and role-specific answer, with the server-selected question.
- U.S. screening: authorization, sponsorship, on-site availability, relocation
  willingness and relocation-assistance needs.
- Administration: application ID/version, creation/acknowledgement timestamps,
  status, notes and a pseudonymous anti-abuse IP digest. Hosting may separately
  process the original IP; the app does not store it as a raw database field.

Live technical checks on 2026-10-17 confirmed restricted table/RPC access and
private PDF-only storage. The one informational advisor finding about no RLS
policies is expected for this server-only table: public roles have no grants.
Neither storage policies nor credential locations were broadened by this audit.

Operational items still require an owner; published text does not complete them:
1. Confirm the U.S. office state and employee/contractor arrangements, then record
   counsel's applicability decision for federal and state retention requirements.
   A six-month default cannot shorten a mandatory recordkeeping period. For
   covered employers, EEOC rules require one year; some state rules are longer.
2. Assign a person to monitor contact@actprove.com for applicant/privacy requests,
   recruitment concerns and accommodation requests, including response deadlines.
3. Complete the existing monthly retention review, legal-hold decision and private
   resume/copy removal workflow. There is no automated deletion worker in the site.
4. Confirm provider agreements, email provider, admin access list and backup
   retention. Do not claim these contractual/operational checks are completed.
5. Add the official correspondence address once supplied by the founder. None was
   invented or substituted with an unconfirmed office/registered-agent address.
6. If later proposing a consumer background report, arrange separate FCRA and
   applicable state disclosures/authorization and adverse-action procedures.
   The website form cannot substitute for those documents.
7. Before introducing automated hiring decisions, biometric/interview recording,
   new demographic questions or new vendors, assess the feature and applicable
   notice/consent requirements and update the notice before collection begins.

Research sources checked for this audit:
- https://www.eeoc.gov/employers/recordkeeping-requirements
- https://www.ftc.gov/business-guidance/blog/2017/04/background-checks-prospective-employees-keep-required-disclosures-simple
- https://oag.ca.gov/privacy/ccpa
- https://calcivilrights.ca.gov/Employment/
