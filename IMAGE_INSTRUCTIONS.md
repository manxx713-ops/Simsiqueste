# Image Setup

## About Section — Boat / Sunset Image

The "Art is a quest" section shows a boat/sunset artwork. To display it:

1. **Save your boat/sunset image** as `about-boat.png` in the same folder as `index.html` (the Simsiqueste project root).
2. If you use a different filename, update the `src` in `index.html` on the about section image (search for `about-boat.png`).

---

## Background Image Setup

## Chinar Leaf Image

To add the hyper realistic chinar leaf background:

1. **Save your chinar leaf image** as `chinar-leaf.jpg` in the same folder as `index.html` (the Simsiqueste folder).

2. **Image Requirements:**
   - **Must be a 5-lobed chinar leaf** (5 distinct lobes/toothed edges)
   - Hyper realistic, high detail
   - Format: JPG or PNG
   - Size: At least 1920x1080px (larger is better for high-DPI displays)
   - Quality: High resolution for hyper realistic detail
   - File size: Optimize to keep under 500KB-1MB for fast loading
   - The leaf should be clearly visible and well-lit

3. **Alternative filename:** If your image has a different name, update line 70 in `styles.css`:
   ```css
   url('chinar-leaf.jpg')
   ```
   Change `chinar-leaf.jpg` to your actual filename.

4. **Adjust overlay darkness:** If the image is too bright or too dark, edit the overlay opacity in `styles.css` line 70:
   ```css
   linear-gradient(rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0.75))
   ```
   - Increase opacity (0.85 → 0.90) for darker overlay
   - Decrease opacity (0.85 → 0.70) for lighter overlay

The background is set to:
- Cover the entire viewport
- Stay fixed while scrolling (parallax effect)
- Have a dark overlay to maintain text readability
- **Orange color tint** - The leaf will appear orange through CSS color blending
- Center the leaf in the frame

## Orangish-Red Color Effect

The chinar leaf background automatically appears **orangish-red** through CSS `mix-blend-mode: color`. The tint uses:
- Red-orange (rgba(255, 69, 0)) for vibrant orangish-red tones
- Orange (rgba(255, 140, 0)) for highlights

The leaf is set to be **clearly visible** with reduced dark overlay (40-30% opacity instead of 75-65%).

To adjust the orangish-red intensity, edit `body::before` in `styles.css`:
- Increase opacity values (0.55 → 0.65) for more vibrant orangish-red
- Decrease opacity values (0.55 → 0.45) for subtler color
- Change `mix-blend-mode: color` to `mix-blend-mode: overlay` for different blending effect

To adjust leaf visibility (dark overlay), edit `body::after` in `styles.css`:
- Decrease opacity (0.4 → 0.3) to make leaf more visible
- Increase opacity (0.4 → 0.5) to darken background for better text contrast
