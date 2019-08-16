module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    }
  },
  env: {
    node: true,
    jest: true,
    es6: true
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "no-console": "warn"
  },
  settings: {
    react: {
      version: "16.9.0"
    }
  },
  plugins: ["jest", "@typescript-eslint"]
};
