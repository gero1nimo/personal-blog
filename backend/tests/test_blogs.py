import asyncio

PUBLIC_URL = "/api/v1/blogs/"
ADMIN_URL = "/api/v1/admin/blogs/"


def make_payload(**overrides):
    data = {"title": "Merhaba Dünya", "summary": "Özet",
            "content": "kelime " * 450, "tags": ["python", "api"],
            "isPublished": True}
    data.update(overrides)
    return data


async def create_blog(client, **overrides):
    r = await client.post(ADMIN_URL, json=make_payload(**overrides))
    assert r.status_code == 200
    return r.json()


async def tick():
    """created_at değerleri birbirinden farklı çıksın diye kısa bekleme."""
    await asyncio.sleep(0.01)


# ---------------------------------------------------------------- ADMIN: create

async def test_create_blog(client):
    data = await create_blog(client)
    assert data["title"] == "Merhaba Dünya"
    assert data["slug"] == "merhaba-dunya"
    assert data["readingTime"] == 3          # 450 kelime / 200 -> 3
    assert data["isPublished"] is True
    assert data["featured"] is False
    assert data["tags"] == ["python", "api"]


async def test_create_blog_defaults(client):
    r = await client.post(ADMIN_URL, json={"title": "T", "summary": "S", "content": "c"})
    assert r.status_code == 200
    data = r.json()
    assert data["isPublished"] is False
    assert data["featured"] is False
    assert data["tags"] == []
    assert data["coverImgUrl"] is None


async def test_create_blog_unique_slug(client):
    a = await create_blog(client)
    b = await create_blog(client)
    assert a["slug"] == "merhaba-dunya"
    assert b["slug"] == "merhaba-dunya-2"


async def test_create_blog_turkish_slug(client):
    data = await create_blog(client, title="Çok Güzel Şeyler")
    assert data["slug"] == "cok-guzel-seyler"


async def test_create_blog_short_content_reading_time_is_one(client):
    data = await create_blog(client, content="kısa")
    assert data["readingTime"] == 1


async def test_create_blog_missing_title_422(client):
    payload = make_payload()
    del payload["title"]
    r = await client.post(ADMIN_URL, json=payload)
    assert r.status_code == 422


async def test_create_blog_empty_content_422(client):
    r = await client.post(ADMIN_URL, json=make_payload(content=""))
    assert r.status_code == 422


async def test_create_blog_extra_field_422(client):
    r = await client.post(ADMIN_URL, json=make_payload(foo="bar"))
    assert r.status_code == 422


async def test_create_blog_client_cannot_set_server_fields(client):
    r = await client.post(ADMIN_URL, json=make_payload(slug="benim-slug"))
    assert r.status_code == 422
    r = await client.post(ADMIN_URL, json=make_payload(readingTime=99))
    assert r.status_code == 422


# ------------------------------------------------------------------ ADMIN: read

async def test_admin_get_by_id_and_slug_include_drafts(client):
    blog = await create_blog(client, isPublished=False)

    r = await client.get(f"{ADMIN_URL}{blog['id']}")
    assert r.status_code == 200
    assert r.json()["slug"] == blog["slug"]

    r = await client.get(f"{ADMIN_URL}slug/{blog['slug']}")
    assert r.status_code == 200
    assert r.json()["id"] == blog["id"]


async def test_admin_get_not_found(client):
    assert (await client.get(f"{ADMIN_URL}999")).status_code == 404
    assert (await client.get(f"{ADMIN_URL}slug/yok")).status_code == 404


async def test_admin_list_includes_drafts(client):
    await create_blog(client, title="Yayında")
    await create_blog(client, title="Taslak", isPublished=False)

    r = await client.get(ADMIN_URL)
    assert r.status_code == 200
    data = r.json()
    assert data["total"] == 2
    assert {i["title"] for i in data["items"]} == {"Yayında", "Taslak"}
    assert "content" in data["items"][0]


# ------------------------------------------------------ ADMIN: put/patch/delete

async def test_put_replaces_and_recalculates_reading_time(client):
    blog = await create_blog(client)
    r = await client.put(f"{ADMIN_URL}{blog['id']}",
                         json=make_payload(title="Yeni", content="kısa metin"))
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == blog["id"]
    assert data["title"] == "Yeni"
    assert data["readingTime"] == 1
    assert data["slug"] == blog["slug"]       # slug değişmez


async def test_put_by_slug(client):
    blog = await create_blog(client)
    r = await client.put(f"{ADMIN_URL}slug/{blog['slug']}",
                         json=make_payload(summary="Başka özet"))
    assert r.status_code == 200
    assert r.json()["summary"] == "Başka özet"


async def test_put_nonexistent_creates_new(client):
    r = await client.put(f"{ADMIN_URL}999", json=make_payload(title="Sıfırdan"))
    assert r.status_code == 200
    assert r.json()["slug"] == "sifirdan"


async def test_put_partial_body_422(client):
    blog = await create_blog(client)
    r = await client.put(f"{ADMIN_URL}{blog['id']}", json={"title": "Sadece başlık"})
    assert r.status_code == 422


