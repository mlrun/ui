import App from './App'
import { Provider } from 'react-redux'
import store from './store/toolkitStore'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

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
