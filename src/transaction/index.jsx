const Transaction = (props) => {
  var {
    id,
    amount,
    note,
    status
  } = props

  return (
    <li>
      <div>{ id }</div>
      <div>{ amount.amount } { amount.currency }</div>
      <div>{ note }</div>
      <div>{ status }</div>
    </li>
  )
}

export default Transaction
