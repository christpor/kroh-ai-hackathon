# 🏛️ Technical Architecture: KROH (ក្រោះ)
> **Deterministic Cyber Heuristics + Gemini 3.1 Lite Vernacular AI Engine**  
> **Team:** Team CHBAS (ច្បាស់ ច្បាស់) — AUPP - ITM Innovation Hackathon 2026

---

## 1. High-Level Architecture Diagram

```mermaid
graph TD
  User([Citizen on Telegram]) -->|Forward Link / Voice / Image / APK| Gateway[Node.js Telegraf Gateway]
  
  subgraph Stage 1 [Deterministic Heuristics - Sub-50ms / $0.00]
    Gateway --> Check{Payload Type}
    Check -->|URL| RDAP[RDAP DNS Age & Homoglyph Checker]
    Check -->|Slip/QR| EMV[Bakong EMVCo Checksum Validator]
    Check -->|File/APK| Hash[SHA256 Hash Stream Lookup]
  end

  subgraph Stage 2 [Vernacular AI Brain - Gemini 3.1 Lite / 180ms]
    RDAP & EMV & Hash -->|Nuanced / High Urgency| Gemini[Gemini 3.1 Lite Structured JSON]
    Check -->|Khmer Voice Note| AudioAI[Gemini Native Khmer Audio Transcription]
  end

  Gemini & AudioAI --> DB[(Supabase PostgreSQL)]
  Gemini --> Alert[Sub-300ms Spoken Khmer Audio + Text Alert]
  Alert --> User
  DB --> Radar[Live Threat Radar on Vercel]
```

---

## 2. Core Modules & Responsibilities
1. **`src/heuristics/domain_checker.js`**:
   - Queries RDAP protocol. If domain age is $<14\text{ days}$ and brand keyword belongs to ABA/Wing/Bakong $\rightarrow$ flag `HIGH_HAZARD` in 40ms.
2. **`src/heuristics/emvco_khqr.js`**:
   - Parses Bakong KHQR EMVCo payload format and calculates CRC16 checksum.
   - Detects altered QR codes pasted over physical merchant counters.
3. **`src/heuristics/hash_checker.js`**:
   - Streams Telegram file bytes into Node.js `crypto.createHash('sha256')`. Zero file saved to disk.
4. **`src/services/gemini.js`**:
   - Uses `@google/genai` with `gemini-2.5-flash` / `gemini-3.1-lite` at `temperature: 0.1`.
   - Returns strict JSON schema with risk score, category, and colloquial Khmer advice.

---

## 3. Web Admin Mission Control & Firebase Auth Security Boundary

```mermaid
graph TD
  classDef admin fill:#1e293b,stroke:#0ea5e9,stroke-width:2px,color:#fff;
  classDef auth fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff;
  classDef backend fill:#059669,stroke:#047857,stroke-width:2px,color:#fff;
  classDef edge fill:#6366f1,stroke:#4f46e5,stroke-width:2px,color:#fff;

  subgraph Operator Layer [👥 Team CHBAS Command]
    Por([Por • Lead Architect]):::admin
    Lundy([Lundy • Data Science]):::admin
    Heng([Heng • Audio Forensics]):::admin
    BotM([Bot • Software Eng]):::admin
  end

  subgraph Auth Gate [🔒 Zero-Trust Firebase Auth Gate]
    Por & Lundy & Heng & BotM -->|1. Sign in with Google| FireClient[Firebase Client SDK]:::auth
    FireClient -->|2. Send Bearer JWT Token| AuthCheck[Server Route /api/admin/*]:::auth
    AuthCheck -->|3. Verify Token & Whitelist| FireAdmin[Firebase Admin SDK]:::auth
  end

  subgraph Mission Control [💻 KROH Web Mission Control /admin]
    AuthCheck --> Tab1[📊 Live Threat Feed & 1-Click Takedowns]
    AuthCheck --> Tab2[🧠 Gemini System Prompt & Urgency Tuner]
    AuthCheck --> Tab3[🚫 Heuristic Blacklist & Bank Registry]
    AuthCheck --> Tab4[📈 Cost & Cache Hit Velocity Monitor]
  end

  subgraph Persistence & Core [⚡ Database & Hot-Reload Engine]
    Tab1 & Tab2 & Tab3 -->|Supabase Service Role Key| Supabase[(Supabase PostgreSQL)]:::backend
    Supabase -->|Hot-Reload 30s TTL Cache| BotCore[🤖 @KrohShieldBot on Cloud Run]:::edge
    Supabase -->|Public Broadcast View| Radar[🌐 Live Threat Radar on Vercel]:::edge
  end
```

