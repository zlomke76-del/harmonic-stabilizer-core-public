import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from sdk.harmonic_python_sdk import evaluate

base_url = os.environ.get("HARMONIC_BASE_URL", "http://localhost:3000")
packet = {
    "packet_id": "example-python-001",
    "requested_action": "release_supplier_payment",
    "truth": {
        "claims": ["Payment is approved for release."],
        "observations": [{"statement": "Approval remains present in the supplied runtime state."}],
        "evidence": [{"ref": "internal://approval/123"}],
    },
    "accountability": {
        "responsible_actor": "treasury-agent",
        "authority_basis": "supplier-payment-delegation",
        "consequence_owner": "treasury-operations",
        "audit_ref": "internal://audit/456",
    },
}
result = evaluate(base_url, packet)
print(json.dumps(result, indent=2))