async def test_patch_partial_update(client):
    blog = await create_blog(client)
    r = await client.patch(f"{ADMIN_URL}{blog['id']}", json={"featured": True})
    assert r.status_code == 200
    data = r.json()
    assert data["featured"] is True
    assert data["title"] == blog["title"]


async def test_patch_recalculates_reading_time_only_when_content_changes(client):
    blog = await create_blog(client)

    r = await client.patch(f"{ADMIN_URL}{blog['id']}", json={"title": "Yeni Başlık"})
    assert r.json()["readingTime"] == 3

    r = await client.patch(f"{ADMIN_URL}{blog['id']}", json={"content": "kısa metin"})
    assert r.json()["readingTime"] == 1


async def test_patch_by_slug(client):
    blog = await create_blog(client)
    r = await client.patch(f"{ADMIN_URL}slug/{blog['slug']}", json={"summary": "Güncel"})
    assert r.status_code == 200
    assert r.json()["summary"] == "Güncel"


async def test_patch_cannot_change_slug(client):
    blog = await create_blog(client)
    r = await client.patch(f"{ADMIN_URL}{blog['id']}", json={"slug": "yeni"})
    assert r.status_code == 422


async def test_patch_and_delete_not_found(client):
    assert (await client.patch(f"{ADMIN_URL}999", json={"featured": True})).status_code == 404
    assert (await client.patch(f"{ADMIN_URL}slug/yok", json={"featured": True})).status_code == 404
    assert (await client.delete(f"{ADMIN_URL}999")).status_code == 404


async def test_delete_blog(client):
    blog = await create_blog(client)
    r = await client.delete(f"{ADMIN_URL}{blog['id']}")
    assert r.status_code == 204
    assert (await client.get(f"{ADMIN_URL}{blog['id']}")).status_code == 404
    assert (await client.delete(f"{ADMIN_URL}{blog['id']}")).status_code == 404


# --------------------------------------------------------------- PUBLIC: list

async def test_list_empty(client):
    r = await client.get(PUBLIC_URL)
    assert r.status_code == 200
    assert r.json() == {"items": [], "total": 0, "page": 1, "size": 20, "pages": 0}


async def test_list_returns_only_published_newest_first(client):
    await create_blog(client, title="Birinci")
    await tick()
    await create_blog(client, title="Taslak", isPublished=False)
    await tick()
    await create_blog(client, title="İkinci")

    r = await client.get(PUBLIC_URL)
    assert r.status_code == 200
    data = r.json()
    assert data["total"] == 2
    assert [i["title"] for i in data["items"]] == ["İkinci", "Birinci"]


async def test_list_items_have_no_content(client):
    await create_blog(client)
    item = (await client.get(PUBLIC_URL)).json()["items"][0]
    assert "content" not in item
    assert item["slug"] == "merhaba-dunya"
    assert item["readingTime"] == 3


async def test_list_pagination(client):
    for n in range(3):
        await create_blog(client, title=f"Yazı {n}")
        await tick()

    data = (await client.get(PUBLIC_URL, params={"page": 2, "size": 2})).json()
    assert data["total"] == 3
    assert data["pages"] == 2
    assert len(data["items"]) == 1

    assert (await client.get(PUBLIC_URL, params={"page": 0})).status_code == 422
    assert (await client.get(PUBLIC_URL, params={"size": 101})).status_code == 422


# ------------------------------------------------------- PUBLIC: single blog

async def test_draft_hidden_from_public_until_published(client):
    blog = await create_blog(client, isPublished=False)

    assert (await client.get(f"{PUBLIC_URL}{blog['id']}")).status_code == 404
    assert (await client.get(f"{PUBLIC_URL}slug/{blog['slug']}")).status_code == 404

    await client.patch(f"{ADMIN_URL}{blog['id']}", json={"isPublished": True})

    r = await client.get(f"{PUBLIC_URL}{blog['id']}")
    assert r.status_code == 200
    r = await client.get(f"{PUBLIC_URL}slug/{blog['slug']}")
    assert r.status_code == 200
    assert "content" in r.json()


async def test_public_get_not_found(client):
    assert (await client.get(f"{PUBLIC_URL}999")).status_code == 404
    assert (await client.get(f"{PUBLIC_URL}slug/yok")).status_code == 404


# ------------------------------------------------------------ PUBLIC: tags

async def test_tag_filter_exact_match(client):
    await create_blog(client, title="A", tags=["python"])
    await tick()
    await create_blog(client, title="B", tags=["fastapi"])

    r = await client.get(PUBLIC_URL, params={"tag": "python"})
    assert [i["title"] for i in r.json()["items"]] == ["A"]
    assert r.json()["total"] == 1

    r = await client.get(PUBLIC_URL, params={"tag": "py"})     # kısmi eşleşme yok
    assert r.json()["items"] == []
    assert r.json()["total"] == 0


async def test_tag_filter_ignores_drafts(client):
    await create_blog(client, title="Taslak", tags=["python"], isPublished=False)
    r = await client.get(PUBLIC_URL, params={"tag": "python"})
    assert r.status_code == 200
    assert r.json()["items"] == []
