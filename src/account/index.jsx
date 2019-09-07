import React from 'react'

import Transaction from '../transaction'

class Account extends React.Component {
  render () {
    var {
      type,
      nickname,
      balance,
      transactions
    } = this.props

    return (
      <div>
        <h3>{type === 'DEPOSIT-US' ? 'Checking' : 'Savings'}: {nickname}</h3>
        <div>Balance: {balance.amount} {balance.currency}</div>

        <h4>Transactions</h4>
        <ul>
          {transactions && transactions.map(trans => <Transaction {...trans} />)}
        </ul>
      </div>
    )
  }
}

export default Account
