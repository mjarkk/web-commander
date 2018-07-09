// main javascript file
import './../style/style.styl'
import fetch from 'unfetch'
import encryption from '../../../shared/encryption'
import React from 'react'
import ReactDOM from 'react-dom'

let enc = encryption({
  fetch,
  server: ''
})

const Base = () => {
  return (
    <div className="base">
      <h1>Yays it's working!!!</h1>
    </div>
  )
}

ReactDOM.render(<Base />, document.getElementById('app'))