# backend/app/api/routes/documents.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Annotated
from app.schemas.document import Document, DocumentCreate, DocumentReview
from app.repositories.document_repo import DocumentRepo
from app.services.case_service import CaseService
from app.core.deps import get_current_user, require_permission
from app.core.security import User, Permission
from app.repositories.audit_repo import AuditRepo
from datetime import datetime, timezone

repo = DocumentRepo()

router = APIRouter(tags=["documents"])

@router.post("/cases/{case_id}/documents/register", response_model=Document)
async def register_document(
    case_id: str,
    doc_in: DocumentCreate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    # FIX 3: Validate case exists before creating document
    await CaseService().get_case(case_id)

    data = doc_in.model_dump()
    data["case_id"] = case_id  # FIX 3: Force case_id from URL path
    data["uploaded_by"] = current_user.id
    data["uploaded_at"] = datetime.now(timezone.utc).isoformat()
    data["state"] = "pending"
    
    created = repo.create("documents", data)
    
    await AuditRepo().log_action(
        action="register_document",
        user=current_user.id,
        case_id=case_id,
        details={"type": data["document_type"]}
    )
    return created

@router.patch("/documents/{document_id}/review", response_model=Document)
async def review_document(
    document_id: str,
    review_in: DocumentReview,
    current_user: Annotated[User, Depends(require_permission(Permission.REVIEWER))]
):
     doc = repo.get_by_id("documents", document_id)
     if not doc:
         raise HTTPException(status_code=404, detail="Document not found")
         
     updates = {
         "state": review_in.state.value,
         "verified_by": current_user.id,
         "verified_at": datetime.now(timezone.utc).isoformat()
     }
     
     updated = repo.update("documents", document_id, updates)
     
     await AuditRepo().log_action(
        action="review_document",
        user=current_user.id,
        case_id=doc.get("case_id", ""),
        details={"new_state": review_in.state.value}
     )
     return updated
