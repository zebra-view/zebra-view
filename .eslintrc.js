module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-mixed-operators': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-param-reassign': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-expressions': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-plusplus': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-underscore-dangle': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-continue': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'max-len': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-lonely-if': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-nested-ternary': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-restricted-syntax': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
