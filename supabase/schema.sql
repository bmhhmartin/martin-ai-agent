create table if not exists public.chat_history (
  id bigserial primary key,
  user_message text not null,
  ai_response text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_history_created_at
  on public.chat_history (created_at desc);
