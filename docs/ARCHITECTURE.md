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
