const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://3.128.234.166:30080',
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader(
          'x-v3io-session-key',
          '266f6eb5-1548-402a-9c94-ae2e5e710b93'
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
