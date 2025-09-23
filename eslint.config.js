import tseslint from 'typescript-eslint';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
  // Ignore build artifacts and vendor directories
  {
    ignores: ['node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/*.d.ts'],
  },

  // TypeScript recommended settings (flat config)
  ...tseslint.configs.recommended,

  // Project rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // General rules
      'consistent-return': 'warn',
      // 'no-console': 'warn',

      // Prefer plugin rules for unused imports/vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Import sorting
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^\\u0000'], // Side effect imports.
            ['^node:'], // Node builtins.
            ['^react', '^@?\\w'], // Packages. `react` related packages come first.
            ['^(@untitled-game|@)/'], // Internal packages
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports. Put `..` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Other relative imports.
            ['^.+\\.s?css$'], // Style imports.
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
    },
  },
];
