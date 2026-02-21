#!/bin/bash
# Run from the Simsiqueste folder. Then on your iPhone (same Wi‑Fi), open:
#   http://YOUR_MAC_IP:8080
# Find your Mac IP: System Settings → Network → Wi‑Fi → Details (or run: ipconfig getifaddr en0)

cd "$(dirname "$0")"
echo "Serving at http://0.0.0.0:8080"
echo "On iPhone: use http://$(ipconfig getifaddr en0 2>/dev/null || echo 'YOUR_MAC_IP'):8080"
echo "Press Ctrl+C to stop."
python3 -m http.server 8080 --bind 0.0.0.0
