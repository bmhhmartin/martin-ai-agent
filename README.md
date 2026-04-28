# NestJS AI Agent Backend

Production-ready NestJS backend for a ChatGPT-like agent with persistent conversation memory in Supabase PostgreSQL.

## Features

- `POST /chat` endpoint with request validation
- AI responses from OpenAI (or OpenAI-compatible API via `OPENAI_BASE_URL`)
- Supabase-backed chat memory (`chat_history`)
- Context-aware replies using last 10 messages
- Clean modular architecture for SaaS-scale extension
- Tool-ready scaffold for future weather/search integrations

## Project Structure

```text
src/
 ├── app.module.ts
 ├── chat/
 │    ├── chat.controller.ts
 │    ├── chat.service.ts
 │    └── dto/chat-request.dto.ts
 ├── ai/
 │    └── ai.service.ts
 ├── memory/
 │    └── memory.service.ts
 ├── supabase/
 │    └── supabase.client.ts
 ├── tools/
 │    └── tool.service.ts
 └── main.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file:

```bash
cp .env.example .env
```

3. Fill required env vars in `.env`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- Optional: `OPENAI_MODEL`, `OPENAI_BASE_URL`, `PORT`

4. Create DB table in Supabase SQL editor with:

```sql
-- from supabase/schema.sql
create table if not exists public.chat_history (
  id bigserial primary key,
  user_message text not null,
  ai_response text not null,
  created_at timestamptz not null default now()
);
```

## Run

```bash
npm run build
npm run start:dev
```

## API

### `POST /chat`

Request:

```json
{
  "message": "Hi, what did we discuss before?"
}
```

Response:

```json
{
  "reply": "..."
}
```
