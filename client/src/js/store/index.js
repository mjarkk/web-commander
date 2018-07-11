import {createStore, combineReducers} from 'redux'

import login from './login'
import todo from './todo'

const store = createStore(combineReducers({
  todo,
  login
}))

export default store