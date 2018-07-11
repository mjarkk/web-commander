// main javascript file
import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'

// Custom Imports
import './../style/style.styl'
import Test from './components/test'
import store from './store/index'

class Base extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div className="base">
        <Provider store={store}>
          <Test />
        </Provider>
      </div>
    )
  }
}

ReactDOM.render(<Base />, document.getElementById('app'))