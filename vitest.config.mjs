import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'build', 'dist'],
    server: {
      deps: {
        inline: ['iguazio.dashboard-react-controls']
      },
    },
  },
  resolve: {
    alias: {
      'igz-controls': path.resolve(__dirname, './node_modules/iguazio.dashboard-react-controls/dist')
    }
  }
})
