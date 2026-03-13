from fastapi.testclient import TestClient
from app.main import app
import builtins

# Force unbuffered output immediately
import sys
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

print("Init TestClient...")
client = TestClient(app)

print("POST /cases")
case = client.post("/cases", json={
    "person_id": "new",
    "person": {"name": "Test"},
    "status": "intake_created"
}).json()
cid = case["case_id"]
print("Created:", cid)

print(f"POST /cases/{cid}/referrals")
res = client.post(f"/cases/{cid}/referrals", json={
    "case_id": cid,
    "referral_type": "referral",
    "from_agency": "UNHCR",
    "to_agency": "Country X",
    "reason": "Passed"
})
print("Referral Status:", res.status_code)
print("Referral Body:", res.text)
