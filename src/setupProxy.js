const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://18.221.106.241:30080',
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
