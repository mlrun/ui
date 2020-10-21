const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://3.14.170.218:30080',
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader(
          'x-v3io-session-key',
          '8851b9d1-7813-4d36-8500-655e2091bb8f'
        )
      }
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
