import App from './App'
import { Provider } from 'react-redux'
import store from './store/toolkitStore'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
// Eagerly initialize react-text-mask in the entry chunk so its CJS/UMD module
// is resolved against React before any lazy chunks try to reference it.
// TODO: remove this import when custom react-text-mask will be included in our codebase (in progress) or when https://github.com/rollup/rollup/issues/6296 fixed (deps of vite)
import 'react-text-mask'

const RemoteApp = () => {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  )
}

export default RemoteApp
