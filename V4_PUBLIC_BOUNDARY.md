# Harmonic v4 Public Repository Boundary

## Status

This repository is a **public reference and evidence repository**. It is not the sovereign production Harmonic runtime source tree.

## What is public here

1. **Architecture contract** — public terminology and execution-boundary semantics for Harmonic v4.0.0.
2. **Reference/demo evaluator** — a simplified public-safe implementation used for examples and integration exercises.
3. **SDK examples** — convenience clients for the public/reference HTTP shape.
4. **Frozen evidence** — selected prospectively frozen test artifacts and independent adjudication records suitable for public preservation.

## What is not public here

The repository does not publish the private production implementation of Harmonic's constitutional primitives, entitlement system, customer control plane, private replay/evidence services, telemetry, billing, or deployment internals.

## Canonical v4 vocabulary

Constitutional determinations:

- `PERMITTED`
- `CONSTRAINED`
- `ESCALATED`
- `REFUSED`
- `EMERGENCY_CONTINUITY`

Execution-facing directives may include allow, constrain, escalate, refuse/block, or emergency-continuity handling. A directive is not the same object as the constitutional determination that supports it.

## Determination is not execution

Harmonic evaluates continuation at the consequence boundary. The production contract explicitly distinguishes governed-response binding from downstream execution enforcement.

A production constitutional transaction may state:

- response contract is bound;
- downstream execution is not enforced by Harmonic;
- execution did not occur inside Harmonic.

This distinction prevents an admissibility determination from being misrepresented as proof that a downstream system acted.

## Cognition remains upstream

Harmonic does not become a domain-reasoning engine merely because it evaluates a domain consequence. Institutional/domain systems establish the state and evidence they are authoritative to establish. Harmonic evaluates continuation against the supplied constitutional state.

## Evidence is not runtime configuration

Files under `evidence/` are archival proof records. They must not be imported as runtime policy, configuration, training data, or implementation defaults.

An evidence-only commit may post-date a runtime freeze without altering the frozen runtime identity that produced the evidence.
