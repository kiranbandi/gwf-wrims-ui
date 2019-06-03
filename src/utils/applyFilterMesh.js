export default function(filterMesh, schematicData) {

    const { areDemandsVisible, visibleDemands, areLabelsVisible } = filterMesh;
    let { lines = [], artifacts = [], labels = [], markers = [] } = schematicData;

    if (!areDemandsVisible) {
        lines = _.filter(lines, (d) => { return (d.type != 'regular-demand' && d.type != 'irrigation-demand') });
        markers = _.filter(markers, (d) => { return (d.type != 'demand' && d.type != 'agri') });
    } else if (visibleDemands.length > 0) {

        lines = _.filter(lines, (d) => {
            if (d.type == 'regular-demand' || d.type == 'irrigation-demand') {
                return visibleDemands.indexOf(d.name) > -1;
            }
            return true;
        });

        markers = _.filter(markers, (d) => {
            if (d.type == 'demand' || d.type == 'agri') {
                return visibleDemands.indexOf(d.name) > -1;
            }
            return true;
        });

    }

    return { lines, markers, labels, artifacts };
}