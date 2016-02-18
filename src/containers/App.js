import React, { Component } from 'react' // eslint-disable-line no-unused-vars
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'

class App extends Component {

  componentWillMount() {
    let { dispatch, isAuthenticated, push } = this.props

    if (!isAuthenticated) {
      dispatch(push('/login'))
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

function inject(state) {
  return {
    isAuthenticated: state.reducers.auth.get('isAuthenticated'),
    push: routeActions.push
  }
}

export default connect(inject)(App)
