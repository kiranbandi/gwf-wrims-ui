import * as types from '../actions/actionTypes';
import initialState from './initialState';

// Perils of having a nested tree strucutre in the Redux State XD XD XD 
export default function deltaReducer(state = initialState.delta, action) {
  switch (action.type) {
    case types.LOG_IN_SUCCESS:
      return Object.assign({}, state, { sessionStatus: true })
    case types.LOG_OUT:
      return Object.assign({}, state, { sessionStatus: false })
    case types.SET_USERNAME:
      return Object.assign({}, state, { username: action.username })
    default:
      return state;
  }
}
