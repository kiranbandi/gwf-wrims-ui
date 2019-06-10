export default function(filterMesh, schematicData) {
    const {
        areDemandsVisible,
        visibleDemands,
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
    // console.log(areDemandsVisible)

    //DEMANDS
    if (!areDemandsVisible) {
        lines = _.filter(lines, (d) => { return (d.type != 'regular-demand' && d.type != 'irrigation-demand') });
        markers = _.filter(markers, (d) => { return (d.type != 'demand' && d.type != 'agri') });
    } else if (visibleDemands.length > 0) {
        lines = _.filter(lines, (d) => {
            // console.log(d)
            if (d.type == 'regular-demand' || d.type == 'irrigation-demand') {
                return visibleDemands.indexOf(d.name) > -1;
            }
            return true;
        });

        markers = _.filter(markers, (d) => {
            // console.log(d)
            if (d.type == 'demand' || d.type == 'agri') {
                return visibleDemands.indexOf(d.name) > -1;
            }

            return true;
        });
    }

    //INFLOWS
    if (!areInflowsVisible) {
        markers = _.filter(markers, (d) => { return (d.type != 'inflow') });

    } else if (visibleInflows.length > 0) {
        markers = _.filter(markers, (d) => {
            // console.log(d)
            if (d.type == 'inflow') {
                return visibleInflows.indexOf(d.name) > -1;
            }

            return true;
        });
    }

    //AMENITIES
    if (!areAmenitiesVisible) {
        lines = _.filter(lines, (d) => { return (d.type != 'diversion') });
        markers = _.filter(lines, (d) => { return (d.type != 'diversion') });
    } else if (visibleAmenities.length > 0) {
        lines = _.filter(lines, (d) => {
            if (d.type == 'diversion') {
                return visibleAmenities.indexOf(d.name) > -1;
            }
            return true;
        });

        markers = _.filter(lines, (d) => {
            if (d.type == 'diversion') {
                return visibleAmenities.indexOf(d.name) > -1;
            }

            return true;
        });
    }

    //IRRIGATIONS
    if (!areIrrigationsVisible) {
        lines = _.filter(lines, (d) => { return (d.type != 'irrigation-demand') });
        markers = _.filter(markers, (d) => { return (d.type != 'agri') });
    } else if (visibleIrrigations.length > 0) {
        lines = _.filter(lines, (d) => {
            if (d.type == 'irrigation-demand') {
                return visibleIrrigations.indexOf(d.name) > -1;
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
        lines = _.filter(lines, (d) => { return (d.type != 'regular-demand') });
        markers = _.filter(markers, (d) => { return (d.type != 'demand') });
    } else if (visibleNonIrrigations.length > 0) {
        lines = _.filter(lines, (d) => {
            if (d.type == 'regular-demand') {
                return visibleNonIrrigations.indexOf(d.name) > -1;
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