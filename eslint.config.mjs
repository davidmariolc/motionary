import core from "ultracite/eslint/core";
import react from "ultracite/eslint/react";
import next from "ultracite/eslint/next";

export default [
  ...core,
  ...react,
  ...next,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
    rules: {
      // Unicorn handles multiline returns; the ESLint rule otherwise reverses its fixes.
      "arrow-body-style": "off",
      // Keep Next page exports consistent with the required arrow components.
      "unicorn/default-export-style": ["error", { functions: "separate" }],
    },
  },
];
