import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import eslintPluginImport from 'eslint-plugin-import'

import { viteGlobals } from './eslint.mlrun-globals.mjs'

export default [
  { ignores: ['dist', '.__mf__temp'] },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,mjs,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...viteGlobals
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
      'no-unused-vars': process.env.NODE_ENV === 'production' ? 2 : 1,
      'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,
      'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
      semi: ['error', 'never']
    }
  }
]
