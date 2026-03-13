# BorderBridge

> Identity confidence scoring and case management for displaced populations.

## Stack
- **Frontend:** HTML / CSS / JS (vanilla)
- **Backend:** FastAPI (Python)
- **Database:** Supabase (PostgreSQL)
- **Scoring Engine:** Random Forest / XGBoost

## Quick Start

### Run frontend
```bash
# Use any local server, e.g.
cd frontend
python -m http.server 3000
```
Then open `http://localhost:3000` in your browser.

### Run backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API will be at `http://127.0.0.1:8000`. Docs at `http://127.0.0.1:8000/docs`.

### Database
1. Create a Supabase project
2. Run `db/schema.sql` in Supabase SQL editor
3. Run `db/seed.sql` to populate demo data
4. Copy your Supabase URL and anon key into `.env`

## Environment Variables
Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

## System Roles & Permissions

BorderBridge has three primary user types, mapped to specific dashboards and capabilities, with further internal permission levels for Authorities and Partners.

### 1. Authority (Immigration & Border Officials)
Authorities manage cases, review evidence, and use the Identity Confidence Engine to process applications. 

**Internal Permission Levels:**
- **`intake_officer`**: Creates new cases, conducts initial interviews, and logs official/corroborated evidence.
- **`reviewer`**: Reviews and validates evidence submitted by refugees or field officers. Can update the "trust class" of an evidence item.
- **`case_manager`**: Full oversight of a case. Can trigger score recomputations, manage referrals to partners, and transition cases through major status changes (e.g., *Under Review* → *Provisional Identity*).
- **`communications_publisher`**: Authorized to broadcast one-way announcements to targeted refugee groups.

### 2. Refugee (Displaced Persons)
Refugees use the **Refugee Self-Service Portal** to participate in their own case building, ensuring transparency and agency.

**Capabilities & Restrictions:**
- **CAN submit**: Profile details, family member declarations, education claims, employment skills, and support needs.
- **CAN view**: Their own case status, latest announcements, and notifications from authorities.
- **CANNOT do**: Refugees cannot directly verify themselves, overwrite accepted official data, or trigger formal state transitions. All refugee-submitted data enters the system as `self_declared` and must be accepted by a `reviewer` before it impacts their identity confidence score.

### 3. Partner (NGOs, Aid Agencies)
Partners collaborate with Authorities to provide targeted services (housing, medical, education, employment).

**Internal Permission Levels:**
- **`partner_service_officer`**: Manages the referrals assigned to their specific agency (e.g., an employment NGO updating a referral). They can also post relevant, targeted service announcements to the refugee portal.

## Team
| Person | Area | Branch |
|--------|------|--------|
| Person 1 | Authority dashboard + case detail UI | `feature/frontend-authority` |
| Person 2 | Refugee portal + partner dashboard UI | `feature/frontend-refugee-partner` |
| Person 3 | FastAPI backend + API integration | `feature/backend-api` |
| Person 4 | Database schema + ML scoring | `feature/data-ml` |

## Branch Model
```
main   → demo-safe only
dev    → integration branch
feature/* → individual work
```
Only the integrator merges `dev → main`.
