module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  plugins: ["node", "eslint-plugin", "prettier"],
  extends: [
    "plugin:node/recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    "prettier/prettier": ["off", {}, { usePrettierrc: true }],
  },
  overrides: [
    {
      files: ["*.md"],
      parser: "eslint-plugin-markdownlint/parser",
      extends: ["plugin:markdownlint/recommended"],
      rules: {
        "markdownlint/md001": "warn",
        "markdownlint/md009": "off",
        "markdownlint/md012": "off",
        "markdownlint/md013": "off",
        "markdownlint/md022": "off",
        "markdownlint/md031": "off",
        "markdownlint/md032": "off",
        "markdownlint/md033": "off",
        "markdownlint/md025": "off",
      },
    },
  ],
};
