# backend/app/api/routes/family_links.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Annotated
from app.schemas.family_link import FamilyLink, FamilyLinkCreate, FamilyLinkReview
from app.repositories.family_link_repo import FamilyLinkRepo
from app.repositories.audit_repo import AuditRepo
from app.core.deps import get_current_user, require_permission
from app.core.security import User, Permission
from datetime import datetime, timezone

repo = FamilyLinkRepo()

router = APIRouter(tags=["family_links"])

@router.post("/cases/{case_id}/family-links", response_model=FamilyLink)
async def add_family_link(
    case_id: str,
    link_in: FamilyLinkCreate,
    current_user: Annotated[User, Depends(get_current_user)]
):
    data = link_in.model_dump()
    data["created_at"] = datetime.now(timezone.utc).isoformat()
    # Enforce rules similar to evidence
    if current_user.role == "refugee":
        data["link_status"] = "declared"
    else:
        data["link_status"] = "declared" # standard default
        
    # FIX 4: Use repo.insert() — FamilyLinkRepo has no .create()
    created = await repo.insert(data)
    # FIX 4: Use AuditRepo().log_action() instead of repo.add_audit_log()
    # FIX 4: Use data["relation"] — schema field is "relation" not "relation_type"
    await AuditRepo().log_action(
        action="create_family_link",
        user=current_user.id,
        case_id=case_id,
        details={"relation": data["relation"]}
    )
    return created

@router.patch("/family-links/{link_id}", response_model=FamilyLink)
async def update_family_link(
    link_id: str,
    review_in: FamilyLinkReview,
    current_user: Annotated[User, Depends(require_permission(Permission.REVIEWER))]
):
     # FIX 4: Use repo.find_by_id() and repo.update() (new methods added to FamilyLinkRepo)
     link = await repo.find_by_id(link_id)
     if not link:
         raise HTTPException(status_code=404, detail="Link not found")
         
     updates = {"link_status": review_in.link_status.value}
     updated = await repo.update(link_id, updates)
     
     # FIX 4: Use AuditRepo().log_action() instead of repo.add_audit_log()
     await AuditRepo().log_action(
        action="update_family_link",
        user=current_user.id,
        case_id=link.get("case_id", ""),
        details={"new_status": review_in.link_status.value}
    )
     return updated
