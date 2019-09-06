import React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import Main from './main'
import Register from './register'

import { hot } from 'react-hot-loader/root'

class App extends React.Component {
  render () {
    return (
      <Router>
        <Route path="/" exact component={Main}/>
        <Route path="/register" component={Register}/>
      </Router>
    )
  }
}

export default hot(App)
