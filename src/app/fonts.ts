import localFont from "next/font/local";

export const unbounded = localFont({
  src: [{ path: "../fonts/Unbounded-Light.woff2", weight: "300", style: "normal" }],
  variable: "--f-display",
  display: "swap",
  fallback: ["Inter Display", "system-ui", "sans-serif"],
});

export const interDisplay = localFont({
  src: [
    { path: "../fonts/InterDisplay-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InterDisplay-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--f-text",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
