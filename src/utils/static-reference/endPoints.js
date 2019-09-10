var endPointRoot;

endPointRoot = 'https://gwf-hci.usask.ca/api';
// When testing a local server uncomment below but for most
// cases we will be working with the production server , I know this is not the
// the most efficient solution to do this (O_O) !!!
// endPointRoot = 'http://localhost:8081/api'

var endPoints = {
    loginGoogle: endPointRoot + "/auth/google-login",
    loginPaws: endPointRoot + "/auth/paws-login",
    getFlowData: endPointRoot + "/records/flow-data",
    getYearlyData: endPointRoot + "/records/yearly-flow-data",
    getNodes: endPointRoot + "/nodes/get-nodes",
    registerNode: endPointRoot + "/nodes/register-node",
    updateNode: endPointRoot + "/nodes/update-node",
    deleteNode: endPointRoot + "/nodes/delete-node"
}

module.exports = endPoints;