import type { Config } from "tailwindcss";

/**
 * Algormn Design System — Dark Editorial
 *
 * Aesthetic: Premium engineering magazine on matte black paper.
 * Typography does the heavy lifting. No decorative noise.
 * Think The Economist × MIT Technology Review in dark mode.
 *
 * Fonts:
 *   - Display/Heading: Playfair Display (editorial serif)
 *   - Body/Code: IBM Plex Mono (technical, readable)
 *   - UI (nav, labels, buttons): IBM Plex Sans (clean, precise)
 *
 * Color philosophy:
 *   - Near-black backgrounds (#0C0C0C) — not pure black, reduces eye strain
 *   - Warm off-white text (#F0EDE6) — feels like aged paper, not a screen
 *   - ONE accent color: amber/gold (#E8C547) — used sparingly for emphasis
 */

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Typography ──────────────────────────────────────────
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"IBM Plex Mono"', "monospace"],
        ui: ['"IBM Plex Sans"', "sans-serif"],
      },

      // ── Colors — Dark Editorial Palette ─────────────────────
      colors: {
        base: "#0C0C0C",
        surface: "#141414",
        elevated: "#1C1C1C",
        border: "#2A2A2A",
        "text-primary": "#F0EDE6",
        "text-secondary": "#A09C94",
        "text-muted": "#5C5955",
        accent: "#E8C547",
        "accent-hover": "#F5D660",
        "tag-bg": "#1E1E1E",
        "tag-text": "#A09C94",
        "code-bg": "#111111",
      },

      // ── Border Radius — Sharp, editorial ────────────────────
      borderRadius: {
        sm: "2px",
        md: "4px",
        lg: "6px",
      },

      // ── Spacing overrides ───────────────────────────────────
      spacing: {
        "article-max": "720px", // Max width for article content
        "sidebar-w": "320px",   // Sidebar width on article pages
      },

      // ── Typography scale additions ──────────────────────────
      fontSize: {
        "display-xl": ["3.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["2.75rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
      },
    },
  },
  plugins: [],
};

export default config;
