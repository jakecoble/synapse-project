const users = (state = [], action) => {
  switch (action.type) {
    case 'SET_USER':
      return [
        ...state,
        {
          firstName: action.firstname,
          lastName: action.lastName
        }
      ]
    default:
      return state
  }
}

export default users
