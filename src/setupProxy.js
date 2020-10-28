const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_MLRUN_API_URL,
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader(
          'x-v3io-session-key',
          process.env.REACT_APP_MLRUN_V3IO_ACCESS_KEY
        )
      }
    })
  )

  app.use(
    '/nuclio',
    createProxyMiddleware({
      target: process.env.REACT_APP_NUCLIO_API_URL,
      pathRewrite: {
        '^/nuclio': ''
      },
      changeOrigin: true
    })
  )

  app.use(
    '/function-catalog',
    createProxyMiddleware({
      target: process.env.REACT_APP_FUNCTION_CATALOG_URL,
      pathRewrite: {
        '^/function-catalog': ''
      },
      changeOrigin: true
    })
  )
}
