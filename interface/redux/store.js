import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux'
import reducers from './reducer'
import logger from 'redux-logger'

const rootReducer = combineReducers({ reducers })

export const Store = createStore(reducers, applyMiddleware(thunk, logger))
