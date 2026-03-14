"""Integration smoke-test: create a case then create a referral on it."""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

HEADERS = {"X-Demo-Username": "auth_manager"}


def test_create_case_then_referral():
    # Create a new case
    res = client.post(
        "/cases",
        json={
            "person_id": "new",
            "person": {"name": "Test"},
            "status": "intake_created",
        },
        headers=HEADERS,
    )
    assert res.status_code == 200, f"POST /cases failed: {res.text}"
    case = res.json()
    cid = case["case_id"]

    # Create a referral on that case
    res = client.post(
        f"/cases/{cid}/referrals",
        json={
            "case_id": cid,
            "referral_type": "referral",
            "from_agency": "UNHCR",
            "to_agency": "Country X",
            "reason": "Passed",
        },
        headers=HEADERS,
    )
    assert res.status_code == 200, f"POST /cases/{cid}/referrals failed: {res.text}"
