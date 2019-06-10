import _ from 'lodash';

var alpha = 200;

export default function(data) {

    var inputData = _.clone(data),
        schematicData = { lines: [], artifacts: [], labels: [], markers: [], title: {} };

    // copy title over as it is without any modifications
    schematicData.title = _.clone(inputData.title);

    // copy labels over if any are present
    schematicData.labels = _.clone(inputData.labels || []);

    // copy sinks and reservoirs into artifacts 
    schematicData.artifacts = _.map(inputData.reservoirs, (node) => {
        return {
            "type": "reservoir",
            "coords": [node.nodes[0].coords[0] * alpha, node.nodes[0].coords[1] * (alpha / 2)],
            "name": node.name,
            "nodeNum": node.nodeNum,
            "size": 1
        };
    })
    let sinks = _.map(inputData.sinks, (node) => {
        return {
            "type": "sink",
            "coords": [node.nodes[0].coords[0] * alpha, node.nodes[0].coords[1] * (alpha / 2)],
            "name": node.name,
            "nodeNum": node.nodeNum,
            "size": 1
        };
    })
    schematicData.artifacts = schematicData.artifacts.concat(sinks);

    // non storage can be a junction or an inflow so they will be markers tagged as inflow and junction for now
    var tempNonStorageList = [];

    _.map(inputData.nonStorage, (node) => {

        var tempStore = {
            "name": node.name,
            "nodeNum": node.nodeNum,
            "coords": [node.nodes[0].coords[0] * alpha, node.nodes[0].coords[1] * (alpha / 2)],
        }

        let nodeName = node.name.toLowerCase();

        if (nodeName.indexOf('artificial') >= 0) {
            //    skip this node
            return;
        } else if (nodeName[0] == 'i') {
            tempStore.type = 'inflow'
        } else if (nodeName[0] == 'j') {
            tempStore.type = 'junction'
        } else {
            tempStore.type = 'junction'
        }
        tempNonStorageList.push(tempStore);
    })

    // demands can be irrigation , major withdrawal and minor demand
    var tempDemandList = [];

    _.map(inputData.demands, (node) => {

        var tempStore = {
            "name": node.name,
            "nodeNum": node.nodeNum,
            "coords": [node.nodes[0].coords[0] * alpha, node.nodes[0].coords[1] * (alpha / 2)],
        }

        let nodeName = node.name.toLowerCase();

        if (nodeName.indexOf('FT_') >= 0) {
            //    skip this node as it is a flow through
            return;
        } else if (nodeName[0] == 'i') {
            tempStore.type = 'agri'
        } else if (nodeName[0] == 'm') {
            tempStore.type = 'demand'
        } else {
            tempStore.type = 'demand'
        }
        tempDemandList.push(tempStore);
    });
    schematicData.markers = [...tempNonStorageList, ...tempDemandList];

    _.map(inputData.links, (link) => {

        // every link can flow to a demand node or to a agri node 
        //  or it could be flowing to a junction or is a diversion
        // first we ignore all links that are flow through

        let linkName = link.linkName.toLowerCase();
        if (linkName.indexOf('FT_') >= 0) {
            return;
        } else {

            // temp fix for south sask river reverse all flows
            if (inputData.title.label == 'South Saskatchewan Model') {
                link.reverse = !link.reverse;
            }

            var tempStore = {
                "name": link.linkName,
                "reverse": link.reverse,
                "linkNum": link.linkNumber,
                "linkTo": link.linkTo,
                "linkFrom": link.linkFrom,
                "nodes": _.map(link.nodes, (d) => {
                    return {
                        'coords': [d.coords[0] * alpha, d.coords[1] * (alpha / 2)]
                    }
                }),
                "type": "river"
            }



            let linkFlowToNode = link.linkTo,
                linkFromToNode = link.linkFrom;

            // temp fix for south sask river reverse all flows
            if (inputData.title.label == 'South Saskatchewan Model') {
                linkFlowToNode = link.linkFrom;
                linkFromToNode = link.linkTo;
            }

            let nodeTo = _.find(schematicData.markers, (d) => d.nodeNum == linkFlowToNode),
                nodeFrom = _.find(schematicData.markers, (d) => d.nodeNum == linkFromToNode);

            if (specialCases.indexOf(link.linkName) >= 0) {
                tempStore.type = 'diversion';
            } else if (nodeTo && (nodeTo.type == 'demand' || nodeTo.type == 'agri')) {
                tempStore.type = nodeTo.type;
            } else if (nodeFrom && (nodeFrom.type == 'inflow')) {
                tempStore.type = nodeFrom.type;
            }

            schematicData.lines.push(tempStore);
        }
    })

    return schematicData;
}

var specialCases = ["J_LBowDiv_J_HW8", "J_WCDiv_J_HW7"]