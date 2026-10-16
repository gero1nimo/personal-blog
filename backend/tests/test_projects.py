URL = "/api/v1/projects/"

async def test_list_empty(client):
    r = await client.get(URL)
    assert r.status_code == 200
    assert r.json() == {"items": [], "total": 0, "page": 1, "size": 20, "pages":0}