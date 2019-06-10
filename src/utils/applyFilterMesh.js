export default function(filterMesh, schematicData) {

    const {
        areInflowsVisible,
        visibleInflows,
        areAmenitiesVisible,
        visibleAmenities,
        areIrrigationsVisible,
        visibleIrrigations,
        areNonIrrigationsVisible,
        visibleNonIrrigations
    } = filterMesh;

    let { lines = [], artifacts = [], labels = [], markers = [] } = schematicData;



    //INFLOWS
    if (!areInflowsVisible) {
        markers = _.filter(markers, (d) => { return (d.type != 'inflow') });
        lines = _.filter(lines, (d) => { return (d.type != 'inflow') });

    } else if (visibleInflows.length > 0) {
        markers = _.filter(markers, (d) => {
            if (d.type == 'inflow') {
                return visibleInflows.indexOf(d.name) > -1;
            }
            return true;
        });

        lines = _.filter(lines, (d) => {
            if (d.type == 'inflow') {
                // since the name of a link is a combination of nodes it flow from and to
                // if we find the name of the any one node matches partially with the link we show it
                let flag = false;
                _.map(visibleInflows, (flow) => {
                    if (d.name.indexOf(flow) > -1) {
                        flag = true;
                    }
                })
                return flag;
            }
            return true;
        });
    }

    //AMENITIES
    if (!areAmenitiesVisible) {
        lines = _.filter(lines, (d) => { return (d.type != 'diversion') });
        markers = _.filter(markers, (d) => { return (d.type != 'diversion') });
    } else if (visibleAmenities.length > 0) {
        lines = _.filter(lines, (d) => {
            if (d.type == 'diversion') {
                return visibleAmenities.indexOf(d.name) > -1;
            }
            return true;
        });
    }

    //IRRIGATIONS
    if (!areIrrigationsVisible) {
        lines = _.filter(lines, (d) => { return (d.type != 'agri') });
        markers = _.filter(markers, (d) => { return (d.type != 'agri') });
    } else if (visibleIrrigations.length > 0) {

        lines = _.filter(lines, (d) => {
            if (d.type == 'agri') {
                // since the name of a link is a combination of nodes it flow from and to
                // if we find the name of the any one node matches partially with the link we show it
                let flag = false;
                _.map(visibleIrrigations, (flow) => {
                    if (d.name.indexOf(flow) > -1) {
                        flag = true;
                    }
                })
                return flag;
            }
            return true;
        });

        markers = _.filter(markers, (d) => {
            if (d.type == 'agri') {
                return visibleIrrigations.indexOf(d.name) > -1;
            }

            return true;
        });
    }

    //NON-IRRIGATIONS
    if (!areNonIrrigationsVisible) {
        lines = _.filter(lines, (d) => { return (d.type != 'demand') });
        markers = _.filter(markers, (d) => { return (d.type != 'demand') });
    } else if (visibleNonIrrigations.length > 0) {

        lines = _.filter(lines, (d) => {
            if (d.type == 'demand') {
                // since the name of a link is a combination of nodes it flow from and to
                // if we find the name of the any one node matches partially with the link we show it
                let flag = false;
                _.map(visibleNonIrrigations, (flow) => {
                    if (d.name.indexOf(flow) > -1) {
                        flag = true;
                    }
                })
                return flag;
            }
            return true;
        });

        markers = _.filter(markers, (d) => {
            if (d.type == 'demand') {
                return visibleNonIrrigations.indexOf(d.name) > -1;
            }

            return true;
        });
    }

    return { lines, markers, labels, artifacts };
}