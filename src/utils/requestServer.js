import toastr from './toastr';
import axios from 'axios';
import endPoints from './endPoints';
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
        axios.get(endPoints.getCatalog)
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