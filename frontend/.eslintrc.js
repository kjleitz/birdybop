/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

// module.exports = {
//   "root": true,
//   "extends": [
//     "plugin:vue/vue3-essential",
//     "eslint:recommended",
//     "@vue/eslint-config-typescript/recommended"
//   ],
//   "env": {
//     "vue/setup-compiler-macros": true
//   }
// }


module.exports = {
  root: true,
  env: {
    // browser: true,
    // node: true,
    es2021: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
  ],
  // parserOptions: {
  //   ecmaVersion: 2020,
  // },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/semi": ["error", "always", { "omitLastInOneLineBlock": true }],
    "comma-dangle": ["error", "always-multiline"],
    "eqeqeq": ["error", "always"],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "semi": "off", // conflicts with TS' semi rule; see https://github.com/typescript-eslint/typescript-eslint/issues/123
    "no-trailing-spaces": "error",
    "vue/multi-word-component-names": "off",
  },
};
