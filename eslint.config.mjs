import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import eslintPluginAva from "eslint-plugin-ava";
import js from "@eslint/js";

export default defineConfig([
	globalIgnores(["lib/*", "cli/*", "coverage/*"]),
	{
		files: ["**/*.ts"],
		extends: [js.configs.recommended, typescriptEslint.configs["flat/recommended"]],
	},
	eslintPluginAva.configs.recommended,
]);
