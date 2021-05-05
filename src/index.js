import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'
import store from './store/store'
import { Provider } from 'react-redux'

fetch(`${process.env.PUBLIC_URL}/config.json`, { cache: 'no-store' })
  .then(response => response.json())
  .then(json => {
    window.mlrunConfig = json
  })
  .then(() => {
    ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>,
      document.getElementById('root')
    )
  })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
