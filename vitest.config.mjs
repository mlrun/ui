import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'node:path'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        jsxRuntime: 'classic'
      },
      oxcOptions: {
        jsx: {
          runtime: 'classic'
        }
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'build', 'dist'],
    alias: [
      {
        find: /^igz-controls\/images\/(.+)\.svg\?react$/,
        replacement: path.join(import.meta.dirname, 'src/__mocks__/svgMock.jsx')
      }
    ]
  },
  resolve: {
    alias: [
      {
        find: 'igz-controls/nextGenComponents',
        replacement: path.resolve(
          import.meta.dirname,
          'src/igz-controls/nextGenComponents/index.ts'
        )
      },
      {
        find: 'igz-controls/index.css',
        replacement: path.resolve(import.meta.dirname, 'src/igz-controls/index.scss')
      },
      {
        find: 'igz-controls',
        replacement: path.resolve(import.meta.dirname, 'src/igz-controls')
      },
      {
        find: '@',
        replacement: path.resolve(import.meta.dirname, './src/nextGenComponents')
      }
    ]
  }
})
