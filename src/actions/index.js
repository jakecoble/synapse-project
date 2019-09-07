import axios from 'axios'

export const LOG_IN = 'LOG_IN'
export const RECEIVE_ACCOUNTS = 'RECEIVE_ACCOUNTS'

export function receiveAccounts (accounts) {
  return {
    type: RECEIVE_ACCOUNTS,
    accounts
  }
}

export function logIn ({ id, name }) {
  return {
    type: LOG_IN,
    id,
    name
  }
}

export function fetchAccounts () {
  return dispatch => {
    axios.get('/api/accounts')
         .then(({ data }) => dispatch(receiveAccounts(data)))
         .catch(error => console.log(error))
  }
}
