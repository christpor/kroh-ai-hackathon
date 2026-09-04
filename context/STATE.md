# ⚡ STATE.md — Short-Term Working Memory & Sprint State
> **Project:** KROH (ក្រោះ) — Autonomous Citizen Anti-Scam Shield  
> **Team:** Team CHBAS (ច្បាស់ ច្បាស់) • AUPP - ITM Innovation Hackathon 2026  
> **Last Updated:** 2026-09-05T01:45:00+07:00 • Phnom Penh, Cambodia

---

## 🎯 1. Active Sprint Status
* **Sprint Goal:** 1-Week Hackathon MVP — Multimodal Telegram Shield + Web Admin Mission Control.
* **Latest Verified Commit:** `2548a39` (`docs: streamline README with linear-grade aesthetics...`)
* **Repository:** [`https://github.com/christpor/kroh-ai-hackathon`](https://github.com/christpor/kroh-ai-hackathon) (Public)
* **Current Phase:** README Polished & Cleaned ➔ Backend Bot Gateway Scaffolding

---

## 📋 2. Immediate Next 3 Tasks (Workstream Queue)
1. **[TASK-1] Scaffold Bot Ingestion Gateway (`src/bot/`):**
   - Node.js 22 LTS + Fastify + Telegraf with 15ms Fast-ACK webhook pattern (`HTTP 200 OK`).
   - Async background dispatch for Gemini multimodal inspection.
2. **[TASK-2] Supabase Hot-Reload Cache Client (`src/services/config.js`):**
   - 30-second in-memory TTL caching over `bot_runtime_config` table.
   - Hot-reload prompt instructions and blacklisted bank accounts without container restart.
3. **[TASK-3] Scaffold Web Admin Mission Control (`src/admin/`):**
   - Next.js 15 App Router `/admin` with Firebase Auth Google Sign-In.
   - Server-side Bearer token verification against `ADMIN_ALLOWED_EMAILS`.

---

## 🛑 3. Active Blockers & Critical Constraints
* **Blockers:** None. Schema v2.0 (`docs/schema.sql`) and [`docs/ERD.md`](../docs/ERD.md) are locked.
* **Hard Rule 1:** Cloud Run deployment must strictly use `--min-instances=0 --no-cpu-boost` (zero idle compute bill).
* **Hard Rule 2:** Telegram bot webhook must fast-ACK within 20ms to prevent Telegram retry loops.
* **Hard Rule 3:** Ephemeral RAM streaming for all files (`.apk`, `.pdf`); 0 bytes saved to container disk.
* **Hard Rule 4:** 0-PII Salted HMAC (`HMAC_SHA256(chat_id, TELEGRAM_SALT_SECRET)`—never raw numeric IDs).
* **Hard Rule 5:** Append-Only DB Security (`admin_audit_logs` has zero UPDATE/DELETE permissions).
