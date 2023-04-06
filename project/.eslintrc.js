// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  plugins: ['prettier', 'jest'],
  extends: ['eslint:recommended', 'plugin:jest/recommended', 'prettier'],
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
