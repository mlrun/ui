import commonjs from 'vite-plugin-commonjs'
import eslint from 'vite-plugin-eslint'
import { federation } from '@module-federation/vite'
import path from 'path'

import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { defineConfig, loadEnv } from 'vite'
import { dependencies } from './package.json'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd()), '')

  const federationPlugin =
    env.VITE_FEDERATION === 'true'
      ? federation({
          filename: 'remoteEntry.js',
          name: 'mlrun',
          exposes: {
            './loadRemoteConfig': './src/loadRemoteConfig.js',
            './app': './src/main.jsx'
          },
          shared: {
            react: { requiredVersion: dependencies.react, singleton: true },
            'react-dom': { requiredVersion: dependencies['react-dom'], singleton: true }
          }
        })
      : null

  return {
    plugins: [commonjs(), react(),federationPlugin, svgr(), eslint({ failOnError: false })],
    base: env.NODE_ENV === 'production' ? env.VITE_BASE_URL : '/',
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
        'igz-controls': path.resolve(
          __dirname,
          'node_modules/iguazio.dashboard-react-controls/dist'
        )
      },
      dedupe: [
        'react',
        'react-dom',
        'classnames',
        'final-form',
        'final-form-arrays',
        'lodash',
        'prop-types',
        'react-final-form',
        'react-final-form-arrays',
        'react-modal-promise',
        'react-transition-group'
      ]
    },
    optimizeDeps: {
      force: true,
    },
    build: {
      target: 'esnext',
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
