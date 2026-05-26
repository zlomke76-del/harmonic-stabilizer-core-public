# Harmonic Stabilizer Core

Deterministic execution governance for consequence-bearing AI systems.

Built for execution-bound AI systems operating under evolving runtime conditions.

Harmonic Stabilizer evaluates whether an AI or autonomous system output should:

- proceed,
- be constrained,
- require escalation,
- or be blocked

under live operational conditions.

The system is designed to operate between probabilistic cognition and real-world execution.

---

## Operational Boundary

```text
LLM / Agent / Workflow
          ↓
Harmonic Stabilizer
          ↓
allow / constrain / escalate / block
Why it Exists

Modern AI systems increasingly operate inside environments where:

authority changes,
runtime conditions drift,
assumptions degrade,
orchestration chains mutate,
and consequence-bearing execution continues under evolving state.

Harmonic Stabilizer provides a deterministic governance boundary that evaluates execution admissibility before irreversible consequence formation occurs.

This repository contains the public evaluation core, demo surfaces, SDK examples, and reference integration patterns.

Features
Deterministic governance evaluation
Runtime admissibility scoring
Constraint-aware execution decisions
Public evaluation API
SDK integration examples
Static demo interface
Test vectors and validation flows
Vercel-ready deployment
Public API
Evaluate
POST /api/evaluate

Example response:

{
  "decision": "allow",
  "confidence": 0.98,
  "constraints": [],
  "reasoning_trace": []
}
Health
GET /api/health
Example Flow
User Request
    ↓
LLM Response
    ↓
Harmonic Stabilizer Evaluation
    ↓
Governed Execution Decision
Quick Start

Install dependencies:

npm install

Run locally:

npm run dev

Run validation:

npm run check
npm run test:vectors
Environment

This public release intentionally avoids requiring private infrastructure credentials.

See .env.example.

Deployment

Deploy directly to Vercel

vercel deploy
Architecture Boundary

This public repository intentionally contains only the public evaluation layer and integration surface.

Operational infrastructure such as:

customer provisioning,
billing systems,
authenticated replay systems,
private telemetry,
orchestration infrastructure,
internal governance pipelines,
and enterprise deployment infrastructure

remain outside the public release boundary.

Intended Use Cases
AI governance layers
Agent execution control
Autonomous workflow gating
Runtime admissibility enforcement
Safety and escalation systems
Human-in-the-loop execution boundaries
Enterprise orchestration governance
Repository Structure
/api
/public
/sdk
/test-vectors
/docs
Security

If you discover a vulnerability or security issue, please report it privately.

See SECURITY.md.

Contributing

Public contributions are welcome for:

SDK examples
documentation
test vectors
integration examples

Core governance architecture decisions remain internally maintained.

See CONTRIBUTING.md.

## License

Licensed under the Apache License, Version 2.0.

See the LICENSE file for details.
