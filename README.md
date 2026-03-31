<h1 align="center">Voice of Needy Foundation (VNF) Theme</h1>

<p align="center">
  <strong>A Custom Ghost CMS Architecture</strong><br>
  <em>Championing digital accessibility and seamless publishing.</em>
</p>

<hr>

## [+] Overview

Developed exclusively for the **Voice of Needy Foundation (VNF)**, this open-source template extends the standard Ghost CMS environment. It introduces a custom-built accessibility suite native to the routing layer, paired with dynamic layouts optimized specifically for non-profit and social organizations.

## [+] Core Dynamics & How It Works

### ▸ Accessibility (A11Y) Engine
The theme features a deeply integrated, dependency-free accessibility control panel:
- **Pixel-Anchored Scaling:** The global font-size multiplier bypasses standard relative `rem` loops. UI components inside the actual widget are hardcoded in `px` to remain perfectly static and functional while the rest of the site's typography dynamically scales up or down based on user preference.
- **High-Contrast Layering:** A global CSS class system that safely overrides background and foreground tokens to ensure strict WCAG contrast compliance.
- **Read Aloud (TTS):** Native DOM-scraping logic parses semantic text blocks (`<p>`, `<h1>`, `<li>`) and leverages browser-based Speech Synthesis to read content back to visually impaired users on hover.

### ▸ Adaptive Routing
The Ghost routing layer naturally splits standard articles from organizational static content:
- **`post.hbs`**: Wide-format reading layers utilizing a custom Juniper-style grid with a fixed 380px contextual sidebar (featuring Authors, Tags, and Subscriptions).
- **`page.hbs`**: Distinct structural `.post-content` wrappers utilizing standalone card layouts, ensuring structural CSS variables (like bullet indents, image border radii, and text line heights) map perfectly without overlapping into blog structures.

### ▸ Dependency-Free Stack
Built entirely for speed and permanence:
- **Vanilla CSS:** Zero external CSS framework reliance. Tokenized purely through CSS `:root` variables to instantly compile and minimize DOM weight.
- **Handlebars Navigation:** Native Ghost Handlebars implementations for pagination, tag arrays, and related content looping without heavy client-side JavaScript.

---

## [+] Acknowledgements

> - **Avishkar Patil**
> - **Voice of Needy Foundation (VNF)**
> - **T4G (Tech4GoodCommunity)**
> - **OASIS**
> - **Ghost CMS**

## [+] License

This project is released under an **Open Source License**.

<br>
<p align="center"><i>Written with code. Driven by impact.</i></p>
