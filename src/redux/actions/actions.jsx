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
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('username');

    hashHistory.push("/");
    return { type: types.LOG_OUT };
}

export function setUserDetails(userDetails) {
    return { type: types.SET_USER_DATA, userDetails };
}

export function setLoginData(userDetails) {
    return dispatch => {
        dispatch(setUserDetails(userDetails));
        dispatch(loginSuccess(userDetails));
    };
}

export function setLogoutData() {
    return dispatch => {
        dispatch(setUserDetails({}));
        dispatch(logOutUser());
    };
}











