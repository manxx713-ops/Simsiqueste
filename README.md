# Simsiqueste

A smooth, dynamic, and highly responsive art website. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Smooth scroll reveals** — Content fades and slides in as you scroll
- **Magnetic hover** — Links and buttons subtly follow the cursor
- **Parallax gallery** — Gallery images shift gently with scroll (pauses on hover)
- **Responsive layout** — Desktop (3-column gallery), tablet (2-column), mobile (single column + hamburger menu)
- **Reduced motion** — Respects `prefers-reduced-motion` for accessibility

## Run locally

**On this computer:** Open `index.html` in a browser, or run a server and visit `http://localhost:8080`.

**On your iPhone (same Wi‑Fi):** The phone can’t use “localhost” (that’s the phone itself). Use your Mac’s IP instead:

1. **Start the server so it’s reachable on the network:**
   ```bash
   cd /path/to/Simsiqueste
   python3 -m http.server 8080 --bind 0.0.0.0
   ```
   Or run the script: `./serve.sh` (after `chmod +x serve.sh`).

2. **Find your Mac’s IP:** System Settings → Network → Wi‑Fi → your connection → Details. It looks like `192.168.1.x` or `10.0.x.x`.

3. **On your iPhone:** In Safari, open `http://YOUR_MAC_IP:8080` (e.g. `http://192.168.1.5:8080`).

4. **If it still won’t connect:** Check that Mac and iPhone are on the same Wi‑Fi, and that your Mac firewall allows incoming connections (System Settings → Network → Firewall).

## Customize

- **Gallery images** — Replace the `.gallery-image-1` … `.gallery-image-6` gradient placeholders in `styles.css` with `background-image: url('path/to/artwork.jpg');` or add `<img>` tags in `index.html`.
- **Colors** — Edit CSS variables in `:root` in `styles.css` (e.g. `--accent`, `--bg`, `--text`).
- **Copy** — Update artist names, titles, exhibitions, and contact links in `index.html`.

## Structure

- `index.html` — Structure: hero, gallery, about, exhibitions, contact
- `styles.css` — Layout, typography, animations, responsive breakpoints
- `script.js` — Scroll reveal, magnetic hover, mobile menu, parallax
