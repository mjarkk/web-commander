import React from 'react'
import {connect} from 'react-redux'

class Test extends React.Component {
  login() {
    
  }
  render() {
    return (
      <div className="login">
        <h1></h1>
        <h2>Login</h2>
      </div>
    )
  }
}

export default connect(props => ({}))(Test)