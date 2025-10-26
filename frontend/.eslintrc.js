module.exports = {
  root: true,
  extends: ['@react-native'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: { presets: ['module:metro-react-native-babel-preset'] },
  },
  rules: {
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
      rules: {
        '@typescript-eslint/no-unused-vars': [
          'warn',
          { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
        ],
      },
    },
  ],
  ignorePatterns: ['babel.config.js', 'metro.config.js', 'react-native.config.js', 'jest.config.js'],
};
