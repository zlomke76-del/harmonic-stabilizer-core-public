# Harmonic — The Governance API for Developers

**Your AI can act. Harmonic determines whether it should.**

### One API call before execution.

```text
POST /api/evaluate
```

Harmonic is runtime governance infrastructure for consequence-bearing AI and automated systems. Immediately before consequence, it evaluates whether the conditions supporting continuation remain admissible now.

**Start here:** [`QUICKSTART.md`](./QUICKSTART.md) · [`Node example`](./examples/node-evaluate.js) · [`Python example`](./examples/python_evaluate.py) · [`Public boundary`](./V4_PUBLIC_BOUNDARY.md) · [`Frozen evidence`](./evidence/decision-engineering/t4-v1.1/)

> **Public repository boundary**
> This repository contains the public architecture contract, public-safe reference/demo evaluator, integration examples, and frozen evidence published for Harmonic v4.0.0. It **does not contain the sovereign production Harmonic runtime**.

---

## What Harmonic asks

> **Do the conditions that make this continuation admissible remain supportable now?**

Harmonic does not replace upstream cognition and does not infer domain truth merely from prose. It evaluates supplied, attributable runtime state across constitutional conditions such as present-state support, authority continuity, obligations, consequence boundaries, and continuation requirements.

## Public-repository boundary

This repository **does not contain the sovereign production Harmonic runtime**.

The JavaScript evaluator under `api/evaluate.js` is a **public-safe reference/demo evaluator retained for integration examples and local experimentation**. It is not the production v4.0.0 constitutional runtime, and its internal scoring model must not be treated as a description of the private production implementation.

The production runtime remains internally controlled. Public consumers should distinguish:

- **architecture contract** — documented here;
- **reference/demo evaluator** — included here for public experimentation;
- **production Harmonic runtime** — sovereign implementation, not published here;
- **frozen evidence** — preserved here where publication is appropriate.

See [`V4_PUBLIC_BOUNDARY.md`](./V4_PUBLIC_BOUNDARY.md).

---

## Harmonic v4.0.0 public contract

The production single-call contract is identified as:

- Runtime: `4.0.0`
- API contract: `v4-single-call`
- Canonical evaluation boundary: `POST /api/evaluate`

Conceptually:

```text
Upstream cognition / institutional state
                  ↓
          proposed continuation
                  ↓
              Harmonic
                  ↓
 constitutional determination
                  ↓
        execution directive
                  ↓
        downstream executor
```

Harmonic's canonical constitutional determinations are:

- `PERMITTED`
- `CONSTRAINED`
- `ESCALATED`
- `REFUSED`
- `EMERGENCY_CONTINUITY`

Operational directives such as `allow`, `constrain`, `escalate`, and `block/refuse` are **execution-facing instructions**, not substitutes for the constitutional determination vocabulary.

## Execution boundary

Harmonic separates determination from downstream execution.

A governed response may bind the response contract while still recording that Harmonic itself did not perform the downstream act. In v4 this distinction is explicit:

```json
{
  "response_binding_enforced": true,
  "binding_scope": "governed_response_contract_only",
  "downstream_execution_enforced": false
}
```

A constitutional transaction can therefore state `NOT_EXECUTED_BY_HARMONIC` while still determining whether execution may continue.

## Present state and epistemic discipline

V4 preserves the distinction between:

- state supplied to the runtime;
- attributable provenance for that state;
- whether the state is sufficiently reconstructable;
- the constitutional determination made against the supplied state.

Missing provenance or institutional knowledge is not silently manufactured. Upstream cognition and institutional authority remain sovereign.

---

## Frozen public evidence: Decision Engineering T4 v1.1

The repository includes an evidence-only archive at:

[`evidence/decision-engineering/t4-v1.1/`](./evidence/decision-engineering/t4-v1.1/)

The archive records a prospectively frozen four-condition examination against Harmonic v4.0.0. It was added **after** the runtime freeze and does not modify runtime behavior.

Final bounded reading preserved in the evidence record:

- **D1 — supported as a representation-activation bundle effect; individual field causality not isolated.**
- **D2 — propagation dependency demonstrated at the signal/reason level; top-line marginal effect not isolated.**
- **D3 — provenance dependency not demonstrated; provenance-projection insensitivity observed.**

The broad mechanism-absence interpretation was withdrawn.

The surviving research question is preserved without a novelty claim:

> **What ensures that a legitimately established institutional authority change is correctly and timely bound into the runtime state consumed by an already-existing authority-coherence mechanism?**

Comparator / established-owner absorption testing remains the appropriate next step before naming a seam or extending the architecture.

---

## Public reference evaluator

For local/public-safe experimentation, this repository still exposes a simplified demonstrator at `api/evaluate.js` and the static playground.

That demonstrator is useful for:

- SDK wiring;
- request/response mechanics;
- public examples;
- local deployment exercises;
- simple bounded-decision demonstrations.

It is **not evidence of production Harmonic behavior** and should not be used to infer private primitive logic or the v4 production implementation.

Run local checks:

```bash
npm run check
npm run test:vectors
npm run verify:evidence
npm run verify:public-boundary
```

## Repository structure

```text
QUICKSTART.md                       developer-first integration path
examples/                           minimal Node and Python call examples
api/                                public-safe reference/demo evaluator
sdk/                                public integration helpers
scripts/                            validation utilities
public/                             static public deployment assets
evidence/decision-engineering/      frozen public evidence archives
docs.html                           public contract documentation
V4_PUBLIC_BOUNDARY.md               architecture/repository boundary
```

## Security and private surfaces

This public release intentionally excludes operational infrastructure including customer provisioning, billing, private API-key administration, private telemetry, authenticated evidence stores, and sovereign production-runtime implementation details.

Do not place production credentials in this repository.

## License

Licensed under the Apache License, Version 2.0. See [`LICENSE`](./LICENSE).
