import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers/rootReducer';
// restricting extension in production using process.env.NODE_ENV which is set 'production'
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import thunk from 'redux-thunk';

import { reduxFirestore, getFirestore } from 'redux-firestore'
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase'

import firebaseConfig from '../../config/firebase_config'


export default function configureStore() {
  return createStore(
    rootReducer, 
    (process.env.NODE_ENV == 'development' ?
    composeWithDevTools(
      applyMiddleware(thunk.withExtraArgument({getFirestore, getFirebase})),
      reduxFirestore(firebaseConfig),
      reactReduxFirebase(firebaseConfig))
    : 
    compose(
      applyMiddleware(thunkthunk.withExtraArgument({getFirestore, getFirebase})),
      reduxFirestore(firebaseConfig),
      reactReduxFirebase(firebaseConfig)
    ))
  );

  // return createStore(rootReducer, 
  //   (process.env.NODE_ENV == 'development' ? 
  //   composeWithDevTools(applyMiddleware(thunk)) : 
  //   applyMiddleware(thunk)));  


}