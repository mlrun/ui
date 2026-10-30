import checker from 'vite-plugin-checker'
import { federation } from '@module-federation/vite'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

import packageJson from './package.json' with { type: 'json' }

/**
 * Builds a single dev-server proxy entry. Returns an empty object when `target`
 * is not set, so it can be spread into `server.proxy` without extra checks.
 *
 * @param {string} prefix - request path prefix to proxy
 * @param {string | undefined} target - upstream URL (usually from a VITE_* env var)
 * @param {{ stripPrefix?: boolean, headers?: Record<string, string | undefined> }} [options]
 * @returns {Record<string, import('vite').ProxyOptions>}
 */
const proxyEntry = (prefix, target, { stripPrefix = false, headers } = {}) => {
  if (!target) return {}

  const definedHeaders = headers
    ? Object.fromEntries(Object.entries(headers).filter(([, value]) => value !== undefined))
    : null

  return {
    [prefix]: {
      target,
      changeOrigin: true,
      secure: false,
      ...(definedHeaders && { headers: definedHeaders }),
      ...(stripPrefix && {
        rewrite: path => path.replace(new RegExp(`^${prefix}`), '')
      })
    }
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')

  // Always built so remoteEntry.js is present in every image - it's simply unused
  // when the app isn't loaded as a Module Federation remote (igz3/CE).
  const federationPlugin = federation({
    filename: 'remoteEntry.js',
    name: 'mlrun',
    dts: {
      tsConfigPath: false
    },
    exposes: {
      './loadRemoteConfig': './src/loadRemoteConfig.js',
      './app': './src/main.jsx'
    },
    shared: {
      react: { requiredVersion: packageJson.dependencies.react, singleton: true },
      'react-dom': { requiredVersion: packageJson.dependencies['react-dom'], singleton: true }
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
      const htmlPath = path.resolve(import.meta.dirname, 'build/index.html')
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
      tailwindcss(),
      react(),
      federationPlugin,
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
      checker({
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"'
        },
        enableBuild: false
      }),
      baseHrefFirstPlugin
    ],
    base: env.NODE_ENV === 'production' ? './' : '/',
    server: {
      proxy: {
        ...proxyEntry('/api', env.VITE_MLRUN_API_URL, {
          headers: {
            Connection: 'keep-alive',
            'x-v3io-session-key': env.VITE_MLRUN_V3IO_ACCESS_KEY,
            'x-remote-user': 'admin'
          }
        }),
        ...proxyEntry('/nuclio', env.VITE_NUCLIO_API_URL, { stripPrefix: true }),
        ...proxyEntry('/iguazio', env.VITE_IGUAZIO_API_URL, { stripPrefix: true }),
        ...proxyEntry('/function-catalog', env.VITE_FUNCTION_CATALOG_URL, { stripPrefix: true })
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
        'react-redux',
        '@reduxjs/toolkit',
        'react-router',
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
