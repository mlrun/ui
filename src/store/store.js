import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '../reducers/reducers'

const composeEnhansers = compose
const middlewere = [thunk]

const store = createStore(
  rootReducer,
  composeEnhansers(applyMiddleware(...middlewere))
)

export default store
