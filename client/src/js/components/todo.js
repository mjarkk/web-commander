// This is a test file, wil later be removed.

import React from 'react'
import {connect} from 'react-redux'

class Test extends React.Component {
  add() {
    this.props.dispatch({type: 'TODO-add'})
  }
  remove() {
    this.props.dispatch({type: 'TODO-remove'})
  }
  render() {
    return (
      <div className="test">
        <h1>num: {this.props.num}</h1>
        <div>
          <button onClick={() => this.add()}>Add</button>
          <button onClick={() => this.remove()}>Remove</button>
        </div>
      </div>
    );
  }
}

export default connect(props => props.todo)(Test)