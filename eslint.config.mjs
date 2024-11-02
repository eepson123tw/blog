import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import markdownlint from "eslint-plugin-markdownlint";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Global settings https://stackblitz.com/edit/vitejs-vite-rv1ac6?file=eslint.config.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
  allConfig: eslint.configs.all,
});

export default tseslint.config({
ignores: [
    "README.md",
    ".vscode/*",
    "dist/*",
    "assets/*",
    "node_modules/*",
    "**/index.html",
    "**/index.*.html",
    "**/assets/*.html",
    "coverage/*",
    "build/*",
    "docs/.vitepress/cache/**",
    "docs/.vitepress/dist/**",
    "docs/.vitepress/theme/index.ts",
    "docs/public/**",
    "**/*.d.ts",
    ".eslintrc.js",
    "commitlint.config.cjs",
    "crawlerConfig.json",
    "eslint.config.mjs",
  ],
},
...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    )
  ),
{
  languageOptions: {
    globals: {
        ...globals.browser,
        ...globals.node,
        "dayjs": true,
    },
    sourceType: 'module',
    parser: tsParser ,
    ecmaVersion: "latest",
    // Parser Service
    parserOptions: {
      projectService: true,
      allowDefaultProject: ['*.js','*.ts'],
      tsconfigRootDir: import.meta.dirname,
  }},
  linterOptions: {
      reportUnusedDisableDirectives: 'off',
  },
  // parser: "@typescript-eslint/parser",
  plugins: {
    '@typescript-eslint': fixupPluginRules(typescriptEslint),
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    // General rules
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "object-curly-spacing": ["error", "always"],
    "arrow-parens": ["error", "always"],
    "no-console": "warn",
    "max-len": [
      "error",
      {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
      },
    ],
    "no-void": ["error", { allowAsStatement: true }],
    "no-nested-ternary": "error",
    "no-unneeded-ternary": "error",

    // TypeScript specific rules
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      {
        accessibility: "explicit",
        overrides: {
          accessors: "explicit",
          constructors: "no-public",
          methods: "explicit",
          properties: "explicit",
          parameterProperties: "explicit",
        },
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],

    // Import sorting
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  }
},
    // TypeScript files
{
    files: ["./docs/**/*.{ts,tsx}"],
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: __dirname,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-use-before-define': 'off',
    "@typescript-eslint/no-non-null-assertion": "off",
  },
    },
    // Markdown files
    {
      files: ["**/*.md"],
      plugins:{
        markdownlint: markdownlint,
      },
      rules: {
        "markdownlint/md001": "warn",
        "markdownlint/md009": "off",
        "markdownlint/md012": "off",
        "markdownlint/md013": "off",
      },
    },

);
