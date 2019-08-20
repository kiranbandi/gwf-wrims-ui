import { combineReducers } from 'redux';
import delta from './deltaReducer';
import { firestoreReducer } from 'redux-firestore'

const rootReducer = combineReducers({
  // short hand property names , we only have one reducer for now
  // but will have more than one in future as project expands
  delta,
  firestore: firestoreReducer

})

export default rootReducer;  