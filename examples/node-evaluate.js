const { evaluate } = require("../sdk/harmonic-node-sdk");

const baseUrl = process.env.HARMONIC_BASE_URL || "http://localhost:3000";

const packet = {
  packet_id: "example-node-001",
  requested_action: "release_supplier_payment",
  truth: {
    claims: ["Payment is approved for release."],
    observations: [{ statement: "Approval remains present in the supplied runtime state." }],
    evidence: [{ ref: "internal://approval/123" }],
  },
  accountability: {
    responsible_actor: "treasury-agent",
    authority_basis: "supplier-payment-delegation",
    consequence_owner: "treasury-operations",
    audit_ref: "internal://audit/456",
  },
};

(async () => {
  const result = await evaluate(baseUrl, packet);
  console.log(JSON.stringify(result, null, 2));
})().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
