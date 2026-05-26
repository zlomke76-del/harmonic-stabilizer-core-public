async function evaluate(baseUrl, packet) {
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(packet),
  });

  if (!response.ok) {
    throw new Error(`Harmonic evaluation failed: ${response.status}`);
  }

  return response.json();
}

module.exports = { evaluate };
