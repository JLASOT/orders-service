import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.jest } },
  },
  pluginReact.configs.flat.recommended,

  {
    files: ["tests/**/*.{js,mjs,cjs}"],
    rules: {
      "no-unused-vars": "off"          // desactiva el error por variables no usadas
    }
  }
]);
