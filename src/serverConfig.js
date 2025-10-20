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

export const createProxyConfig = env => ({
  '/api': env.VITE_MLRUN_API_URL && {
    target: env.VITE_MLRUN_API_URL,
    changeOrigin: true,
    headers: {
      Connection: 'keep-alive',
      'x-v3io-session-key': env.VITE_MLRUN_V3IO_ACCESS_KEY,
      'x-remote-user': 'admin'
    }
  },
  '/nuclio': env.VITE_NUCLIO_API_URL && {
    target: env.VITE_NUCLIO_API_URL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/nuclio/, '')
  },
  '/iguazio': env.VITE_IGUAZIO_API_URL && {
    target: env.VITE_IGUAZIO_API_URL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/iguazio/, '')
  },
  '/function-catalog': env.VITE_FUNCTION_CATALOG_URL && {
    target: env.VITE_FUNCTION_CATALOG_URL,
    changeOrigin: true,
    rewrite: path => path.replace(/^\/function-catalog/, '')
  }
})

void ['rewrite']
