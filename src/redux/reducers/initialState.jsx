export default {
  delta: {
    sessionStatus: !!sessionStorage.jwt,
    username: sessionStorage.username,
    flowData: [],
    filterMesh: {
      areDemandsVisible: true,
      visibleDemands: [],
      areLabelsVisible: true,
      areInflowsVisible: true,
      visibleInflows: [],
    }
  }
};

