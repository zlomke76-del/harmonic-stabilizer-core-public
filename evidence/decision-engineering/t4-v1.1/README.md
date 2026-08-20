# Harmonic T4 v1.1 — Frozen Evidence Archive

## Status

**Evidence-only archive. No Harmonic runtime, primitive, evaluation, entitlement, request-contract, or execution behavior is modified by this directory.**

This archive preserves the prospectively frozen T4 v1.1 test, the exact controlling packet-set object, the native Engineering View outputs, and the independent post-execution adjudication. The runtime under test was **Harmonic v4.0.0**.

The purpose of committing this material after the runtime freeze is to preserve attributable evidence without back-writing the proof into the implementation that produced it.

## Controlling frozen object

`TIM_T4_v1_1_FROZEN_PACKET_SET_EXACT_b6f99afc_2026-08-17.zip`

SHA-256:

`b6f99afcc1f8ebdd7825441cf6228f037a3d62e4403946ad4b313d9880569917`

The TAR in `transport/` is preserved only as transport evidence. Its hash is not controlling. The inner frozen ZIP identity is controlling.

## Frozen packet identities

| Condition | Frozen file SHA-256 | Frozen bytes | Live outbound SHA-256 | Outbound bytes |
|---|---|---:|---|---:|
| A | `2aa3e104d3d9eb8d8f750c45f23cb56853e363969b002f3c9cb8ff637f256857` | 6343 | `7039576d38ef28cf2b4d62f24c20a1a73d814b7596d64cbf74ce540b7ed66567` | 6342 |
| B | `66e61cec8e413ecfbde59e44e367936c14fcbf22489c79b30e4dadee18356986` | 6829 | `dbf4b0fea8879211181d04e86fb1a67dbc30ddb6b94a66c9be1cd3adf509f134` | 6828 |
| C | `7b6068a8a05c2ada70f5863ed7750d7c1ef04a9ae9dc2ffbae83b6ff1d615955` | 6834 | `99b0892f8f81b5804e1ce54449a1474cf46167258e814daf8de78d066e7714c8` | 6833 |
| D | `9df59ada95d0120853eb185fa014cbe425d9e79b782cd0aa56f4b5c94757977d` | 6827 | `fcf13f4725a7403e06065b44c620c06380a3e57178be9565b18e35ffaab1b434` | 6826 |

For every condition, the live outbound body is the corresponding frozen packet file with only its single terminal LF removed. Accordingly, the preserved transport description is:

> **semantically and structurally unchanged with terminal-LF transport normalization**

The archive does **not** describe these executions as byte-identical file-object replay.

## Native observed results

| Condition | Frozen discriminator | Authority Continuity | Runtime / final determination |
|---|---|---|---|
| A | Institutional A1 present; runtime activation not bound | `AUTHORITY_CONTINUOUS` | `ADMISSIBLE / PERMITTED / ALLOW` |
| B | A1 bound; propagation confirmed | `AUTHORITY_LOST` | `ESCALATION_REQUIRED / ESCALATED` |
| C | A1 bound; propagation unconfirmed | `AUTHORITY_LOST` plus `revocation_propagation_unconfirmed` | `ESCALATION_REQUIRED / ESCALATED` |
| D | Operative runtime state as B; input provenance lineage reduced | `AUTHORITY_LOST` | `ESCALATION_REQUIRED / ESCALATED` |

The four native outputs are preserved under `outputs/` as Engineering View PDFs.

## Independent adjudication and final bounds

The independent adjudication v0.1 is preserved unchanged in `adjudication/`. Its controlling text record SHA-256 is:

`89190605f79998c17ed53667a4b782319e7de363eb0e6a17c167e8d2b8be8ba9`

The subsequent red-team narrowing is recorded separately as a correspondence transcription, not as a replacement for the independent adjudication.

Final bounded reading:

- **D1 — supported as a representation-activation bundle effect; individual field causality not isolated.**
- **D2 — propagation dependency demonstrated at the signal/reason level; top-line marginal effect not isolated.**
- **D3 — provenance dependency not demonstrated; provenance-projection insensitivity observed.**

The broad mechanism-absence interpretation is withdrawn.

## Surviving research question

> **What ensures that a legitimately established institutional authority change is correctly and timely bound into the runtime state consumed by an already-existing authority-coherence mechanism?**

This archive does **not** claim that the surviving question is a novel seam, that Harmonic owns the upstream binding responsibility, or that established architectures do not already absorb some or all of it. Comparator / established-owner absorption testing remains the next phase.

## Reproducibility

Run from this directory:

```bash
python verify_evidence.py
```

The verifier checks the controlling ZIP identity, packet hashes, terminal-LF transport normalization, native output hashes, independent-adjudication text hash, and that the TAR envelope contains the controlling frozen ZIP unchanged.

## Public repository publication note

This archive is published in the public reference repository for independent inspection. Publication does not convert the evidence into Harmonic runtime configuration, does not alter the v4.0.0 runtime identity, and does not imply that every research question in the archive is resolved in Harmonic's favor.
