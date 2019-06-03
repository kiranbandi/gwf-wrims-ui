export default function(filterMesh, schematicData) {
    const { areDemandsVisible, visibleDemands, areInflowsVisible, visibleInflows } = filterMesh;
    let { lines = [], artifacts = [], labels = [], markers = [] } = schematicData;
    // console.log(areDemandsVisible)
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

    return { lines, markers, labels, artifacts };
}