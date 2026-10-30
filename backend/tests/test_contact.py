import asyncio

import pytest

PUBLIC_URL = "/api/v1/contact/"
ADMIN_URL = "/api/v1/admin/contact/"


def make_payload(**overrides):
    data = {"name": "Ayşe Yılmaz", "email": "ayse@example.com",
            "subject": "Merhaba", "message": "Sitenizi çok beğendim."}
    data.update(overrides)
    return data


async def send(anon_client, **overrides):
    return await anon_client.post(PUBLIC_URL, json=make_payload(**overrides))


async def tick():
    """created_at değerleri birbirinden farklı çıksın diye kısa bekleme."""
    await asyncio.sleep(0.01)


async def create_message(anon_client, client, **overrides) -> dict:
    """Public uçtan mesaj gönderir, admin listesinden en yeni kaydı döndürür."""
    r = await send(anon_client, **overrides)
    assert r.status_code == 201
    await tick()
    items = (await client.get(ADMIN_URL)).json()["items"]
    return items[0]


# ================================================================ PUBLIC: POST /contact

async def test_send_message_returns_201_and_ok_only(anon_client):
    r = await send(anon_client)
    assert r.status_code == 201
    assert r.json() == {"ok": True}          # id, isRead vb. ziyaretçiye sızmaz


async def test_send_message_is_stored(anon_client, client):
    await send(anon_client)
    page = (await client.get(ADMIN_URL)).json()
    assert page["total"] == 1
    item = page["items"][0]
    assert item["name"] == "Ayşe Yılmaz"
    assert item["email"] == "ayse@example.com"
    assert item["subject"] == "Merhaba"
    assert item["message"] == "Sitenizi çok beğendim."
    assert item["isRead"] is False


async def test_send_message_needs_no_token(anon_client):
    assert (await send(anon_client)).status_code == 201


async def test_honeypot_filled_returns_same_response_but_stores_nothing(anon_client, client):
    r = await send(anon_client, website="http://spam.example")
    assert r.status_code == 201
    assert r.json() == {"ok": True}          # bot farkı anlamasın
    assert (await client.get(ADMIN_URL)).json()["total"] == 0


async def test_empty_honeypot_is_a_normal_message(anon_client, client):
    await send(anon_client, website="")
    assert (await client.get(ADMIN_URL)).json()["total"] == 1


async def test_website_field_is_never_stored_or_exposed(anon_client, client):
    await send(anon_client)
    item = (await client.get(ADMIN_URL)).json()["items"][0]
    assert "website" not in item


async def test_whitespace_is_stripped(anon_client, client):
    await send(anon_client, name="  Ayşe  ", subject="  Konu ", message="  Mesaj  ")
    item = (await client.get(ADMIN_URL)).json()["items"][0]
    assert (item["name"], item["subject"], item["message"]) == ("Ayşe", "Konu", "Mesaj")


@pytest.mark.parametrize("email", ["abc", "abc@", "@example.com", "a b@example.com", ""])
async def test_invalid_email_422(anon_client, email):
    assert (await send(anon_client, email=email)).status_code == 422


@pytest.mark.parametrize("field", ["name", "email", "subject", "message"])
async def test_missing_field_422(anon_client, field):
    payload = make_payload()
    del payload[field]
    assert (await anon_client.post(PUBLIC_URL, json=payload)).status_code == 422


@pytest.mark.parametrize("field", ["name", "subject", "message"])
@pytest.mark.parametrize("value", ["", "   "])
async def test_blank_field_422(anon_client, field, value):
    assert (await send(anon_client, **{field: value})).status_code == 422


@pytest.mark.parametrize("field,limit", [("name", 50), ("subject", 50), ("message", 1000)])
async def test_length_limits(anon_client, field, limit):
    assert (await send(anon_client, **{field: "a" * limit})).status_code == 201
    assert (await send(anon_client, **{field: "a" * (limit + 1)})).status_code == 422


async def test_email_too_long_422(anon_client):
    too_long = "a" * 250 + "@example.com"
    assert (await send(anon_client, email=too_long)).status_code == 422


@pytest.mark.parametrize("extra", [{"isRead": True}, {"is_read": True}, {"id": 5}, {"foo": "bar"}])
async def test_unknown_or_forbidden_fields_422(anon_client, extra):
    r = await anon_client.post(PUBLIC_URL, json=make_payload(**extra))
    assert r.status_code == 422


async def test_non_json_body_422(anon_client):
    assert (await anon_client.post(PUBLIC_URL, content="düz metin")).status_code == 422


async def test_public_contact_is_write_only(anon_client):
    assert (await anon_client.get(PUBLIC_URL)).status_code == 405
    assert (await anon_client.delete(f"{PUBLIC_URL}1")).status_code in (404, 405)


# ================================================================ ADMIN: koruma

@pytest.mark.parametrize("method,url", [
    ("GET", ADMIN_URL), ("GET", f"{ADMIN_URL}1"),
    ("PATCH", f"{ADMIN_URL}1"), ("DELETE", f"{ADMIN_URL}1"),
])
async def test_admin_contact_requires_token(anon_client, method, url):
    r = await anon_client.request(method, url, json={"isRead": True} if method == "PATCH" else None)
    assert r.status_code == 401


# ================================================================ ADMIN: GET liste

async def test_list_empty(client):
    r = await client.get(ADMIN_URL)
    assert r.status_code == 200
    assert r.json() == {"items": [], "total": 0, "page": 1, "size": 20, "pages": 0}


