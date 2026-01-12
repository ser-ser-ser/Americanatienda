create table if not exists contact_messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  email text not null,
  message text not null,
  read boolean default false
);

-- Allow public to insert messages (for the contact form)
alter table contact_messages enable row level security;

create policy "Allow public insert"
  on contact_messages for insert
  with check (true);

-- Allow authenticated users (admin) to view messages
create policy "Allow admin select"
  on contact_messages for select
  using (auth.role() = 'authenticated');
