// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  env: {
    browser: true,
    es2021: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
