/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ["!**/.server", "!**/.client"],

  extends: ["@remix-run/eslint-config", "@remix-run/eslint-config/node"],
};
