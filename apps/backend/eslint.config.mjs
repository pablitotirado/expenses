// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

// Force deploy 3
export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      // Reglas estrictas para variables no utilizadas
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off', // Desactivar regla base, usar la de TypeScript

      // Reglas estrictas para imports no utilizados
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Reglas estrictas para tipos
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',

      // Reglas para promesas
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Reglas para null/undefined
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',

      // Reglas para funciones
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-readonly': 'error',

      // Reglas para arrays y objetos
      '@typescript-eslint/prefer-ts-expect-error': 'error',
      '@typescript-eslint/no-array-constructor': 'error',
      '@typescript-eslint/no-var-requires': 'error',

      // Reglas para nombres
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'default', format: ['camelCase'] },
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE'] },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'enumMember', format: ['UPPER_CASE'] },
        {
          selector: 'objectLiteralProperty',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeProperty',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Permitir propiedades específicas de AWS
        {
          selector: 'objectLiteralProperty',
          format: null,
          custom: {
            regex:
              '^(Service|Version|Statement|Effect|Action|Resource|Name|Type|Project|Environment|ManagedBy|Owner)$',
            match: true,
          },
        },
      ],

      // Reglas para comentarios
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/no-require-imports': 'error',

      // Reglas para debugging
      'no-console': 'warn',
      'no-debugger': 'error',

      // Reglas para código muerto
      'no-unreachable': 'error',
      'no-constant-condition': 'error',
    },
  },
);
