const crypto = require("crypto");

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload, null, 2));
}

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => { raw += chunk; });
    req.on("end", () => {
      try { resolve(raw ? JSON.parse(raw) : {}); }
      catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}

const EVALUATOR_VERSION = process.env.HARMONIC_EVALUATOR_VERSION || "1.2-v11";

function header(req, name) {
  return req.headers?.[name] || req.headers?.[name.toLowerCase()] || null;
}

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function collectStatements(packet, path) {
  return normalizeArray(path(packet)).map((item) => {
    if (typeof item === "string") return item;
    return item?.statement || item?.claim || item?.description || item?.message || "";
  }).filter(Boolean);
}

function getFreshness(packet) {
  const lastVerifiedAt = packet?.truth?.last_verified_at || packet?.declared_state?.last_verified_at || packet?.state?.last_verified_at;
  const staleAfterMinutes = asNumber(packet?.truth?.stale_after_minutes || packet?.stabilization_policy?.stale_after_minutes, 0);
  if (!lastVerifiedAt || staleAfterMinutes <= 0) return { stale: false, age_minutes: null, stale_after_minutes: staleAfterMinutes || null };
  const verifiedAtMs = new Date(lastVerifiedAt).getTime();
  if (!Number.isFinite(verifiedAtMs)) return { stale: true, age_minutes: null, stale_after_minutes: staleAfterMinutes, invalid_timestamp: true };
  const ageMinutes = Math.max(0, Math.round((Date.now() - verifiedAtMs) / 60000));
  return { stale: ageMinutes > staleAfterMinutes, age_minutes: ageMinutes, stale_after_minutes: staleAfterMinutes };
}

function detectContradiction(packet) {
  const declared = collectStatements(packet, (p) => p?.truth?.claims || p?.declared_state?.claims || p?.declared_state?.current_state_claims);
  const observed = collectStatements(packet, (p) => p?.truth?.observations || p?.observed_state?.signals || p?.observed_reality?.signals);
  const declaredText = declared.join(" ").toLowerCase();
  const observedText = observed.join(" ").toLowerCase();
  if (!declaredText || !observedText) return false;

  const stableTerms = ["stable", "valid", "verified", "safe", "approved", "clear", "ready", "authorized", "consistent", "grounded"];
  const unstableTerms = ["unstable", "invalid", "unverified", "unsafe", "revoked", "blocked", "conflict", "contradiction", "deterioration", "failure", "degraded", "stale", "missing"];
  return stableTerms.some((term) => declaredText.includes(term)) && unstableTerms.some((term) => observedText.includes(term));
}

function evaluateStability(packet) {
  const findings = [];
  let score = 100;

  const claims = collectStatements(packet, (p) => p?.truth?.claims || p?.declared_state?.claims || p?.declared_state?.current_state_claims);
  const observations = collectStatements(packet, (p) => p?.truth?.observations || p?.observed_state?.signals || p?.observed_reality?.signals);
  const evidence = normalizeArray(packet?.truth?.evidence || packet?.evidence);
  const unresolvedContradictions = normalizeArray(packet?.truth?.unresolved_contradictions || packet?.unresolved_contradictions);
  const freshness = getFreshness(packet);
  const contradiction = detectContradiction(packet) || unresolvedContradictions.length > 0;

  if (!packet?.packet_id) {
    score -= 8;
    findings.push({ axis: "truth", code: "missing_packet_id", severity: "warn", message: "Packet does not include a packet_id." });
  }
  if (claims.length === 0) {
    score -= 22;
    findings.push({ axis: "truth", code: "missing_truth_claims", severity: "warn", message: "No declared truth/state claims were supplied." });
  }
  if (observations.length === 0 && evidence.length === 0) {
    score -= 28;
    findings.push({ axis: "truth", code: "missing_observed_evidence", severity: "warn", message: "No observations or evidence were supplied for reality coupling." });
  }
  if (freshness.invalid_timestamp) {
    score -= 18;
    findings.push({ axis: "truth", code: "invalid_verification_timestamp", severity: "warn", message: "The verification timestamp could not be parsed." });
  } else if (freshness.stale) {
    score -= 24;
    findings.push({ axis: "truth", code: "stale_truth_basis", severity: "warn", message: "Truth basis is older than the configured freshness window.", age_minutes: freshness.age_minutes, stale_after_minutes: freshness.stale_after_minutes });
  }
  if (contradiction) {
    score -= 46;
    findings.push({ axis: "truth", code: "truth_contradiction", severity: "block", message: "Declared state and observed/evidentiary signals conflict or unresolved contradictions remain." });
  }

  return { score: clamp(score, 0, 100), findings, details: { claims: claims.length, observations: observations.length, evidence: evidence.length, freshness } };
}

function evaluateContinuation(packet) {
  const findings = [];
  let score = 100;

  const affectedParties = normalizeArray(packet?.compassion?.affected_parties || packet?.human_context?.affected_parties);
  const harms = normalizeArray(packet?.compassion?.potential_harms || packet?.risk_context?.potential_harms);
  const mitigations = normalizeArray(packet?.compassion?.mitigations || packet?.safeguards);
  const escalation = packet?.compassion?.escalation_path || packet?.operator_review?.escalation_path;
  const humanOverride = packet?.compassion?.human_override_available ?? packet?.operator_review?.available;
  const consequenceLevel = normalizeText(packet?.system_context?.consequence_level || packet?.consequence_context?.level);
  const highConsequence = ["high", "critical", "severe", "life_safety", "clinical", "financial_consequence"].includes(consequenceLevel);

  if (affectedParties.length === 0) {
    score -= highConsequence ? 24 : 14;
    findings.push({ axis: "compassion", code: "missing_affected_parties", severity: highConsequence ? "warn" : "info", message: "Affected humans or stakeholder groups were not identified." });
  }
  if (highConsequence && harms.length === 0) {
    score -= 28;
    findings.push({ axis: "compassion", code: "missing_harm_scan", severity: "warn", message: "High-consequence packet lacks explicit potential-harm scan." });
  }
  if (harms.length > 0 && mitigations.length === 0) {
    score -= 22;
    findings.push({ axis: "compassion", code: "harms_without_mitigation", severity: "warn", message: "Potential harms were declared without mitigation or containment steps." });
  }
  if (highConsequence && !escalation && !humanOverride) {
    score -= 24;
    findings.push({ axis: "compassion", code: "missing_human_preservation_path", severity: "warn", message: "High-consequence packet lacks human review, override, or escalation path." });
  }

  return { score: clamp(score, 0, 100), findings, details: { affected_parties: affectedParties.length, potential_harms: harms.length, mitigations: mitigations.length, high_consequence: highConsequence } };
}

function evaluateConstraint(packet) {
  const findings = [];
  let score = 100;

  const responsibleActor = packet?.accountability?.responsible_actor || packet?.authority?.responsible_actor;
  const authorityBasis = packet?.accountability?.authority_basis || packet?.authority?.basis;
  const auditRef = packet?.accountability?.audit_ref || packet?.audit?.ref || packet?.audit?.id;
  const rollback = packet?.accountability?.rollback_plan || packet?.execution_controls?.rollback_plan;
  const consequenceOwner = packet?.accountability?.consequence_owner || packet?.authority?.consequence_owner;
  const requestedAction = packet?.requested_action || packet?.execution_request?.action;

  if (!requestedAction) {
    score -= 12;
    findings.push({ axis: "accountability", code: "missing_requested_action", severity: "info", message: "No requested action was declared." });
  }
  if (!responsibleActor) {
    score -= 28;
    findings.push({ axis: "accountability", code: "missing_responsible_actor", severity: "warn", message: "No responsible actor was declared." });
  }
  if (!authorityBasis) {
    score -= 26;
    findings.push({ axis: "accountability", code: "missing_authority_basis", severity: "warn", message: "No authority or mandate basis was declared." });
  }
  if (!consequenceOwner) {
    score -= 16;
    findings.push({ axis: "accountability", code: "missing_consequence_owner", severity: "warn", message: "No consequence owner was declared." });
  }
  if (!auditRef) {
    score -= 10;
    findings.push({ axis: "accountability", code: "missing_audit_reference", severity: "info", message: "No upstream audit reference was supplied." });
  }
  if (!rollback) {
    score -= 10;
    findings.push({ axis: "accountability", code: "missing_recovery_path", severity: "info", message: "No rollback, recovery, or containment plan was supplied." });
  }

  return { score: clamp(score, 0, 100), findings, details: { responsible_actor: Boolean(responsibleActor), authority_basis: Boolean(authorityBasis), consequence_owner: Boolean(consequenceOwner), audit_ref: Boolean(auditRef), rollback_plan: Boolean(rollback) } };
}

function deriveOutcome(axisScores, findings) {
  const minScore = Math.min(axisScores.truth, axisScores.compassion, axisScores.accountability);
  const hasBlock = findings.some((finding) => finding.severity === "block");

  if (hasBlock || minScore < 45) return { outcome: "blocked", admissible: false, action: "deny" };
  if (minScore < 65) return { outcome: "unstable", admissible: false, action: "escalate" };
  if (minScore < 85 || findings.some((finding) => finding.severity === "warn")) return { outcome: "degraded", admissible: true, action: "constrain" };
  return { outcome: "stable", admissible: true, action: "allow" };
}


function severityWeight(severity) {
  if (severity === "block") return 36;
  if (severity === "warn") return 14;
  if (severity === "info") return 4;
  return 0;
}

function detectAuthorityRisk(packet) {
  const authority = packet?.authority || packet?.accountability || {};
  const revoked = Boolean(authority.revoked || authority.revocation_detected || authority.delegation_revoked);
  const expiresAt = authority.expires_at || authority.mandate_expires_at || authority.delegation_expires_at;
  const scope = authority.scope || authority.delegation_scope || authority.mandate_scope;
  const requestedScope = packet?.execution_request?.scope || packet?.requested_scope || packet?.system_context?.workflow;
  const expired = expiresAt ? new Date(expiresAt).getTime() < Date.now() : false;
  const scopeMismatch = Boolean(scope && requestedScope && String(scope).toLowerCase() !== String(requestedScope).toLowerCase());

  return {
    revoked,
    expired,
    scope_mismatch: scopeMismatch,
    has_expiry: Boolean(expiresAt),
  };
}

function analyzeContinuityState(packet, findings, axisScores, aggregateScore, decision) {
  const authorityRisk = detectAuthorityRisk(packet);
  const continuation = packet?.continuity || packet?.runtime_continuity || {};
  const replay = packet?.replay || packet?.runtime_replay || {};
  const unresolvedContradictions = normalizeArray(packet?.truth?.unresolved_contradictions || packet?.unresolved_contradictions);
  const staleBasis = findings.some((finding) => finding.code === "stale_truth_basis" || finding.code === "invalid_verification_timestamp");
  const hasContradiction = findings.some((finding) => finding.code === "truth_contradiction") || unresolvedContradictions.length > 0;
  const branchDivergence = asNumber(replay.branch_divergence || replay.divergence_score || continuation.branch_divergence, 0);
  const priorBlocks = asNumber(continuation.prior_blocks || continuation.blocked_count || replay.prior_blocks, 0);
  const unresolvedCarryForward = asNumber(continuation.unresolved_carry_forward || continuation.unresolved_count, unresolvedContradictions.length);

  const findingPressure = findings.reduce((sum, finding) => sum + severityWeight(finding.severity), 0);
  const scorePressure = Math.max(0, 100 - aggregateScore);
  const authorityPressure =
    (authorityRisk.revoked ? 45 : 0) +
    (authorityRisk.expired ? 32 : 0) +
    (authorityRisk.scope_mismatch ? 26 : 0);

  const contradictionPressure = (hasContradiction ? 38 : 0) + Math.min(24, unresolvedCarryForward * 6);
  const replayPressure = Math.min(35, branchDivergence) + Math.min(24, priorBlocks * 8);
  const freshnessPressure = staleBasis ? 18 : 0;

  const pressure_score = clamp(
    Math.round(scorePressure * 0.35 + findingPressure * 0.25 + authorityPressure + contradictionPressure + replayPressure + freshnessPressure),
    0,
    100
  );

  const survivability =
    decision.outcome === "blocked" || pressure_score >= 80
      ? "failed"
      : pressure_score >= 55
        ? "fragile"
        : pressure_score >= 30
          ? "watch"
          : "surviving";

  const admissibility_window =
    survivability === "failed"
      ? "closed"
      : survivability === "fragile"
        ? "narrow"
        : survivability === "watch"
          ? "conditional"
          : "open";

  const escalation_required =
    survivability === "failed" ||
    survivability === "fragile" ||
    findings.some((finding) => finding.severity === "block");

  return {
    mode: "continuity_aware_runtime_governance",
    survivability,
    pressure_score,
    admissibility_window,
    escalation_required,
    pressure: {
      score_pressure: Math.round(scorePressure),
      finding_pressure: findingPressure,
      authority_pressure: authorityPressure,
      contradiction_pressure: contradictionPressure,
      replay_pressure: replayPressure,
      freshness_pressure: freshnessPressure,
    },
    authority_risk: authorityRisk,
    continuity_flags: {
      stale_basis: staleBasis,
      contradiction_present: hasContradiction,
      unresolved_carry_forward: unresolvedCarryForward,
      prior_blocks: priorBlocks,
      branch_divergence: branchDivergence,
    },
  };
}


function evaluateHarmonicStabilizer(packet) {
  const truth = evaluateStability(packet);
  const compassion = evaluateContinuation(packet);
  const accountability = evaluateConstraint(packet);
  const findings = [...truth.findings, ...compassion.findings, ...accountability.findings];
  const axis_scores = {
    truth: truth.score,
    compassion: compassion.score,
    accountability: accountability.score,
  };
  const aggregate_score = Math.round((axis_scores.truth * 0.42) + (axis_scores.compassion * 0.25) + (axis_scores.accountability * 0.33));
  const decision = deriveOutcome(axis_scores, findings);
  const runtime_continuity = analyzeContinuityState(packet, findings, axis_scores, aggregate_score, decision);

  const result = {
    service: "harmonic-stabilizer-core",
    version: EVALUATOR_VERSION,
    packet_id: packet?.packet_id || null,
    outcome: decision.outcome,
    admissible: decision.admissible,
    recommended_action: decision.action,
    stability_boundary: decision.outcome === "stable" ? "intact" : decision.outcome === "degraded" ? "partial" : "restricted",
    evaluated_at: new Date().toISOString(),
    runtime_continuity,
    stability_signals: {
      info: findings.filter((finding) => finding.severity === "info").length,
      warnings: findings.filter((finding) => finding.severity === "warn").length,
      blocks: findings.filter((finding) => finding.severity === "block").length,
    },
    operational_scope: {
      evaluates: "pre-execution operational stability and escalation conditions",
      does_not_evaluate: "domain judgment, autonomous authorization, or unrestricted execution approval",
    },
  };

  const publicResult = { ...result, artifact_hash: sha256(stableStringify({ packet, result })) };
  Object.defineProperty(publicResult, "__internal_metrics", {
    value: { axis_scores, aggregate_score },
    enumerable: false,
  });
  return publicResult;
}


async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return json(res, 405, { error: "Method not allowed", allowed_methods: ["POST"] });
    }

    const packet = await readJsonBody(req);
    const result = evaluateHarmonicStabilizer(packet);

    return json(res, 200, {
      ...result,
      public_release: true,
      note: "Public core endpoint. No API-key provisioning, customer billing, or private telemetry is included in this repository."
    });
  } catch (error) {
    return json(res, 500, { error: "Evaluation failed", detail: error instanceof Error ? error.message : String(error) });
  }
}

module.exports = handler;
module.exports.evaluateHarmonicStabilizer = evaluateHarmonicStabilizer;
