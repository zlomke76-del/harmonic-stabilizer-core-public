const { evaluateHarmonicStabilizer } = require('../api/evaluate.js');

const now = new Date();
const fresh = new Date(now.getTime() - 5 * 60000).toISOString();
const stale = new Date(now.getTime() - 90 * 60000).toISOString();

const stable = {
  packet_id: 'hs-stable-t0',
  system_context: { domain: 'healthcare', workflow: 'discharge-readiness', consequence_level: 'high' },
  requested_action: 'continue discharge readiness analysis',
  truth: {
    claims: ['patient respiratory status stable', 'handoff state verified'],
    observations: [
      { source: 'nurse-observation', statement: 'patient respiratory status stable', observed_at: fresh },
      { source: 'monitor', statement: 'oxygen saturation stable', observed_at: fresh }
    ],
    evidence: [{ ref: 'monitor-stream-441' }],
    last_verified_at: fresh,
    stale_after_minutes: 30
  },
  compassion: {
    affected_parties: ['patient', 'nursing team', 'receiving clinician'],
    potential_harms: ['premature discharge if state changes'],
    mitigations: ['manual nurse verification before final discharge'],
    escalation_path: 'charge nurse review',
    human_override_available: true
  },
  accountability: {
    responsible_actor: 'clinical workflow supervisor',
    authority_basis: 'current discharge protocol and attending review',
    consequence_owner: 'attending clinician',
    audit_ref: 'audit-441',
    rollback_plan: 'hold discharge and reopen review'
  }
};

const blocked = {
  packet_id: 'hs-blocked-tn',
  system_context: { domain: 'healthcare', workflow: 'discharge-readiness', consequence_level: 'critical' },
  requested_action: 'continue discharge readiness analysis',
  truth: {
    claims: ['patient respiratory status stable'],
    observations: [
      { source: 'nurse-observation', statement: 'patient respiratory status worsening; oxygen saturation unstable', observed_at: now.toISOString() }
    ],
    last_verified_at: stale,
    stale_after_minutes: 30,
    unresolved_contradictions: ['monitor conflicts with discharge claim']
  },
  compassion: {
    affected_parties: ['patient'],
    potential_harms: ['premature discharge']
  },
  accountability: {
    responsible_actor: 'clinical workflow supervisor'
  }
};

const stableResult = evaluateHarmonicStabilizer(stable);
const blockedResult = evaluateHarmonicStabilizer(blocked);

console.log('STABLE:', stableResult.outcome, stableResult.recommended_action);
console.log('BLOCKED:', blockedResult.outcome, blockedResult.recommended_action);

if (stableResult.outcome !== 'stable') process.exitCode = 1;
if (blockedResult.outcome !== 'blocked') process.exitCode = 1;
