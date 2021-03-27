module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': ['error', 'windows'],
    'no-underscore-dangle': 'off',
    'no-await-in-loop': 'off',
    'global-require': 'off',
    'no-console': 'off',
    'object-curly-newline': 'off',
    'no-plusplus': 'off',
    'no-constant-condition': ['error', { checkLoops: false }],
    'no-param-reassign': 'off',
  },
};
