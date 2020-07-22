const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://3.12.145.63:30080',
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        proxyReq.setHeader(
          'x-v3io-session-key',
          'eea5be29-263f-4505-9eed-9a0382aee31e'
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
