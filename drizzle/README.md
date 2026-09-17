# Database

## Setup

1. Get your Supabase Postgres connection string:
   Supabase Dashboard → Project Settings → Database → Connection string → URI (Transaction pooler)

2. Add to `.env`:
   ```
   DATABASE_URL=postgresql://postgres.[project-id]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
   ```

## Commands

| Command               | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `bun run db:generate` | Generate SQL migration from schema changes    |
| `bun run db:push`     | Push schema directly to DB (development only) |
| `bun run db:migrate`  | Apply pending migrations                      |
| `bun run db:seed`     | Seed products and categories                  |
| `bun run db:studio`   | Open Drizzle Studio GUI                       |

## After schema changes

1. Edit `drizzle/schema.ts`
2. Run `bun run db:generate` to create migration SQL
3. Run `bun run db:migrate` to apply
4. Regenerate Supabase types: `supabase gen types typescript --project-id [id] > src/integrations/supabase/types.ts`

## RLS Policies

RLS policies are in `supabase/migrations/001_rls_policies.sql`.
Apply them via Supabase Dashboard → SQL Editor, or with the Supabase CLI:

```
supabase db push
```

## Auth Trigger

`supabase/migrations/002_auth_trigger.sql` — creates a profile row automatically when a new user signs up.
Apply via SQL Editor.
