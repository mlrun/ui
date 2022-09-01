/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
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
        proxyReq.setHeader('x-remote-user', 'admin')
      }
    })
  )

  if (process.env.REACT_APP_NUCLIO_API_URL) {
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
  }

  if (process.env.REACT_APP_IGUAZIO_API_URL) {
    app.use(
      '/iguazio',
      createProxyMiddleware({
        target: process.env.REACT_APP_IGUAZIO_API_URL,
        pathRewrite: {
          '^/iguazio': ''
        },
        changeOrigin: true
      })
    )
  }

  if (process.env.REACT_APP_FUNCTION_CATALOG_URL) {
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
}
