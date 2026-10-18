URL = "/api/v1/projects/"

def make_payload(**overrides):
    data = {
        "name": "My App",
        "description": "Test project",
        "status": "planned",
    }
    data.update(overrides)
    return data


async def create_project(client, **overrides):
    r = await client.post(URL, json=make_payload(**overrides))
    assert r.status_code in (200, 201), r.text
    return r.json()

async def test_list_empty(client):
    r = await client.get(URL)
    assert r.status_code == 200
    assert r.json() == {"items": [], "total": 0, "page": 1, "size": 20, "pages":0}


async def test_create_project(client):
    created = await create_project(client, name="My App")
    assert created["id"] == 1
    assert created["slug"] == "my-app"


async def test_create_duplicate_name_gets_unique_slug(client):
    first = await create_project(client, name="My App")
    second = await create_project(client, name="My App")
    assert first["slug"] == "my-app"
    assert second["slug"] == "my-app-2"


async def test_slug_turkish_characters(client):
    created = await create_project(client, name="Çılgın Şişe")
    assert created["slug"] == "cilgin-sise"


async def test_get_by_id(client):
    created = await create_project(client)
    r = await client.get(f"{URL}{created['id']}")
    assert r.status_code == 200
    assert r.json()["name"] == "My App"


async def test_get_by_slug(client):
    created = await create_project(client, name="My App")
    r = await client.get(f"{URL}slug/{created['slug']}")
    assert r.status_code == 200
    assert r.json()["id"] == created["id"]


async def test_get_not_found(client):
    r = await client.get(f"{URL}999")
    assert r.status_code == 404


async def test_create_invalid_status_returns_422(client):
    r = await client.post(URL, json=make_payload(status="bogus"))
    assert r.status_code == 422


async def test_create_missing_name_returns_422(client):
    r = await client.post(URL, json={"description": "x", "status": "planned"})
    assert r.status_code == 422


async def test_create_extra_field_returns_422(client):
    r = await client.post(URL, json=make_payload(slug="hacked"))
    assert r.status_code == 422   # extra="forbid"


async def test_pagination(client):
    for i in range(5):
        await create_project(client, name=f"Project {i}")

    r = await client.get(URL, params={"page": 1, "size": 2})
    body = r.json()
    assert body["total"] == 5
    assert body["pages"] == 3
    assert len(body["items"]) == 2

    r = await client.get(URL, params={"page": 3, "size": 2})
    assert len(r.json()["items"]) == 1   # son sayfada 1 kayıt


async def test_pagination_invalid_params(client):
    assert (await client.get(URL, params={"page": 0})).status_code == 422
    assert (await client.get(URL, params={"size": 101})).status_code == 422


async def test_put_replaces_resource(client):
    created = await create_project(client, name="My App", tags=["a"])
    r = await client.put(
        f"{URL}{created['id']}",
        json=make_payload(name="New Name", description="New desc", status="completed"),
    )
    assert r.status_code == 200
    body = r.json()
    assert body["name"] == "New Name"
    assert body["status"] == "completed"
    assert body["tags"] == []                  # gönderilmedi, varsayılana döndü
    assert body["slug"] == created["slug"]     # slug değişmez


async def test_put_by_slug(client):
    created = await create_project(client, name="My App")
    r = await client.put(
        f"{URL}slug/{created['slug']}",
        json=make_payload(name="Renamed", status="archived"),
    )
    assert r.status_code == 200
    assert r.json()["name"] == "Renamed"


async def test_put_nonexistent_id_creates_new_project(client):
    r = await client.put(f"{URL}999", json=make_payload(name="Brand New"))
    assert r.status_code == 200
    assert r.json()["name"] == "Brand New"

    # İstenen id (999) yok sayılır, sunucu kendi id'sini verir
    assert r.json()["id"] != 999
    assert (await client.get(URL)).json()["total"] == 1


async def test_put_partial_body_returns_422(client):
    created = await create_project(client)
    r = await client.put(f"{URL}{created['id']}", json={"name": "Only name"})
    assert r.status_code == 422


async def test_patch_updates_only_given_fields(client):
    created = await create_project(client, name="My App", description="Old")
    r = await client.patch(f"{URL}{created['id']}", json={"description": "New"})
    assert r.status_code == 200

    got = (await client.get(f"{URL}{created['id']}")).json()
    assert got["description"] == "New"
    assert got["name"] == "My App"             # dokunulmadı
    assert got["slug"] == created["slug"]


async def test_patch_cannot_change_slug(client):
    created = await create_project(client)
    r = await client.patch(f"{URL}{created['id']}", json={"slug": "hacked"})
    assert r.status_code == 422                # extra="forbid"


async def test_patch_not_found(client):
    r = await client.patch(f"{URL}999", json={"description": "x"})
    assert r.status_code == 404


async def test_delete_project(client):
    created = await create_project(client)
    r = await client.delete(f"{URL}{created['id']}")
    assert r.status_code in (200, 204)
    assert (await client.get(f"{URL}{created['id']}")).status_code == 404


async def test_delete_not_found(client):
    r = await client.delete(f"{URL}999")
    assert r.status_code == 404

async def test_get_by_slug_not_found(client):
    assert (await client.get(f"{URL}slug/nope")).status_code == 404

async def test_put_by_slug_nonexistent_creates(client):
    r = await client.put(f"{URL}slug/nope", json=make_payload(name="X"))
    assert r.status_code == 200

async def test_patch_by_slug(client):
    created = await create_project(client, name="My App", description="Old")
    r = await client.patch(f"{URL}slug/{created['slug']}", json={"description": "New"})
    assert r.status_code == 200
    got = (await client.get(f"{URL}{created['id']}")).json()
    assert got["description"] == "New"

async def test_patch_by_slug_not_found(client):
    r = await client.patch(f"{URL}slug/nope", json={"description": "x"})
    assert r.status_code == 404