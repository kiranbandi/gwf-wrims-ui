export default {
  delta: {
    sessionStatus: !!sessionStorage.jwt,
    username: sessionStorage.username,
    flowData: [],
    filterMesh: {
      //Demands
      areDemandsVisible: true,
      visibleDemands: [],

      //Labels
      areLabelsVisible: true,

      //Inflows
      areInflowsVisible: true,
      visibleInflows: [],

      //Amenities
      areAmenitiesVisible: true,
      visibleAmenities: [],
    }
  }
};

