import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const rawConfig = compat.extends("next/core-web-vitals");

// A helper to remove the `parse` function from any parser objects
function sanitizeConfig(config) {
  if (config.parser && typeof config.parser === "object" && "parse" in config.parser) {
    // Create a shallow copy of the parser object without the `parse` property
    const { parse, ...rest } = config.parser;
    config = { ...config, parser: rest };
  }
  return config;
}

// Process the array of config objects returned by compat.extends
const sanitizedConfig = rawConfig.map((cfg) => sanitizeConfig(cfg));

export default sanitizedConfig;
