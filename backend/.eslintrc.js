module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: '../backend/tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      rules: { 'no-console': 'off' },
    },
  ],
};
