"""Document repository."""

from __future__ import annotations

from app.repositories.json_store import JsonStore


class DocumentRepo:
    TABLE = "documents"

    def __init__(self, store: JsonStore | None = None) -> None:
        self.store = store or JsonStore()

    async def find_by_case(self, case_id: str) -> list[dict]:
        return [
            item for item in self.store.load(self.TABLE)
            if item.get("case_id") == case_id
        ]

    async def insert(self, data: dict) -> dict:
        payload = {
            "id": self.store.next_uuid(),
            "case_id": data["case_id"],
            "filename": data["filename"],
            "doc_type": data.get("doc_type"),
            "storage_path": data.get("storage_path"),
            "uploaded_at": self.store.utcnow(),
        }
        return self.store.insert(self.TABLE, payload)
