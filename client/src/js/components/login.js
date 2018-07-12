import React from 'react'
import {connect} from 'react-redux'
import {appName} from '../../../../shared/info'

class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      password: '',
      username: ''
    }
  }
  login() {
    
  }
  render() {
    return (
      <div className="login">
        <div className="title">
          <h1>{appName}</h1>
        </div>
        <div className="input">
          <h2>Login</h2>
          <input type="text" placeholder="username" />
          <input type="password" placeholder="password" />
          <button>Login</button>
        </div>
      </div>
    )
  }
}

export default connect(props => props.login)(Login)