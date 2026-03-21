create table if not exists hangout_groups (
  id          uuid primary key default gen_random_uuid(),
  hangout_id  uuid references hangouts(id) on delete cascade not null,
  group_id    uuid references friend_groups(id) on delete cascade not null,
  created_at  timestamptz default now(),
  unique(hangout_id, group_id)
);

alter table hangout_groups enable row level security;
create policy "Users manage own hangout groups" on hangout_groups
  for all using (
    exists (
      select 1 from hangouts
      where hangouts.id = hangout_groups.hangout_id
        and hangouts.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from hangouts
      where hangouts.id = hangout_groups.hangout_id
        and hangouts.user_id = auth.uid()
    )
  );
