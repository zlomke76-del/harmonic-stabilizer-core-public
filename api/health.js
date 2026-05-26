const { json } = require("./_shared");

module.exports = async function handler(req, res) {
  return json(res, 200, {
    ok: true,
    service: "harmonic-stabilizer-core-public",
    public_release: true,
    private_surfaces_removed: ["billing", "api_key_provisioning", "customer_console", "debug_supabase", "private_telemetry"]
  });
};
