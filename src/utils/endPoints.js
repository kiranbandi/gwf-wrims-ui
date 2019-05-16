var endPointRoot;

endPointRoot = 'https://gwf.usask.ca/api';
// When testing a local server uncomment below but for most
// cases we will be working with the prod server , I know this is not the
// the most efficient solution to do this (O_O) !!!
// endPointRoot = 'http://localhost:8081/'

var endPoints = {
    login: endPointRoot + "/authenticate"
}

module.exports = endPoints;