const { json } = require("./_shared");

module.exports = async function handler(req, res) {
  return json(res, 501, {
    error: "Replay is not included in the public core release.",
    public_release: true,
    reason: "This surface depends on private authenticated telemetry and customer-scoped storage."
  });
};
