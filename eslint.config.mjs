import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss"; // Optional: Tailwind
import tseslint from "@typescript-eslint/eslint-plugin"; // Optional: extra TS rules

export default defineConfig([
  // Next.js recommended rules
  ...nextVitals,
  ...nextTs,

  // TailwindCSS plugin (optional but recommended for Next + Tailwind)
  {
    plugins: { tailwindcss: tailwind },
    rules: {
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off", // turn on if you prefer
    },
  },

  // Extra TypeScript rules (optional)
  {
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // Override default ignores from eslint-config-next
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
