var endPointRoot;

endPointRoot = 'https://gwf.usask.ca/api';
// When testing a local server uncomment below but for most
// cases we will be working with the prod server , I know this is not the
// the most efficient solution to do this (O_O) !!!
endPointRoot = 'http://23.20.4.93:8081/api'

var endPoints = {
    loginGoogle: endPointRoot + "/auth/google-login",
    loginPaws: endPointRoot + "/auth/paws-login",
    getCatalog: endPointRoot + "/dss/get-catalog",
    getPathData: endPointRoot + "/dss/get-pathdata"
}

module.exports = endPoints;