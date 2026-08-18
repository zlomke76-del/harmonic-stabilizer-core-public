# Public Release Notes

## 4.0.0-public.1 — contract and evidence alignment

This public repository has been aligned with the Harmonic v4.0.0 public architecture contract without publishing the sovereign production runtime implementation.

Changes:

- public documentation now identifies the production contract as `runtime_version: 4.0.0` / `api_version: v4-single-call`;
- constitutional determinations are separated from execution-facing directives;
- response-contract binding is explicitly separated from downstream execution enforcement;
- the included `api/evaluate.js` implementation is clearly labeled as a public-safe reference/demo evaluator rather than the production runtime;
- the frozen Decision Engineering T4 v1.1 evidence archive is included, including negative and qualified findings;
- the evidence archive is explicitly evidence-only and does not modify the runtime that generated it.

## Public-safe removal boundary

Operational/private surfaces remain excluded, including:

- Stripe checkout and webhook routes;
- Supabase service-role access paths;
- API-key creation/revocation routes;
- customer console and account routes;
- authenticated private replay/continuity storage implementation;
- private telemetry and production orchestration internals;
- sovereign production constitutional-runtime source.

The remaining repository contains no intended production secrets and requires no private infrastructure credentials for its reference/demo mode.
