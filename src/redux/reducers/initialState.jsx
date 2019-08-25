export default {
  delta: {
    sessionStatus: !!sessionStorage.jwt,
    username: sessionStorage.username,
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

      //Irrigations
      areIrrigationsVisible: true,
      visibleIrrigations: [],

      //Non-Irrigations
      areNonIrrigationsVisible: true,
      visibleNonIrrigations: [],
    },
    mode: -1,
    infoModalState: [false, 0]
  }
};