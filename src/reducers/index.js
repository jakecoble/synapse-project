import { LOG_IN, RECEIVE_ACCOUNTS } from '../actions'

const rootReducer = (state = {}, action) => {
  switch(action.type) {
    case LOG_IN:
      return Object.assign({}, state, {
        userId: action.id,
        name: action.name
      })
    case RECEIVE_ACCOUNTS:
      return Object.assign({}, state, {
        accounts: action.accounts
      })
    default:
      return state
  }
}

export default rootReducer
