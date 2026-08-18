# `app/schemas/` — API contract

My notes on this layer. These are the Pydantic models that describe what the API
*accepts* and what it *returns*. They are deliberately separate from `models/`, which
describes what the database stores.

## Why not just reuse the table models?

It's tempting — SQLModel classes are already Pydantic models, so a route can return
one directly. Three reasons not to:

1. **Different fields are appropriate in each direction.** Creating a project must not
   let the client pick the primary key. Reading one should include `id` and
   `created_at`. Updating one should treat every field as optional. That's three
   shapes for one table.
2. **New columns leak automatically.** Add `hashed_password` to `User`, and if a route
   returns the table model, that hash is in the JSON response the same day. Nothing
   warns you.
3. **Storage and contract change for different reasons.** Renaming a column shouldn't
   force every client to update. A schema layer is where that translation happens.

The rule: **a table model never crosses the router boundary.** Repositories return
table models; routes return schemas.

## The three-schema convention

For each resource, three classes:

| Schema | Direction | Contains |
|---|---|---|
| `XCreate` | request body on `POST` | Only what a client may set. No `id`, no timestamps. |
| `XUpdate` | request body on `PATCH` | Same fields, all `Optional`, so a partial update doesn't wipe what wasn't sent. |
| `XRead` | response | Everything safe to expose, including `id` and timestamps. |

`XRead` needs `model_config = ConfigDict(from_attributes=True)` so Pydantic can build
it from a SQLModel instance rather than a dict.

`XUpdate` pairs with `model_dump(exclude_unset=True)` in the repository — otherwise
fields the client omitted get written as `None` and a partial update silently becomes
a full overwrite.

## Files

### `base.py`

Shared building blocks.

`BaseSchema` is the common parent. `BaseDBMetadata` is meant to carry `id` and
`created_at` for read schemas.

**To fix (phase 1):** `BaseDBMetadata` is a plain Python class, not a Pydantic model.
Mixing it into a Pydantic model does nothing — the annotations are ignored and the
fields never appear. It needs to inherit from `pydantic.BaseModel` to have any effect.

### `project.py`

Schemas for the `Project` resource.

**To fix (phase 1) — this is the important one.** `ProjectBase` is currently used as
the `POST` request body and it declares `id: int` as required. Two consequences,
both verified:

- Posting without an `id` returns `422 Field required`.
- Posting with `id: 99` succeeds and creates the row with that id — the client is
  choosing the primary key.

`ProjectCreate` exists but nothing uses it, and it wouldn't work as-is: it has no
`slug`, which the table requires. `liveDemo` is on the model but missing from the
schema entirely, so it can't be set through the API.

The fix is the three-schema split above:

- `ProjectCreate` — `name`, `slug`, `description`, `tags`, `tech_stack`, `status`,
  the link fields, `featured`. No `id`.
- `ProjectUpdate` — the same, every field optional.
- `ProjectRead` — all of it plus `id`, `created_at`, `updated_at`.

## camelCase for the frontend

Python style wants `tech_stack`; the frontend wants `techStack`. Both are satisfied
without renaming Python attributes:

```python
from pydantic import ConfigDict
from pydantic.alias_generators import to_camel

class ProjectRead(BaseSchema):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )
```

`populate_by_name=True` means both spellings are accepted on input, so this can be
introduced without breaking anything already calling the API.

## Planned schemas

| File | Contents |
|---|---|
| `post.py` | `PostCreate` / `PostUpdate` / `PostRead`, plus a lighter `PostSummary` for list views that omits the full Markdown body. |
| `auth.py` | `LoginRequest`, `Token`, `TokenPayload`. |
| `contact.py` | `ContactCreate` with `EmailStr` validation and a honeypot field. |
| `common.py` | Generic `Page[T]` wrapper — `items`, `total`, `page`, `size`. |

## Adding a schema — checklist

1. Write `Create`, `Update` and `Read` — resist shipping only one.
2. `Read` gets `from_attributes=True`; `Update` makes every field optional.
3. Export from `__init__.py`.
4. Point the route's `response_model` at the `Read` schema, never at the table model.
5. Check `/docs` — the request body should not show `id`, and the response should not
   show anything that isn't meant to be public.
