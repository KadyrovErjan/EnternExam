-- Students enter these values themselves during registration; group/mentor catalogues remain optional admin metadata.
alter table public.profiles add column if not exists group_name text;
alter table public.profiles add column if not exists mentor_name text;

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,full_name,email,direction,group_name,mentor_name)
  values(
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name',''),
    new.email,
    (new.raw_user_meta_data->>'direction')::public.direction,
    nullif(trim(new.raw_user_meta_data->>'group_name'),''),
    nullif(trim(new.raw_user_meta_data->>'mentor_name'),'')
  );
  return new;
end;
$$;
