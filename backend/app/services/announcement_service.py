"""Announcement service."""

from __future__ import annotations

from app.repositories.announcement_repo import AnnouncementRepo


class AnnouncementService:
    def __init__(self) -> None:
        self.repo = AnnouncementRepo()

    async def list_announcements(self, case_id: str) -> list:
        return await self.repo.find_by_case(case_id)

    async def create_announcement(self, data: dict, posted_by: str | None = None) -> dict:
        return await self.repo.insert({**data, "posted_by": posted_by})
