# Harmonic Quickstart

**Your AI can act. Harmonic determines whether it should.**

Harmonic sits immediately before a consequence-bearing action and evaluates whether continuation remains admissible against the runtime state supplied to it.

## 1. Put Harmonic before execution

```text
AI / agent / workflow
        ↓
proposed action
        ↓
POST /api/evaluate
        ↓
Harmonic determination
        ↓
downstream executor
```

The canonical v4 public contract identifies the evaluation boundary as:

```text
POST /api/evaluate
```

## 2. Send the runtime packet

The exact packet should represent the state your system can actually establish and attribute. Do not manufacture missing institutional knowledge merely to satisfy the evaluator.

For the public-safe reference evaluator, a compact example is:

```json
{
  "packet_id": "example-001",
  "requested_action": "release_supplier_payment",
  "truth": {
    "claims": ["Payment is approved for release."],
    "observations": [
      { "statement": "Approval remains present in the supplied runtime state." }
    ],
    "evidence": [
      { "ref": "internal://approval/123" }
    ]
  },
  "accountability": {
    "responsible_actor": "treasury-agent",
    "authority_basis": "supplier-payment-delegation",
    "consequence_owner": "treasury-operations",
    "audit_ref": "internal://audit/456"
  }
}
```

This packet is an **integration example for the public-safe reference evaluator**, not a claim that these fields alone establish production admissibility.

## 3. Evaluate before consequence

### Node

```js
const { evaluate } = require("./sdk/harmonic-node-sdk");

const result = await evaluate(process.env.HARMONIC_BASE_URL, packet);
console.log(result);
```

### Python

```python
from sdk.harmonic_python_sdk import evaluate
import os

result = evaluate(os.environ["HARMONIC_BASE_URL"], packet)
print(result)
```

Complete runnable examples are in [`examples/`](./examples/).

## 4. Respect the determination / directive boundary

Harmonic v4 distinguishes the constitutional determination from the execution-facing directive. Canonical constitutional determinations are:

- `PERMITTED`
- `CONSTRAINED`
- `ESCALATED`
- `REFUSED`
- `EMERGENCY_CONTINUITY`

Operational directives such as allow, constrain, escalate, or block/refuse are execution-facing instructions. They are not substitutes for the constitutional determination vocabulary.

Harmonic determines whether execution may continue; it does not silently become the downstream executor.

## 5. Know which surface you are using

This repository intentionally separates three things:

1. **Public architecture contract** — the documented v4 boundary and semantics.
2. **Public-safe reference/demo evaluator** — useful for wiring, examples, and local experimentation.
3. **Sovereign production runtime** — internally controlled and not published in this repository.

Do not infer private production primitive logic from `api/evaluate.js`.

For the controlling repository boundary, read [`V4_PUBLIC_BOUNDARY.md`](./V4_PUBLIC_BOUNDARY.md).

## Local public-reference checks

```bash
npm run check
npm run test:vectors
npm run verify:evidence
npm run verify:public-boundary
```

## Next

- Read the [public contract](./README.md#harmonic-v400-public-contract).
- Inspect the [Node example](./examples/node-evaluate.js).
- Inspect the [Python example](./examples/python_evaluate.py).
- Review the [frozen public evidence](./evidence/decision-engineering/t4-v1.1/).
