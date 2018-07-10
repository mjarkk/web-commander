
import React from 'react'
import {connect} from 'react-redux'

class Test extends React.Component {
  constructor(props) {
    super()
    this.state = props
  }
  add() {
    this.props.dispatch({type: 'add'})
  }
  remove() {
    this.props.dispatch({type: 'remove'})
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

export default connect(props => ({num: props.num}))(Test)