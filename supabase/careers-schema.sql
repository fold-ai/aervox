-- Careers records are accessible only to the trusted application server and
-- authorized administrators in the Supabase dashboard.
create table public.career_applications (
  id uuid primary key,
  created_at timestamptz not null default now(),
  role_slug text not null check (length(role_slug) between 1 and 100),
  role_title text not null,
  full_name text not null check (length(full_name) between 1 and 120),
  email text not null check (length(email) between 3 and 254),
  location text not null check (length(location) between 1 and 160),
  availability text,
  us_work_authorization text check (us_work_authorization in ('yes', 'no', 'unsure', 'outside_us')),
  us_sponsorship text check (us_sponsorship in ('not_required', 'required', 'unsure', 'outside_us')),
  work_arrangement text check (work_arrangement in ('onsite_and_field', 'onsite', 'hybrid', 'remote', 'discuss')),
  motivation text check (length(motivation) between 20 and 2000),
  role_question text check (length(role_question) between 20 and 1000),
  role_response text check (length(role_response) between 20 and 3000),
  statement text not null check (length(statement) between 20 and 5000),
  resume_url text,
  portfolio_url text,
  resume_path text,
  resume_filename text,
  consent_at timestamptz not null default now(),
  consent_version text not null,
  ip_hash text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'interview', 'offered', 'closed')),
  internal_notes text,
  constraint career_questions_v2_required check (
    consent_version <> '2026-10-14-v2' or (
      us_work_authorization is not null and us_sponsorship is not null and
      work_arrangement is not null and motivation is not null and
      role_question is not null and role_response is not null
    )
  ),
  constraint career_resume_required check (resume_url is not null or resume_path is not null)
);

alter table public.career_applications enable row level security;
revoke all on public.career_applications from anon, authenticated;
grant all on public.career_applications to service_role;
create index career_applications_status_created_idx on public.career_applications (status, created_at desc);
create index career_applications_email_created_idx on public.career_applications (email, created_at desc);
create index career_applications_ip_created_idx on public.career_applications (ip_hash, created_at desc) where ip_hash is not null;

-- Private PDF resumes have no public read/upload policies.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('career-resumes', 'career-resumes', false, 3145728, array['application/pdf']);

create function public.submit_career_application(application jsonb)
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
