# backend/app/schemas/case.py
from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional, Any

class CaseStatus(str, Enum):
    INTAKE_CREATED = "intake_created"
    EVIDENCE_PENDING = "evidence_pending"
    PROVISIONAL_IDENTITY = "provisional_identity"
    REVIEW_REQUIRED = "review_required"
    VERIFIED_FOR_HANDOFF = "verified_for_handoff"
    REFERRED = "referred"
    SERVICE_IN_PROGRESS = "service_in_progress"

class CaseBase(BaseModel):
    intake_location: Optional[str] = None
    owner_agency: Optional[str] = None

class CaseCreate(CaseBase):
    # Accept either a nested person dict OR a bare person_id (tests use person_id)
    person: Optional[dict] = None
    person_id: Optional[str] = None
    status: Optional[str] = "intake_created"

class Case(CaseBase):
    id: str
    person_id: str
    case_code: str
    current_status: CaseStatus = CaseStatus.INTAKE_CREATED
    opened_at: str
    closed_at: Optional[str] = None
    created_by: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
