const { json, readJsonBody } = require("./_shared");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed", allowed_methods: ["POST"] });
  const body = await readJsonBody(req);
  return json(res, 202, {
    ok: true,
    public_release: true,
    message: "Contact payload accepted by public demo stub. Wire this route to your own CRM/email provider in private deployment.",
    received_fields: Object.keys(body || {})
  });
};
