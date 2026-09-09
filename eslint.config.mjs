import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import globals from 'globals'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintPluginImport from 'eslint-plugin-import'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'
import tseslint from 'typescript-eslint'

const noForwardRef = [
  process.env.NODE_ENV === 'production' ? 2 : 1,
  {
    selector: "CallExpression[callee.name='forwardRef']",
    message:
      'Avoid forwardRef — use a function component with ref as a prop (React 19) or named ref props.'
  },
  {
    selector: "CallExpression[callee.type='MemberExpression'][callee.property.name='forwardRef']",
    message:
      'Avoid React.forwardRef — use a function component with ref as a prop (React 19) or named ref props.'
  }
]

const reactRefreshViteConfig = reactRefresh.configs.vite()
const reactRefreshRuleOptions = {
  ...reactRefreshViteConfig.rules['react-refresh/only-export-components'][1],
  extraHOCs: ['connect']
}

export default [
  { ignores: ['dist', 'build'] },
  { ignores: ['!.storybook'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        ...globals.vitest
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      import: eslintPluginImport
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'import/no-anonymous-default-export': 'off',
      'import/named': process.env.NODE_ENV === 'production' ? 2 : 1,
      'no-unused-vars': [
        process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        { ignoreRestSiblings: true }
      ],
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
      'react/prop-types': ['error', { ignore: ['ref'] }],
      'no-restricted-syntax': noForwardRef
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      '@typescript-eslint': tseslint.plugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/no-unescaped-entities': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': process.env.NODE_ENV === 'production' ? 2 : 1,
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
      'no-restricted-syntax': noForwardRef
    }
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ignores: ['**/*.stories.*', '**/*.story.*', '**/*.test.*', '**/*.spec.*'],
    plugins: reactRefreshViteConfig.plugins,
    rules: {
      ...reactRefreshViteConfig.rules,
      'react-refresh/only-export-components': ['warn', reactRefreshRuleOptions]
    }
  },
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.test.js', '**/*.test.jsx'],
    rules: {
      'import/named': 'off',
      'no-restricted-syntax': 'off',
      'react-refresh/only-export-components': 'off'
    }
  },
  eslintPluginPrettierRecommended
]