async def test_list_newest_first(anon_client, client):
    for subject in ("ilk", "ikinci", "ucuncu"):
        await send(anon_client, subject=subject)
        await tick()
    items = (await client.get(ADMIN_URL)).json()["items"]
    assert [i["subject"] for i in items] == ["ucuncu", "ikinci", "ilk"]


async def test_list_pagination(anon_client, client):
    for n in range(5):
        await send(anon_client, subject=f"konu {n}")
        await tick()
    p1 = (await client.get(ADMIN_URL, params={"page": 1, "size": 2})).json()
    p3 = (await client.get(ADMIN_URL, params={"page": 3, "size": 2})).json()
    assert p1["total"] == 5 and p1["pages"] == 3 and len(p1["items"]) == 2
    assert len(p3["items"]) == 1
    assert [i["subject"] for i in p1["items"]] == ["konu 4", "konu 3"]
    assert (await client.get(ADMIN_URL, params={"page": 4, "size": 2})).json()["items"] == []


@pytest.mark.parametrize("params", [{"page": 0}, {"size": 0}, {"size": 101}, {"page": "x"}])
async def test_list_invalid_pagination_422(client, params):
    assert (await client.get(ADMIN_URL, params=params)).status_code == 422


async def test_list_filter_by_is_read(anon_client, client):
    for subject in ("a", "b", "c"):
        await send(anon_client, subject=subject)
        await tick()
    items = (await client.get(ADMIN_URL)).json()["items"]
    read_one = next(i for i in items if i["subject"] == "b")
    await client.patch(f"{ADMIN_URL}{read_one['id']}", json={"isRead": True})

    everything = (await client.get(ADMIN_URL)).json()
    unread = (await client.get(ADMIN_URL, params={"is_read": "false"})).json()
    read = (await client.get(ADMIN_URL, params={"is_read": "true"})).json()

    assert everything["total"] == 3               # süzgeç yok -> hepsi (None != False)
    assert unread["total"] == 2
    assert {i["subject"] for i in unread["items"]} == {"a", "c"}
    assert read["total"] == 1
    assert read["items"][0]["subject"] == "b"


async def test_list_filter_with_pagination_counts_filtered_total(anon_client, client):
    for n in range(3):
        await send(anon_client, subject=f"k{n}")
    r = (await client.get(ADMIN_URL, params={"is_read": "false", "size": 2})).json()
    assert r["total"] == 3 and r["pages"] == 2 and len(r["items"]) == 2


async def test_list_filter_invalid_value_422(client):
    assert (await client.get(ADMIN_URL, params={"is_read": "belki"})).status_code == 422


# ================================================================ ADMIN: GET tekli

async def test_get_message_by_id(anon_client, client):
    created = await create_message(anon_client, client)
    r = await client.get(f"{ADMIN_URL}{created['id']}")
    assert r.status_code == 200
    assert r.json() == created
    assert set(r.json()) == {"id", "createdAt", "updatedAt", "name", "email",
                             "subject", "message", "isRead"}


async def test_get_message_not_found_404(client):
    assert (await client.get(f"{ADMIN_URL}999")).status_code == 404


# ================================================================ ADMIN: PATCH

async def test_patch_marks_read_and_unread(anon_client, client):
    created = await create_message(anon_client, client)
    url = f"{ADMIN_URL}{created['id']}"

    r = await client.patch(url, json={"isRead": True})
    assert r.status_code == 200
    assert r.json()["isRead"] is True
    assert (await client.get(url)).json()["isRead"] is True      # kalıcı

    r = await client.patch(url, json={"isRead": False})
    assert r.json()["isRead"] is False
    assert (await client.get(url)).json()["isRead"] is False


async def test_patch_leaves_other_fields_untouched(anon_client, client):
    created = await create_message(anon_client, client)
    r = await client.patch(f"{ADMIN_URL}{created['id']}", json={"isRead": True})
    for key in ("name", "email", "subject", "message", "createdAt"):
        assert r.json()[key] == created[key]


async def test_patch_not_found_404(client):
    assert (await client.patch(f"{ADMIN_URL}999", json={"isRead": True})).status_code == 404


@pytest.mark.parametrize("body", [{}, {"isRead": "belki"}, {"name": "Hacker"}, {"isRead": True, "message": "x"}])
async def test_patch_invalid_body_422(anon_client, client, body):
    created = await create_message(anon_client, client)
    assert (await client.patch(f"{ADMIN_URL}{created['id']}", json=body)).status_code == 422


# ================================================================ ADMIN: DELETE

async def test_delete_message(anon_client, client):
    created = await create_message(anon_client, client)
    url = f"{ADMIN_URL}{created['id']}"
    r = await client.delete(url)
    assert r.status_code == 204
    assert r.content == b""
    assert (await client.get(url)).status_code == 404
    assert (await client.get(ADMIN_URL)).json()["total"] == 0


async def test_delete_only_removes_target(anon_client, client):
    await send(anon_client, subject="kalsın")
    await tick()
    target = await create_message(anon_client, client, subject="silinsin")
    await client.delete(f"{ADMIN_URL}{target['id']}")
    items = (await client.get(ADMIN_URL)).json()["items"]
    assert [i["subject"] for i in items] == ["kalsın"]


async def test_delete_not_found_404(client):
    assert (await client.delete(f"{ADMIN_URL}999")).status_code == 404
    assert (await client.delete(f"{ADMIN_URL}abc")).status_code == 422
