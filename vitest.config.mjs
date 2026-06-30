import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'build', 'dist'],
    alias: [
      { find: /^igz-controls\/images\/(.+)\.svg\?react$/, replacement: path.join(__dirname, 'src/__mocks__/svgMock.jsx') }
    ],
  },
  resolve: {
    alias: [
      { find: 'igz-controls/nextGenComponents', replacement: path.resolve(__dirname, 'src/igz-controls/nextGenComponents/index.ts') },
      { find: 'igz-controls/index.css', replacement: path.resolve(__dirname, 'src/igz-controls/index.scss') },
      { find: 'igz-controls', replacement: path.resolve(__dirname, 'src/igz-controls') },
      { find: '@igz-controls', replacement: path.resolve(__dirname, 'src/igz-controls/nextGenComponents') },
      { find: '@', replacement: path.resolve(__dirname, './src/nextGenComponents') }
    ]
  }
})
