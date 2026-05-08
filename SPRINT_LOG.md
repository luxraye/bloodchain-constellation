# Bloodchain — Sprint Log
*Running record of work done, decisions made, and blockers per session.*

---

## Sprint 1 — 2026-05-08
**Phase:** 0 (Foundation)  
**Goal:** Plan established; begin Phase 0 deployment work

### Completed
- Full codebase orientation: read currentstatus.md, PILOT-ROLLOUT-CHECKLIST.md, fabricrollback.md, render.yaml, bloodchain-core/HANDOVER.md
- Created `BLOODCHAIN_MASTER_PLAN.md` — master transformation roadmap
- Created `OPEN_ISSUES.md` — consolidated all known issues from three source documents into prioritized list
- Created `DECISIONS.md` — permanent decision log seeded with six founding decisions
- Created `SPRINT_LOG.md` (this file)

### In Progress
- Phase 0 deployment (Render blueprint execution) — blocked on env var setup (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY needed)

### Blockers
- Render deployment requires live Supabase project credentials — confirm these exist before proceeding
- Confirm Botswana NBTS / MoH contact research has been started or assign

### Next Session Priority
1. ISBT-128 in Scyther Phlebotomy page (OPEN_ISSUES H1 + H2) — quick win, completes Mission 3
2. Render deployment — set env vars and trigger first deploy
3. Secrets audit — `git grep` for credentials

---

*Add new sprints above this line in reverse chronological order.*
