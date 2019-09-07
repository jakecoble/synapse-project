import React from 'react'
import { connect } from 'react-redux'

import Account from '../account'

class Main extends React.Component {
  render () {
    return (
      <div>
        <h1>Welcome back, {this.props.name}!</h1>

        <h2>Accounts</h2>
        {this.props.accounts.map(account => <Account key={account.id} {...account} />)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    name: state.name,
    accounts: state.accounts || []
  }
}

export default connect(
  mapStateToProps
)(Main)
