// main javascript file
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

// Custom Imports
import './../style/style.styl'
import Todo from './components/todo'
import Login from './components/login'
import store from './store/index'

class Base extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <Provider store={store}>
        <div className="base">
          <Login />
          <Todo />
        </div>
      </Provider>
    )
  }
}

ReactDOM.render(<Base />, document.getElementById('app'))