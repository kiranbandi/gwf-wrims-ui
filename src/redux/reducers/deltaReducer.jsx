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
    case types.SET_EMAIL:
      return Object.assign({}, state, { email: action.email })
    case types.SET_FLOW_DATA:
      return Object.assign({}, state, { flowData: action.flowData })

    //Demand
    case types.SET_DEMAND_VISIBILITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areDemandsVisible: !state.filterMesh.areDemandsVisible } })
    case types.SET_FILTER_DEMAND:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, visibleDemands: action.visibleDemands } })

    //Label
    case types.SET_LABEL_VISIBILITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areLabelsVisible: !state.filterMesh.areLabelsVisible } })

    //Inflow
    case types.SET_INFLOW_VISIBILITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areInflowsVisible: !state.filterMesh.areInflowsVisible } })
    case types.SET_FILTER_INFLOW:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, visibleInflows: action.visibleInflows } })

    //Amenity
    case types.SET_AMENITY_VISIBILITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areAmenitiesVisible: !state.filterMesh.areAmenitiesVisible } })
    case types.SET_FILTER_AMENITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, visibleAmenities: action.visibleAmenities } })

    //Irrigation
    case types.SET_IRRIGATION_VISIBILITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areIrrigationsVisible: !state.filterMesh.areIrrigationsVisible } })
    case types.SET_FILTER_IRRIGATION:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, visibleIrrigations: action.visibleIrrigations } })

    //Non-Irrigation
    case types.SET_NONIRRIGATION_VISIBILITY:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, areNonIrrigationsVisible: !state.filterMesh.areNonIrrigationsVisible } })
    case types.SET_FILTER_NONIRRIGATION:
      return Object.assign({}, state, { filterMesh: { ...state.filterMesh, visibleNonIrrigations: action.visibleNonIrrigations } })
    
    case types.SET_MODE: 
      return Object.assign({}, state, { mode: action.mode } )

    default:
      return state;
  }
}

