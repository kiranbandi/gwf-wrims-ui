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
    case types.SET_FLOW_DATA:
      return Object.assign({}, state, { flowData: action.flowData })
    case types.SET_DEMAND_VISIBILITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areDemandsVisible: !state.filterMesh.areDemandsVisible } })
    case types.SET_FILTER_DEMAND:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, visibleDemands: action.visibleDemands } })
    case types.SET_LABEL_VISIBILITY: // *ADDED
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areLabelsVisible: !state.filterMesh.areLabelsVisible } })

    default:
      return state;
  }
}


