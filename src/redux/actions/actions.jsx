import * as types from './actionTypes';
import _ from 'lodash';
import { hashHistory } from 'react-router';

export const setUser = () => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const uid = getState().delta.username;
        const email = getState().delta.email;
        const basin = "";

          
        // Realtime Database Reference
        var userStatusDatabaseRef = firebase.database().ref("/status/" + uid);

        var isOfflineForDatabase = {
        state: "offline",
        last_changed: firebase.database.ServerValue.TIMESTAMP
        };

        var isOnlineForDatabase = {
        state: "online",
        last_changed: firebase.database.ServerValue.TIMESTAMP
        };
        
        // Cloud Firestore Reference
        var userStatusFirestoreRef = firestore.doc('/users/' + uid);

        var isOfflineForFirestore = {
            state: "offline",
            last_changed: firestore.FieldValue.serverTimestamp(),
            email,
            basin 

        };

        var isOnlineForFirestore = {
            state: "online",
            last_changed: firestore.FieldValue.serverTimestamp(),
            email,
            basin 
        };
            

        firebase.database().ref('.info/connected').on('value', function(snapshot) {
            if (snapshot.val() === false) {
                // Instead of simply returning, we'll also set Firestore's state
                // to 'offline'. This ensures that our Firestore cache is aware
                // of the switch to 'offline.'
                userStatusFirestoreRef.set(isOfflineForFirestore);
                return;
            };

            userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
                userStatusDatabaseRef.set(isOnlineForDatabase);

                // We'll also add Firestore set here for when we come online.
                userStatusFirestoreRef.set(isOnlineForFirestore);
            });
        });
  
        //   dispatch({type: types.SET_USER, uid});
    }};

export const setUserBasin = (newBasin) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        
        const firestore = getFirestore();
        const userUID = getState().delta.username;

        let userRef = { collection: 'users', doc: userUID };
        let userRefUpdate = { basin: newBasin };


        firestore.update(userRef, userRefUpdate).then(() => {
                dispatch({type: types.SET_USER_BASIN, basin: newBasin});
                return;
            })
    }};

export function loginSuccess(userDetails) {
    sessionStorage.setItem('jwt', userDetails.token);
    sessionStorage.setItem('username', userDetails.username);
    sessionStorage.setItem('email', userDetails.email);

    let { state = { nextPathname: '/Dashboard' } } = hashHistory.getCurrentLocation();
    hashHistory.push(state.nextPathname);
    return { type: types.LOG_IN_SUCCESS };
}

export function logOutUser() {
    // remove the token and the username from browser storage
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('email');

    // redirect user to home page once he logs out
    hashHistory.push("/");
    return { type: types.LOG_OUT };
}

export function setUsername(username) {
    return { type: types.SET_USERNAME, username };
}

export function setEmail(email) {
    return { type: types.SET_EMAIL, email };
}


export function setLoginData(userDetails) {
    return dispatch => {
        dispatch(setUsername(userDetails.username));
        dispatch(setEmail(userDetails.email));
        dispatch(loginSuccess(userDetails));
    };
}

export function setLogoutData() {
    return dispatch => {
        dispatch(setUsername(''));
        dispatch(setEmail(''));
        dispatch(logOutUser());
    };
}



export function setFlowData(flowData) {
    return { type: types.SET_FLOW_DATA, flowData };
}

//Demand

export function setFilterDemand(visibleDemands) {
    return { type: types.SET_FILTER_DEMAND, visibleDemands };
}

export function toggleDemandVisibility() {
    return { type: types.SET_DEMAND_VISIBILITY };
}

//Label

export function toggleLabelVisibility() {
    return { type: types.SET_LABEL_VISIBILITY };
}

//Inflow

export function setFilterInflow(visibleInflows) {
    return { type: types.SET_FILTER_INFLOW, visibleInflows };
}

export function toggleInflowVisibility() {
    return { type: types.SET_INFLOW_VISIBILITY };
}

//Amenity

export function setFilterAmenity(visibleAmenities) {
    return { type: types.SET_FILTER_AMENITY, visibleAmenities };
}

export function toggleAmenityVisibility() {
    return { type: types.SET_AMENITY_VISIBILITY };
}

//Irrigation

export function setFilterIrrigation(visibleIrrigations) {
    return { type: types.SET_FILTER_IRRIGATION, visibleIrrigations };
}

export function toggleIrrigationVisibility() {
    return { type: types.SET_IRRIGATION_VISIBILITY };
}

//Non-Irrigation

export function setFilterNonIrrigation(visibleNonIrrigations) {
    return { type: types.SET_FILTER_NONIRRIGATION, visibleNonIrrigations };
}

export function toggleNonIrrigationVisibility() {
    return { type: types.SET_NONIRRIGATION_VISIBILITY };
}

export function setMode(mode) {

    // if mode is 2 then redirect user to dashboard     
    if (mode == 2) {
        hashHistory.push('/');
    }

    return { type: types.SET_MODE, mode }
}