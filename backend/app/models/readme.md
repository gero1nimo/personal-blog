# `app/models/` — Database tables

My notes on this layer. These are the SQLModel classes that define what actually
exists in the database. This is the single source of truth for the schema: Alembic
will generate migrations by comparing these classes against the live database.

## What belongs here — and what doesn't

| Belongs here | Belongs elsewhere |
|---|---|
| Column definitions, types, defaults | Request/response shapes → `schemas/` |
| Indexes and unique constraints | Queries → `repositories/` |
| Relationships between tables | Business rules → `services/` |
| Table names | HTTP concerns → `api/` |

A model describes *storage*. If I catch myself writing validation that's really about
what a client is allowed to send, it belongs in `schemas/` instead.

A model class **must never be returned from a route**. Every column here becomes
public the moment it is, and that is exactly how a `hashed_password` ends up in a JSON
response. Routes return read schemas.

## Files

### `base.py`

`BaseModel` — the fields every table shares. Subclasses inherit them instead of
repeating them.

Note this is *not* `pydantic.BaseModel`; it's a SQLModel class with the same name.
When both are in scope, import one under an alias.

`BaseModel` has no `table=True`, so it creates no table of its own — it's a mixin.
Only subclasses that declare `table=True` become real tables.

**To fix (phase 1):** it currently forces a `name` column on every model. That was a
convenience, not a design decision — a contact message or a tag doesn't need one. The
base should carry only `id`, `created_at` and `updated_at`; `name` moves down to the
models that actually want it. `updated_at` is missing and needs adding before the blog
ships, since posts show a "last updated" date.

### `project.py`

`Project` — one entry in the projects catalogue. Table: `projects`.

| Field | Notes |
|---|---|
| `id` | Primary key, assigned by the database. Never accepted from a client. |
| `name` | Display title. |
| `slug` | Unique and indexed. Used for clean URLs like `/projects/my-app`. |
| `description` | Longer text shown on the detail page. |
| `tags` | List, stored as a JSON column. |
| `techStack` | List, stored as a JSON column. |
| `status` | Free text today; should become an enum. |
| `link`, `githubLink`, `liveDemo` | Optional outbound URLs. |
| `featured` | Whether it appears on the landing page. |
| `created_at` | Set by the model, UTC. |

**Why `sa_column=Column(JSON)` for the list fields:** SQLite has no array type.
PostgreSQL's `ARRAY` compiles fine on Postgres and fails outright on SQLite, so `JSON`
is the portable choice. On Postgres this should become `JSONB`, which is indexable.

If filtering by tag ever needs to be fast, the right answer is a proper `Tag` table
with a many-to-many link rather than querying inside a JSON column.

**To fix (phase 1):** `techStack`, `githubLink` and `liveDemo` are camelCase, which
Python style says should be `tech_stack`, `github_link`, `live_demo`. The frontend
still wants camelCase JSON — that's handled with a Pydantic alias generator in
`schemas/`, not by naming Python attributes this way.

## Planned models

| Model | Purpose |
|---|---|
| `Post` | Blog articles — title, slug, summary, Markdown content, cover image, tags, draft/published state, `published_at`, reading time. |
| `User` | The single admin account. Email, hashed password, `is_active`, `is_admin`. No public registration endpoint — the account is created by a script. |
| `ContactMessage` | Submissions from the contact form, plus the sender's IP and a read flag. |
| `Profile` | The structured CV content — experience, education, skills. |

## Adding a model — checklist

1. Create the class here, inheriting `BaseModel` and declaring `table=True`.
2. Export it from `__init__.py` so Alembic and `metadata.create_all` can see it.
   A model that is never imported is invisible to both.
3. Add matching `Create` / `Update` / `Read` schemas in `schemas/`.
4. Add a repository subclass in `repositories/` for any model-specific query.
5. Generate a migration — **not** `create_all`, which cannot alter an existing table.
6. Write the tests before wiring the routes.
