import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import CssBaseline from '@material-ui/core/CssBaseline'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0fddaf'
    },
    secondary: {
      main: '#272c41'
    }
  },
  props: {
    MuiButtonBase: {
      centerRipple: true
    }
  },
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
})

ReactDOM.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
