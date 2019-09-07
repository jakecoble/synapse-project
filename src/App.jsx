import React from 'react'
import { connect } from 'react-redux'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Main from './main'
import Register from './register'
import Login from './login'

import { hot } from 'react-hot-loader/root'

class App extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          { this.props.loggedIn ?
            <Route path="/" exact component={Main}/> :
            <Redirect to="/login"/>
          }
        </Switch>
      </Router>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: !!state.userId
  }
}

export default connect(
  mapStateToProps
)(hot(App))
