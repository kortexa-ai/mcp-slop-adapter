import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'

import globals from 'globals'

export default tseslint.config(
    {
        ignores: [
            '**/*.test.{js,ts}',
            '**/*.spec.{js,ts}',
            'node_modules/**',
            'build/**',
            'dist/**',
            'dev-dist/**',
            'coverage/**',
        ]
    },
    {
        files: ['**/*.js'],
        extends: [js.configs.recommended],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {...globals.browser, ...globals.node}
        }
    },
    {
        files: ['**/*.ts'],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
        ],
        plugins: {
            import: importPlugin
        },
        settings: {
            'import/resolver': {
                typescript: {
                    project: ['./tsconfig.{app,node}.json'],
                },
            },
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {...globals.browser, ...globals.node},
            parser: tseslint.parser,
            parserOptions: {
                project: ['./tsconfig.{app,node}.json'],
                tsconfigRootDir: '.',
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                { prefer: 'type-imports' },
            ],
            '@typescript-eslint/no-import-type-side-effects': 'error',
        },
    },
)