module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'max-len': ['error', { 'code': 150 }],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single']
  },
};
