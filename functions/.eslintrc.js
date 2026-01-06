module.exports = {
  root: true,
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'google',
  ],
  rules: {
    'comma-dangle': 0,
    'linebreak-style': 0,
    'max-len': ['error', { 'code': 150 }],
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single']
  },
};
