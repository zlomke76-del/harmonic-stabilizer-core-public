import json
import urllib.request


def evaluate(base_url, packet):
    url = base_url.rstrip("/") + "/api/evaluate"
    data = json.dumps(packet).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.loads(response.read().decode("utf-8"))
