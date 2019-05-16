import toastr from './toastr';
import axios from 'axios';
import endPoints from './endPoints';
import _ from 'lodash';

var requestServer = {};

requestServer.requestLogin = function(ticket) {
    return new Promise((resolve, reject) => {
        axios.post(endPoints.login, { ticket, isDevSite: (process.env.NODE_ENV == 'development') })
            .then((response) => {
                if (response.data.isRegistered) {
                    resolve(response.data);
                } else {
                    toastr["error"]("Sorry but we don't have your information on our records.Please drop a mail to our IT team to get registered", "User Not Registered");
                    reject();
                }
            })
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