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
