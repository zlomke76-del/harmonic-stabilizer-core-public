export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  return res.status(501).json({
    ok: false,
    endpoint: "/api/replay",
    status: "not_implemented",
    message:
      "Replay storage and authenticated evaluation history are not included in the public release.",
    public_boundary:
      "This repository exposes only the public evaluator and demo integration surface.",
  });
}
