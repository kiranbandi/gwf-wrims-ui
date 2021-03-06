import toastr from './toastr';

var authorization = {};

authorization.checkloginStatus = function(nextState, replace) {
    if (!sessionStorage.jwt) {
        toastr["error"]("Please Login to view the requested page", "Authorization Error");
        replace({
            pathname: '/',
            state: { nextPathname: nextState.location.pathname }
        });
    }
}

module.exports = authorization;