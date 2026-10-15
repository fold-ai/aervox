-- Additive upgrade: existing applications remain unchanged and readable.
-- Legacy submissions remain valid during the production deployment transition.
alter table public.career_applications
  add column us_work_authorization text check (us_work_authorization in ('yes', 'no', 'unsure', 'outside_us')),
  add column us_sponsorship text check (us_sponsorship in ('not_required', 'required', 'unsure', 'outside_us')),
  add column work_arrangement text check (work_arrangement in ('onsite_and_field', 'onsite', 'hybrid', 'remote', 'discuss')),
  add column motivation text check (length(motivation) between 20 and 2000),
  add column role_question text check (length(role_question) between 20 and 1000),
  add column role_response text check (length(role_response) between 20 and 3000),
  add constraint career_questions_v2_required check (
    consent_version <> '2026-10-14-v2' or (
      us_work_authorization is not null and us_sponsorship is not null and
      work_arrangement is not null and motivation is not null and
      role_question is not null and role_response is not null
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
    us_work_authorization, us_sponsorship, work_arrangement, motivation, role_question, role_response
  ) values (
    app_id, application ->> 'role_slug', application ->> 'role_title', application ->> 'full_name', app_email,
    application ->> 'location', application ->> 'availability', application ->> 'statement',
    application ->> 'resume_url', application ->> 'portfolio_url', application ->> 'resume_path',
    application ->> 'resume_filename', application ->> 'consent_version', app_ip,
    application ->> 'us_work_authorization', application ->> 'us_sponsorship',
    application ->> 'work_arrangement', application ->> 'motivation',
    application ->> 'role_question', application ->> 'role_response'
  );
  return jsonb_build_object('ok', true, 'id', app_id);
end;
$$;

revoke all on function public.submit_career_application(jsonb) from public, anon, authenticated;
grant execute on function public.submit_career_application(jsonb) to service_role;
