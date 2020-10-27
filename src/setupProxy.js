const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://3.129.174.119:30080',
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader(
          'x-v3io-session-key',
          '1826d9df-033d-4ac2-b13a-1f8f9d14aaeb'
        )
      }
    })
  )

  app.use(
    '/nuclio',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8070',
      pathRewrite: {
        '^/nuclio': ''
      },
      changeOrigin: true
    })
  )

  app.use(
    '/function-catalog',
    createProxyMiddleware({
      target: 'https://raw.githubusercontent.com/mlrun/functions/master',
      pathRewrite: {
        '^/function-catalog': ''
      },
      changeOrigin: true
    })
  )
}