### 3.1 Firebase Authentication & Strict Whitelisting
- **Google Sign-In with Domain & Email Whitelist**: Authentication is handled via Firebase Auth. Only emails explicitly listed in `ADMIN_ALLOWED_EMAILS` are granted administrative authorization.
- **Server-Side Token Verification**: Web API endpoints verify the Bearer token with `firebase-admin` before issuing commands or reading sensitive threat logs.
- **Role-Based Access Control (RBAC)**:
  - `owner` / `superadmin` (Christpor): System prompts, API keys, emergency kill-switch.
  - `analyst` (Lundy, Heng): Review scam audio transcripts, re-classify false positives, export MPTC reports.
  - `engineer` (Bot): Telemetry logs, webhook latency, database connection health.

### 3.2 Zero-Downtime Hot Reloading Architecture
- The Telegram bot core running on Google Cloud Run reads dynamic operational parameters from Supabase table `bot_runtime_config` (system prompts, urgency thresholds, blacklisted phone/bank accounts).
- **30-Second In-Memory Cache TTL**: The bot caches runtime configurations in memory for 30 seconds. When an administrator updates a prompt or adds a new fraudulent ABA bank account on `/admin`, all bot instances automatically sync the update within 30 seconds without restarting or redeploying containers.

### 3.3 1-Click Law Enforcement & MPTC Export
- When an administrator confirms an active zero-day phishing campaign on `/admin`, a single click formats the incident into an MPTC-compliant JSON payload (timestamp, domain registrar, IP host, victim screenshot hash) ready for automated dispatch to the Anti-Cybercrime Department.

---

## 4. Google Cloud Run High-Concurrency Engine & Fast-ACK Webhook

### 4.1 Production Hosting Topology (Singapore Edge)
To ensure sub-35ms ping latency for Cambodian citizens on Smart Axiata and Cellcard networks, all compute and data services are co-located in Singapore:
* **Web Frontend & Live Radar:** Vercel Edge Network (`sin1` Singapore).
* **Bot Gateway & Compute:** Google Cloud Run (`asia-southeast1` Singapore).
* **Telemetry Database:** Supabase PostgreSQL 15+ (`ap-southeast-1` Singapore).

### 4.2 Fast-ACK Webhook Pattern (Anti-Retry Storm)
Telegram Bot API enforces a strict 5-second HTTP timeout. If multimodal analysis of a fraudulent payment slip or audio file takes 1.5 seconds under high load, standard bots timeout, triggering Telegram to retry sending the update up to 3 times—leading to an exponential crash.
KROH implements the **Fast-ACK Architecture**:
1. **Instant Acknowledgment:** The Cloud Run webhook receives the Telegram update, validates the secret token, and returns `HTTP 200 OK` in **<15ms**.
2. **Asynchronous Background Pipeline:** The incoming payload (URL, image, voice note, or APK stream) is dispatched to the Stage 1 Heuristics and Stage 2 Gemini pipelines asynchronously.
3. **Proactive Telegram Outbound Push:** Once the Khmer voice note and risk verdict are generated, the engine proactively dispatches them to the chat via `telegram.sendMessage` / `telegram.sendVoice`.

### 4.3 Scale-to-Zero & 80-Concurrency Optimization
Following proven production standards from the **Kapi** project:
```bash
gcloud run deploy kroh-backend \
  --source . \
  --region asia-southeast1 \
  --allow-unauthenticated \
  --port 8080 \
  --min-instances=0 \
  --concurrency=80 \
  --no-cpu-boost \
  --memory 512Mi \
  --set-env-vars="NODE_ENV=production,REGION=asia-southeast1"
```
* **Zero Idle Cost (`--min-instances=0`):** Costs $0.00/month during low-traffic overnight hours.
* **Burst Scaling:** Each container handles up to **80 concurrent requests** simultaneously. When a viral scam hits large public groups, Cloud Run automatically scales to 10+ instances in seconds to absorb 800+ concurrent verifications.

### 4.4 Supabase PgBouncer Transaction Pooling
To prevent connection exhaustion when multiple serverless Cloud Run instances burst, all database traffic routes through Supabase's transaction pooler on **port 6543**. Over 10,000 serverless invocations safely multiplex across a clean pool of persistent PostgreSQL connections.

### 4.5 The 8-Tier Production Tech Stack
1. **Frontend:** Next.js 15 (App Router), React 18, Tailwind CSS, Lucide Icons.
2. **Typography:** Kantumruy Pro (Khmer 600 weight, `leading-[1.45]`), Inter.
3. **Identity & Auth:** Firebase Auth (Google Sign-In), Firebase Admin SDK, strict email whitelist.
4. **Bot Gateway:** Node.js 22 LTS, Fastify (70k+ req/sec), Telegraf.
5. **Compute & Edge:** Google Cloud Run (`asia-southeast1`), Vercel Edge (`sin1`).
6. **In-Memory Cache:** Node-Cache / Quick-LRU (30s config TTL), Node.js native `crypto`.
7. **Database:** Supabase PostgreSQL 15+, PgBouncer Transaction Pooler, Row-Level Security.
8. **Vernacular AI:** Google Gemini 3.1 Lite & 2.5 Flash (`@google/genai`).
