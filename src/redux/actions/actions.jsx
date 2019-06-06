import * as types from './actionTypes';
import _ from 'lodash';
import { hashHistory } from 'react-router';


export function loginSuccess(userDetails) {
    sessionStorage.setItem('jwt', userDetails.token);
    sessionStorage.setItem('username', userDetails.username);
    let { state = { nextPathname: '/Dashboard' } } = hashHistory.getCurrentLocation();
    hashHistory.push(state.nextPathname);
    return { type: types.LOG_IN_SUCCESS };
}

export function logOutUser() {
    // remove the token and the username from browser storage
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('username');
    // redirect user to home page once he logs out
    hashHistory.push("/");
    return { type: types.LOG_OUT };
}

export function setUsername(username) {
    return { type: types.SET_USERNAME, username };
}

export function setLoginData(userDetails) {
    return dispatch => {
        dispatch(setUsername(userDetails.username));
        dispatch(loginSuccess(userDetails));
    };
}

export function setLogoutData() {
    return dispatch => {
        dispatch(setUsername(''));
        dispatch(logOutUser());
    };
}



export function setFlowData(flowData) {
    return { type: types.SET_FLOW_DATA, flowData };
}

export function setFilterDemand(visibleDemands) {
    return { type: types.SET_FILTER_DEMAND, visibleDemands };
}

export function toggleDemandVisibility() {
    return { type: types.SET_DEMAND_VISIBILITY };
}

export function toggleLabelVisibility() {
    return { type: types.SET_LABEL_VISIBILITY };
}

export function setFilterInflow(visibleInflows) {
    return { type: types.SET_FILTER_INFLOW, visibleInflows };
}

export function toggleInflowVisibility() {
    return { type: types.SET_INFLOW_VISIBILITY };
}

export function setFilterAmenity(visibleAmenities) {
    return { type: types.SET_FILTER_AMENITY, visibleAmenities };
}

export function toggleAmenityVisibility() {
    return { type: types.SET_AMENITY_VISIBILITY };
}
