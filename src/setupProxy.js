const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://13.58.191.176:30080',
      changeOrigin: true
    })
  )
  app.use(
    '/function-catalog',
    createProxyMiddleware({
      target:
        'https://raw.githubusercontent.com/mlrun/functions/master/catalog.json',
      pathRewrite: {
        '^/function-catalog': ''
      },
      changeOrigin: true
    })
  )
}
