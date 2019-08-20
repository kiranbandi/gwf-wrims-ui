export default {
  delta: {
    sessionStatus: !!sessionStorage.jwt,
    username: sessionStorage.username,
    email: sessionStorage.email,

    userBasin: '',


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
    mode: -1
  }
};