import os
import sys

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import main
import rate_limit
from services import bills_api, voting_api, google_civic_api


@pytest.fixture(autouse=True)
def fresh_rate_limits():
    rate_limit._buckets.clear()
    yield
    rate_limit._buckets.clear()


client = TestClient(main.app)


# -----------------------
# Core routes
# -----------------------

def test_root_and_health():
    assert client.get("/").json() == {"status": "running"}

    health = client.get("/health").json()
    assert health["status"] == "ok"
    assert "openai_configured" in health


def test_ask_returns_fallback_without_openai_key():
    res = client.get("/ask", params={"question": "Can police search my car?"})
    assert res.status_code == 200

    data = res.json()
    assert "answer" in data
    assert "source" in data


def test_ask_rejects_oversized_question():
    res = client.get("/ask", params={"question": "x" * 3000})
    assert res.status_code == 400


def test_ask_rate_limits_after_ten_requests():
    for _ in range(10):
        assert client.get("/ask", params={"question": "hi"}).status_code == 200

    assert client.get("/ask", params={"question": "hi"}).status_code == 429


def test_lobbying_returns_list():
    res = client.get("/lobbying")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


# -----------------------
# Legal search
# -----------------------

def test_find_relevant_section_matches_keywords():
    section = main.find_relevant_section("Can police search my car without a warrant?")
    assert section is not None
    assert "content" in section


def test_find_relevant_section_handles_gibberish():
    # No keywords match; the function must not raise
    main.find_relevant_section("zzzz qqqq xxxx")


# -----------------------
# Rate limiter unit behavior
# -----------------------

def test_rate_limiter_is_per_ip():
    for _ in range(10):
        assert not rate_limit.is_rate_limited("1.1.1.1")
    assert rate_limit.is_rate_limited("1.1.1.1")
    assert not rate_limit.is_rate_limited("2.2.2.2")


# -----------------------
# External services parse real-shaped payloads (requests mocked)
# -----------------------

class FakeResponse:
    def __init__(self, payload, status=200):
        self._payload = payload
        self.status_code = status

    def json(self):
        return self._payload


def test_search_bills_builds_canonical_links(monkeypatch):
    payload = {"objects": [{
        "title": "A Bill",
        "summary": "Sum",
        "current_status": "passed",
        "congress": 118,
        "bill_type": "hr",
        "number": 1234,
    }]}
    monkeypatch.setattr(bills_api.requests, "get", lambda *a, **k: FakeResponse(payload))

    results = bills_api.search_bills("anything")
    assert results[0]["link"] == "https://www.govtrack.us/congress/bills/118/hr1234"


def test_search_votes_filters_locally_and_links(monkeypatch):
    payload = {"objects": [
        {"question": "On Passage of the Privacy Act", "result": "Passed",
         "created": "2026-01-01", "congress": 118, "session": 2026,
         "chamber": "house", "number": 55},
        {"question": "Unrelated motion", "result": "Failed",
         "created": "2026-01-02", "congress": 118, "session": 2026,
         "chamber": "senate", "number": 56},
    ]}
    monkeypatch.setattr(voting_api.requests, "get", lambda *a, **k: FakeResponse(payload))

    results = voting_api.search_votes("privacy")
    assert len(results) == 1
    assert results[0]["link"] == "https://www.govtrack.us/congress/votes/118-2026/h55"


def test_representatives_falls_back_to_local_data(monkeypatch):
    # No API key configured in tests -> the local politicians fallback runs
    monkeypatch.setattr(google_civic_api, "API_KEY", None)

    results = google_civic_api.get_representatives("")
    assert isinstance(results, list)
    assert results, "politicians.json fallback should return entries"
    assert {"name", "role", "party", "state"} <= set(results[0])
