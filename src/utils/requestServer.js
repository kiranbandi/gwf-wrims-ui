import toastr from './toastr';
import axios from 'axios';
import endPoints from './static-reference/endPoints';
import _ from 'lodash';

var requestServer = {};

requestServer.requestLogin = function(access_token, isPAWS) {
    return new Promise((resolve, reject) => {
        axios.post(isPAWS ? endPoints.loginPaws : endPoints.loginGoogle, { access_token, isDevSite: (process.env.NODE_ENV == 'development') })
            .then((response) => { resolve(response.data) })
            .catch((err) => errorCallback(err, reject));
    });
}

requestServer.getFileCatalog = function() {
    return new Promise((resolve, reject) => {
        axios.get(endPoints.getCatalog, { headers: { 'authorization': 'Bearer ' + sessionStorage.jwt } })
            .then((response) => { resolve(response.data) })
            .catch((err) => errorCallback(err, reject));
    });
}

requestServer.getPathData = function(path) {
    return new Promise((resolve, reject) => {
        axios.post(endPoints.getPathData, {...path }, { headers: { 'authorization': 'Bearer ' + sessionStorage.jwt } })
            .then((response) => { resolve(response.data) })
            .catch((err) => errorCallback(err, reject));
    });
}

requestServer.getFlowData = function(params) {
    return new Promise((resolve, reject) => {
        axios.post(endPoints.getFlowData, {...params }, { headers: { 'authorization': 'Bearer ' + sessionStorage.jwt } })
            .then((response) => { resolve(response.data) })
            .catch((err) => errorCallback(err, reject));
    });
}

requestServer.getYearlyData = function(params) {
    return new Promise((resolve, reject) => {
        axios.post(endPoints.getYearlyData, {...params }, { headers: { 'authorization': 'Bearer ' + sessionStorage.jwt } })
            .then((response) => { resolve(response.data) })
            .catch((err) => errorCallback(err, reject));
    });
}

requestServer.getNodes = function(modelID) {
    return new Promise((resolve, reject) => {
        axios.post(endPoints.getNodes, { modelID }, { headers: { 'authorization': 'Bearer ' + sessionStorage.jwt } })
            .then((response) => { resolve(response.data) })
            .catch((err) => errorCallback(err, reject));
    });
}

requestServer.registerNode = function(markerParams) {
    return new Promise((resolve, reject) => {
        axios.post(endPoints.registerNode, {...markerParams }, { headers: { 'authorization': 'Bearer ' + sessionStorage.jwt } })
            .then((response) => { resolve(response.data) })
            .catch((err) => errorCallback(err, reject));
    });
}


function errorCallback(error, reject) {
    if (error.response && error.response.data) {
        toastr["error"](error.response.data.message, "ERROR");
    } else {
        toastr["error"]("Error connecting to the server", "ERROR");
    }
    reject();
}

module.exports = requestServer;