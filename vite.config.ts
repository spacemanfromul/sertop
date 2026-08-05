import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

function dashboardBasicAuth(username: string, password: string) {
  const middleware = (req, res, next) => {
    if (!/^\/dashboard(?:[/?]|$)/.test(req.url ?? '')) {
      next()
      return
    }

    const authorization = req.headers.authorization
    const expected = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`

    if (authorization === expected) {
      next()
      return
    }

    res.statusCode = 401
    res.setHeader('WWW-Authenticate', 'Basic realm="Dashboard", charset="UTF-8"')
    res.end('Authentication required')
  }

  return {
    name: 'dashboard-basic-auth',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
  plugins: [
    figmaAssetResolver(),
    dashboardBasicAuth(env.DASHBOARD_USERNAME, env.DASHBOARD_PASSWORD),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    proxy: {
      '/api/analytics': 'http://127.0.0.1:8787',
      '/api/dashboard': 'http://127.0.0.1:8787',
    },
  },
  }
})
