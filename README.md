Harmonic Stabilizer Core

Deterministic execution governance for consequence-bearing AI systems.

Harmonic Stabilizer evaluates whether an AI or autonomous system output should:

proceed,
be constrained,
require escalation,
or be blocked

under live operational conditions.

The system is designed to sit between probabilistic cognition and real-world execution.

LLM / Agent / Workflow
          ↓
Harmonic Stabilizer
          ↓
allow / constrain / escalate / block
Why it exists

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

Returns:

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
npm install
npm run dev

Run validation:

npm run check
npm run test:vectors
Deployment

Deploy directly to Vercel

vercel deploy
Architecture Boundary

This public repository intentionally contains only the public evaluation layer and integration surface.

Operational infrastructure such as:

customer provisioning,
billing,
authenticated replay systems,
private telemetry,
and internal orchestration infrastructure

remain outside the public release boundary.

Intended Use Cases
AI governance layers
Agent execution control
Autonomous workflow gating
Runtime admissibility enforcement
Safety and escalation systems
Human-in-the-loop execution boundaries
Enterprise orchestration governance
License
