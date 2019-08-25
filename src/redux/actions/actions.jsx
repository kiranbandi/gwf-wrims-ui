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

export function setInfoModalState(data) {
    return { type: types.SET_INFO_MODAL_STATE, data }
}