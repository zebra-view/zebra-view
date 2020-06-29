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
    'no-mixed-operators': 'off',
    'no-param-reassign': 'off',
    'no-unused-expressions': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-continue': 'off',
    'max-len': 'off',
    'no-lonely-if': 'off',
    'no-nested-ternary': 'off',
    'radix': 'off',
    'no-else-return': 'off',
    'no-restricted-syntax': 'off',
    'operator-assignment': 'off',
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
