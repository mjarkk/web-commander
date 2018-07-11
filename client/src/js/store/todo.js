export default (state = {num: 1}, action) => {
  switch (action.type) {
    case 'TODO-add':
      return Object.assign({}, state, {num: state.num + 1})
    case 'TODO-remove':
      return Object.assign({}, state, {num: state.num - 1})
    default:
      return state
  }
  return state
}