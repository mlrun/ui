import commonjs from 'vite-plugin-commonjs'
import eslint from 'vite-plugin-eslint'
import { federation } from '@module-federation/vite'
import path from 'node:path'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import { defineConfig, loadEnv } from 'vite'

import { loadMlrunProxyConfig } from './config/loadDevProxyConfig.js'
import { dependencies } from './package.json'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, path.resolve(process.cwd()), '')
  const mlrunProxyConfig = await loadMlrunProxyConfig(mode)

  // Always built so remoteEntry.js is present in every image - it's simply unused
  // when the app isn't loaded as a Module Federation remote (igz3/CE).
  const federationPlugin = federation({
    filename: 'remoteEntry.js',
    name: 'mlrun',
    // No TypeScript in this codebase, so the plugin's cross-remote .d.ts
    // sync (and its dev-only websocket) has nothing to do here.
    // TODO remove dts when migrate to TS
    dts: false,
    exposes: {
      './loadRemoteConfig': './src/loadRemoteConfig.js',
      './app': './src/main.jsx'
    },
    shared: {
      react: { requiredVersion: dependencies.react, singleton: true },
      'react-dom': { requiredVersion: dependencies['react-dom'], singleton: true }
    }
  })

  // The federation plugin injects its hostInit script as the first child of
  // <head> via a bundle-level hook that runs after transformIndexHtml, so a
  // transformIndexHtml-based fix gets overwritten. Browsers resolve a
  // <script src> against whatever base is in effect when that tag is
  // parsed, so hostInit (and everything it dynamically imports afterwards)
  // would resolve against the raw document URL instead of <base href>.
  // closeBundle runs after the build's other closeBundle hooks (plugins run
  // in array order), so patch the already-written build/index.html here.
  const baseHrefFirstPlugin = {
    name: 'base-href-first',
    apply: 'build',
    async closeBundle() {
      const fs = await import('node:fs/promises')
      const htmlPath = path.resolve(__dirname, 'build/index.html')
      const html = await fs.readFile(htmlPath, 'utf-8')
      const baseTagMatch = html.match(/<base[^>]*\/?>\s*/)
      if (!baseTagMatch) {
        this.warn('base-href-first: no <base> tag found in build/index.html, skipping reorder')
        return
      }

      const withoutBase = html.replace(baseTagMatch[0], '')
      const reordered = withoutBase.replace('<head>', `<head>\n    ${baseTagMatch[0].trim()}`)
      await fs.writeFile(htmlPath, reordered)
    }
  }

  return {
    plugins: [
      commonjs(),
      react(),
      federationPlugin,
      svgr(),
      eslint({ failOnError: false }),
      baseHrefFirstPlugin
    ],
    base: env.NODE_ENV === 'production' ? './' : '/',
    server: {
      proxy: {
        ...mlrunProxyConfig(env)
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
          __dirname,
          'node_modules/iguazio.dashboard-react-controls/dist/nextGenComponents/index.mjs'
        ),
        'igz-controls': path.resolve(
          __dirname,
          'node_modules/iguazio.dashboard-react-controls/dist'
        ),
        '@': path.resolve(__dirname, './src/nextGenComponents')
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
      force: true
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
