-- ========================================================================
-- 🛡️ KROH (ក្រោះ) TELEMETRY & THREAT RADAR DATABASE SCHEMA (v2.0)
-- Target Database: PostgreSQL 15+ (Supabase with PgBouncer)
-- Standard: Zero-PII HMAC Salted Hashing & Append-Only Audit Integrity
-- Documentation: docs/ERD.md
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Threat Telemetry Log Table (All incoming evaluated threats)
CREATE TABLE IF NOT EXISTS public.threat_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reported_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    reporter_hmac TEXT NOT NULL, -- HMAC-SHA256(chat_id + SECRET) (0-PII anonymity)
    channel VARCHAR(32) NOT NULL DEFAULT 'telegram_bot', -- 'telegram_bot', 'web_radar', 'group_guardian'
    vector VARCHAR(32) NOT NULL, -- 'url', 'receipt_slip', 'voice_note', 'text_message', 'apk_hash', 'khqr'
    raw_content_preview TEXT, -- Truncated, sanitized snippet
    content_sha256 TEXT NOT NULL, -- Dedup fingerprint
    risk_score NUMERIC(5,2) NOT NULL CHECK (risk_score >= 0.00 AND risk_score <= 100.00),
    verdict VARCHAR(24) NOT NULL, -- 'SAFE', 'SUSPICIOUS', 'HIGH_HAZARD'
    confidence NUMERIC(4,3) NOT NULL DEFAULT 0.950,
    ai_explanation_kh TEXT NOT NULL, -- Vernacular spoken Khmer alert
    ai_explanation_en TEXT, -- English summary
    provinces_code VARCHAR(16) DEFAULT 'KHM-12', -- Default Phnom Penh for map pin
    status VARCHAR(24) NOT NULL DEFAULT 'active_threat', -- 'active_threat', 'neutralized', 'false_positive'
    metadata JSONB DEFAULT '{}'::jsonb -- Domain age, EMVCo status, OCR tokens
);

-- 2. Fast Heuristic Threat Indicators Cache (Sub-50ms matching)
CREATE TABLE IF NOT EXISTS public.threat_indicators (
    indicator_value TEXT PRIMARY KEY, -- e.g. 'aba-bonus.top', '012345678', 'a6f5e2...'
    indicator_type VARCHAR(24) NOT NULL, -- 'domain', 'phone_number', 'telegram_handle', 'bank_account', 'sha256_hash'
    first_detected_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    last_detected_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    occurrence_count INTEGER NOT NULL DEFAULT 1,
    global_risk_tier VARCHAR(16) NOT NULL DEFAULT 'HIGH', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    associated_campaign TEXT DEFAULT 'CAM_FIN_FRAUD_2026'
);

-- 3. Bot Dynamic Runtime Configuration (30-Second TTL Hot Reload)
CREATE TABLE IF NOT EXISTS public.bot_runtime_config (
    config_key VARCHAR(64) PRIMARY KEY,
    config_value JSONB NOT NULL,
    updated_by VARCHAR(128) NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW()),
    cache_ttl_seconds INTEGER NOT NULL DEFAULT 30
);

-- 4. Admin Audit Logs (Append-Only Immutable Ledger)
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_email VARCHAR(128) NOT NULL,
    action_type VARCHAR(48) NOT NULL,
    target_resource_id TEXT,
    previous_state JSONB,
    new_state JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Dataset Benchmarks (Data Science & ML Training Hub for Lundy & Heng)
CREATE TABLE IF NOT EXISTS public.dataset_benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telemetry_id UUID NOT NULL REFERENCES public.threat_telemetry(id) ON DELETE CASCADE,
    ground_truth_label VARCHAR(24) NOT NULL, -- 'SCAM', 'LEGITIMATE'
    attack_subcategory VARCHAR(48) NOT NULL, -- 'PHISHING_URL', 'FAKE_SLIP', 'VOICE_EXTORTION'
    feature_vector JSONB NOT NULL DEFAULT '{}'::jsonb,
    verified_by VARCHAR(128) NOT NULL,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. Law Enforcement & MPTC Takedown Dispatches
CREATE TABLE IF NOT EXISTS public.takedown_dispatches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    telemetry_id UUID NOT NULL REFERENCES public.threat_telemetry(id) ON DELETE CASCADE,
    destination VARCHAR(48) NOT NULL DEFAULT 'MPTC_CYBERCRIME',
    status VARCHAR(24) NOT NULL DEFAULT 'QUEUED', -- 'QUEUED', 'SENT', 'ACKNOWLEDGED'
    payload_snapshot JSONB NOT NULL,
    dispatched_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. Live Radar Metrics Rollup
CREATE TABLE IF NOT EXISTS public.radar_metrics_hourly (
    bucket TIMESTAMPTZ PRIMARY KEY,
    scams_blocked_count INTEGER NOT NULL DEFAULT 0,
    total_scans_processed INTEGER NOT NULL DEFAULT 0,
    avg_latency_ms INTEGER NOT NULL DEFAULT 210
);

-- ========================================================================
-- INDEXES & PERFORMANCE OPTIMIZATION
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_threat_telemetry_reported_at ON public.threat_telemetry (reported_at DESC);
CREATE INDEX IF NOT EXISTS idx_threat_telemetry_sha256 ON public.threat_telemetry (content_sha256);
CREATE INDEX IF NOT EXISTS idx_threat_telemetry_metadata_gin ON public.threat_telemetry USING GIN (metadata);
CREATE INDEX IF NOT EXISTS idx_threat_indicators_type ON public.threat_indicators (indicator_type);
CREATE INDEX IF NOT EXISTS idx_dataset_benchmarks_label ON public.dataset_benchmarks (ground_truth_label);

-- ========================================================================
-- SECURITY & ACCESS CONTROL POLICIES (RLS)
-- ========================================================================
ALTER TABLE public.threat_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_runtime_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dataset_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.takedown_dispatches ENABLE ROW LEVEL SECURITY;

-- Enforce Append-Only on Audit Logs (Zero update/delete permitted)
REVOKE UPDATE, DELETE, TRUNCATE ON public.admin_audit_logs FROM public, authenticated, anon;

-- Public Anonymous Read View (Strips HMACs, PII, and internal forensics)
CREATE OR REPLACE VIEW public.public_threat_feed AS
SELECT 
    id,
    reported_at,
    vector,
    risk_score,
    verdict,
    ai_explanation_kh,
    provinces_code,
    status
FROM public.threat_telemetry
WHERE status = 'active_threat'
ORDER BY reported_at DESC;

-- Grant public read access to the sanitized view
GRANT SELECT ON public.public_threat_feed TO anon, authenticated;
