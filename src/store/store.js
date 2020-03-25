import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'

import rootReducer from '../reducers/reducers'

const composeEnhansers = compose
const middlewere = [thunk]

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({
    collapsed: true,
    errorTransformer: ({ stack }) => {
      // console.error(stack)
      return stack
    }
  })

  middlewere.push(logger)
}

const store = createStore(
  rootReducer,
  composeEnhansers(applyMiddleware(...middlewere))
)

export default store
