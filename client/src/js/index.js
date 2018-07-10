// main javascript file
import './../style/style.styl'
import fetch from 'unfetch'
import encryption from '../../../shared/encryption'
import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

// imports
import Test from './test'

const store = createStore((state, action) => {
  switch (action.type) {
    case 'add':
      return Object.assign({}, state, {num: state.num + 1})
    case 'remove':
      return Object.assign({}, state, {num: state.num - 1})
    default:
      return state
  }
  console.log(state, action)
  return state
}, {num: 1})

let enc = encryption({
  fetch,
  server: ''
})

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
        <button onClick={()=>{
          enc.login('root', 'serverpass')
          .then(data => {
            console.log('yay ingelogt')
          })
        }}>click me!!!</button>
      </div>
    )
  }
}

ReactDOM.render(<Base />, document.getElementById('app'))