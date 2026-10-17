-- Additive U.S. hiring upgrade. Existing records and old clients remain readable.
-- New form submissions use a separate application version; privacy notice versions
-- remain an acknowledgement record, not a schema-validation switch.
alter table public.career_applications
  add column application_version text,
  add column on_site_availability text check (on_site_availability in ('yes', 'after_relocation', 'depends_on_location', 'no')),
  add column relocation_willingness text check (relocation_willingness in ('already_local', 'yes', 'depends_on_location', 'no')),
  add column relocation_assistance text check (relocation_assistance in ('yes', 'no', 'unsure'));

alter table public.career_applications
  add constraint career_us_hiring_required check (
    application_version is null or (
      application_version = '2026-10-17-us-v1' and
      on_site_availability is not null and relocation_willingness is not null and
      relocation_assistance is not null and availability is not null and length(availability) between 1 and 160 and
      us_work_authorization is not null and us_work_authorization in ('yes', 'no', 'unsure') and
      us_sponsorship is not null and us_sponsorship in ('not_required', 'required', 'unsure') and
      work_arrangement is not null and work_arrangement = 'onsite' and
      motivation is not null and role_question is not null and role_response is not null
    )
  );

create or replace function public.submit_career_application(application jsonb)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  app_id uuid := (application ->> 'id')::uuid;
  app_email text := lower(application ->> 'email');
  app_ip text := application ->> 'ip_hash';
  lock_key bigint;
begin
  -- Always acquire locks in the same order to avoid deadlocks. Limits apply
  -- across all serverless instances; replaying a request cannot create a copy.
  for lock_key in
    select distinct v from unnest(array[
      hashtextextended('career-email:' || app_email, 0),
      hashtextextended('career-ip:' || coalesce(app_ip, app_email), 0),
      hashtextextended('career-id:' || app_id::text, 0)
    ]) as t(v) order by v
  loop
    perform pg_advisory_xact_lock(lock_key);
  end loop;
  if exists (select 1 from public.career_applications where id = app_id) then
    return jsonb_build_object('ok', true, 'duplicate', true, 'id', app_id);
  end if;
  if (select count(*) from public.career_applications where email = app_email and created_at > now() - interval '24 hours') >= 3
    or (app_ip is not null and (select count(*) from public.career_applications where ip_hash = app_ip and created_at > now() - interval '1 hour') >= 5) then
    return jsonb_build_object('ok', false, 'rate_limited', true);
  end if;
  insert into public.career_applications (
    id, role_slug, role_title, full_name, email, location, availability, statement,
    resume_url, portfolio_url, resume_path, resume_filename, consent_version, ip_hash,
    us_work_authorization, us_sponsorship, work_arrangement, motivation, role_question, role_response,
    application_version, on_site_availability, relocation_willingness, relocation_assistance
  ) values (
    app_id, application ->> 'role_slug', application ->> 'role_title', application ->> 'full_name', app_email,
    application ->> 'location', application ->> 'availability', application ->> 'statement',
    application ->> 'resume_url', application ->> 'portfolio_url', application ->> 'resume_path',
    application ->> 'resume_filename', application ->> 'consent_version', app_ip,
    application ->> 'us_work_authorization', application ->> 'us_sponsorship',
    application ->> 'work_arrangement', application ->> 'motivation',
    application ->> 'role_question', application ->> 'role_response',
    application ->> 'application_version', application ->> 'on_site_availability',
    application ->> 'relocation_willingness', application ->> 'relocation_assistance'
  );
  return jsonb_build_object('ok', true, 'id', app_id);
end;
$$;

revoke all on function public.submit_career_application(jsonb) from public, anon, authenticated;
grant execute on function public.submit_career_application(jsonb) to service_role;
