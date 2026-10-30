from tests.test_contact import ADMIN_URL, PUBLIC_URL, make_payload

LIMIT = 5   # api/v1/contact.py -> @limiter.limit("5/minute")


async def test_contact_limit_blocks_after_threshold(anon_client, rate_limit_on):
    for _ in range(LIMIT):
        assert (await anon_client.post(PUBLIC_URL, json=make_payload())).status_code == 201
    r = await anon_client.post(PUBLIC_URL, json=make_payload())
    assert r.status_code == 429


async def test_blocked_request_is_not_stored(anon_client, client, rate_limit_on):
    for n in range(LIMIT + 3):
        await anon_client.post(PUBLIC_URL, json=make_payload(subject=f"k{n}"))
    # admin okuması sınırdan etkilenmez; yalnızca izin verilen kadar mesaj kaydedilmiş olmalı
    assert (await client.get(ADMIN_URL)).json()["total"] == LIMIT


async def test_honeypot_requests_also_count_toward_limit(anon_client, rate_limit_on):
    for _ in range(LIMIT):
        await anon_client.post(PUBLIC_URL, json=make_payload(website="spam"))
    r = await anon_client.post(PUBLIC_URL, json=make_payload())
    assert r.status_code == 429


async def test_invalid_requests_do_not_count(anon_client, rate_limit_on):
    # gövde doğrulaması (422) sınırlayıcıdan önce çalışır; kayıt yazılmadığı için sorun değil
    for _ in range(LIMIT * 2):
        assert (await anon_client.post(PUBLIC_URL, json=make_payload(email="gecersiz"))).status_code == 422
    assert (await anon_client.post(PUBLIC_URL, json=make_payload())).status_code == 201


async def test_admin_routes_are_not_rate_limited(client, rate_limit_on):
    for _ in range(LIMIT * 3):
        assert (await client.get(ADMIN_URL)).status_code == 200


async def test_limit_is_off_by_default_in_tests(anon_client):
    for _ in range(LIMIT * 2):
        assert (await anon_client.post(PUBLIC_URL, json=make_payload())).status_code == 201
