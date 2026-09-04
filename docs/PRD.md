# 🛠️ Product Requirements Document (PRD): KROH (ក្រោះ)
> **The Autonomous Real-Time Anti-Scam Shield for Cambodian Citizens**  
> **Repository:** [christpor/kroh-ai-hackathon](https://github.com/christpor/kroh-ai-hackathon)  
> **Team:** Team CHBAS (ច្បាស់ ច្បាស់) — AUPP - ITM Innovation Hackathon 2026  
> **Lead Architect & PM:** Christpor Rin (AI Engineer & Team Lead)

---

## 1. Executive Summary & Problem Framing
Every day in Cambodia, citizens lose millions of dollars to phishing links (`aba-bonus.top`), fake loan bots, cloned APKs, and manipulated social engineering voice notes on Telegram, Facebook, and SMS. Ordinary citizens and elderly users lack cybersecurity literacy, while banks and police only issue retrospective warnings weeks after the money is stolen.

**The Solution:** An autonomous, multimodal Telegram bot (`@KrohShieldBot`) and live public threat radar (`my-idea-for-hackathon.vercel.app`) that delivers sub-300ms vernacular Khmer verdicts.

---

## 2. In-Scope MVP Capabilities (1-Week Hackathon Sprint)

### A. 🤖 Multimodal Telegram Bot (`@KrohShieldBot`)
1. **Cloak-Piercing Link & Domain Parser:**
   - Extracts URLs from forwards and chats.
   - Performs sub-50ms RDAP/DNS registration age checks (<14 days = `HIGH_HAZARD`).
   - Detects disposable `.top`, `.cc`, and Cyrillic homoglyph tricks (`аba.com`).
2. **Screenshot & Payment Slip Forensics:**
   - Reads ABA Bank and NBC Bakong payment slips via Gemini 3.1 Lite Vision.
   - Cross-checks EMVCo KHQR checksums and known scammer account numbers.
   - Flags font misalignments, altered timestamps, and fake transaction IDs.
3. **Vernacular Khmer Voice Note Triage:**
   - Ingests forwarded voice notes and transcribes Khmer audio.
   - Detects urgency triggers (*"I am police/customs officer"*, *"Send OTP"*, *"Win lottery pay tax first"*).
   - **Voice-Back Verdict:** Responds with a 5-second spoken Khmer voice note so illiterate elders immediately understand the warning.
4. **Zero-Storage APK / File Hash Inspection:**
   - Evaluates `.apk`, `.pdf`, `.exe` attachments by calculating SHA256 hashes directly in RAM via the Telegram stream.
   - Cross-checks hashes against MalwareBazaar / VirusTotal API in <100ms.
   - **Zero file bytes stored on server disk.**
5. **Rose-Style Group Guardian Mode:**
   - When added to Telegram groups, stays completely silent during normal chit-chat.
   - Instantly auto-deletes malicious links and bans scammers in <15ms.

### B. 🌐 Live Community Threat Radar (`my-idea-for-hackathon.vercel.app`)
- Real-time interactive map of Cambodia showing active scam pins.
- Public search bar: *"Check any phone number, telegram handle, or link"*.
- Live telemetry counters: *Scams Blocked Today*, *Top Target Institutions*.

### C. 💻 Web Admin Mission Control (`/admin`)
1. **Zero-Trust Firebase Authentication:**
   - Secured by Firebase Auth (Google Sign-In) with strict email whitelist (`ADMIN_ALLOWED_EMAILS`).
   - Role-Based Access Control (RBAC): Superadmin (Por), Data Science (Lundy & Heng), Software Engineer (Bot).
2. **Live Threat Moderation & 1-Click Overrides:**
   - Real-time stream of incoming scam classifications with 1-click false-positive overrides.
   - 1-click incident packaging and automated export for MPTC Anti-Cybercrime reporting.
3. **AI Brain & Prompt Studio:**
   - Live browser tuning of Gemini 3.1 Lite system prompts, urgency sensitivity, and vernacular Khmer alert templates.
   - Dynamic hot-reloading across all Cloud Run bot instances with 30-second in-memory cache TTL.
4. **Deterministic Registry Manager:**
   - Instant addition and removal of blacklisted Cambodian phone numbers, ABA/Wing accounts, and phishing domains.

---

## 3. Explicit Non-Goals for Hackathon (Scope Control)
- ❌ **No Native Mobile App:** Zero time wasted building iOS/Android Kotlin/Swift apps. Telegram reaches 3M+ Cambodians instantly.
- ❌ **No Heavy Windows Sandboxing:** Zero heavy VMs or gigabytes of storage for dynamic `.exe` detonation.
- ❌ **No Mandatory User Login:** Zero passwords or sign-up friction. Anyone can forward a link and get protected immediately.
- ❌ **No PII Storage:** Chat payloads are evaluated in ephemeral RAM and wiped immediately. Zero private messages stored in PostgreSQL.

---

## 4. Acceptance Criteria & Verification Benchmarks
| Requirement | Acceptance Metric | Measurement Method |
| :--- | :--- | :--- |
| **Triage Latency** | $\le 300\text{ms}$ (P95) | Telegram webhook timestamp to verdict delivery |
| **Phishing Precision** | $\ge 98\%$ on 20 Ground-Truth Samples | Automated test suite in `docs/dataset/` |
| **Storage Footprint** | $\le 50\text{MB}$ total disk usage | Ephemeral streaming; 0 file saves |
| **Khmer Audio Clarity** | Clear spoken pronunciation | Verified by native Khmer speaker (Por/Team) |
