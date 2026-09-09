import path from 'node:path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig, loadEnv } from 'vite'
import eslint from 'vite-plugin-eslint'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')

  return {
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
      }),
      eslint({ failOnError: false })
    ],
    base: env.NODE_ENV === 'production' ? env.VITE_PUBLIC_URL : '/',
    server: {
      proxy: {
        '/api': env.VITE_MLRUN_API_URL
          ? {
              target: env.VITE_MLRUN_API_URL,
              changeOrigin: true,
              headers: {
                Connection: 'keep-alive',
                'x-v3io-session-key': env.VITE_MLRUN_V3IO_ACCESS_KEY,
                'x-remote-user': 'admin'
              }
            }
          : undefined,
        '/nuclio': env.VITE_NUCLIO_API_URL
          ? {
              target: env.VITE_NUCLIO_API_URL,
              changeOrigin: true,
              rewrite: path => path.replace(/^\/nuclio/, '')
            }
          : undefined,
        '/iguazio': env.VITE_IGUAZIO_API_URL
          ? {
              target: env.VITE_IGUAZIO_API_URL,
              changeOrigin: true,
              rewrite: path => path.replace(/^\/iguazio/, '')
            }
          : undefined,
        '/function-catalog': env.VITE_FUNCTION_CATALOG_URL
          ? {
              target: env.VITE_FUNCTION_CATALOG_URL,
              changeOrigin: true,
              rewrite: path => path.replace(/^\/function-catalog/, '')
            }
          : undefined
      },
      fs: {
        strict: false
      },
      hmr: {
        protocol: 'ws'
      },
      port: 3000
    },
    resolve: {
      alias: {
        'igz-controls/nextGenComponents': path.resolve(
          import.meta.dirname,
          'src/igz-controls/nextGenComponents/index.ts'
        ),
        'igz-controls/index.css': path.resolve(import.meta.dirname, 'src/igz-controls/index.scss'),
        'igz-controls': path.resolve(import.meta.dirname, 'src/igz-controls'),
        '@': path.resolve(import.meta.dirname, './src/nextGenComponents')
      },
      dedupe: ['react', 'react-dom']
    },
    optimizeDeps: {
      force: true
    },
    build: {
      sourcemap: true,
      outDir: 'build',
      chunkSizeWarningLimit: 3000
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          sourceMap: true,
          api: 'modern'
        }
      }
    }
  }
})
