import axios from 'axios';


export default function(xyString) {

    var states = {
        INITIAL: "INITIAL",
        READING_NODE: "READING_NODE",
        READING_NODE_POS: "READING_NODE_POS",
        READING_LINK: "READING_LINK",
    }

    var stateObj = {
        currentState: states.INITIAL,
        changeState: function(state) { this.currentState = state; }
    };

    var nodeDir = {};

    var schematicData = { lines: [], artifacts: [], labels: [], markers: [], title: {} }

    var dim = {
        minx: Number.POSITIVE_INFINITY,
        miny: Number.POSITIVE_INFINITY,
        maxx: Number.NEGATIVE_INFINITY,
        maxy: Number.NEGATIVE_INFINITY,

        margin: {
            left: 50,
            top: 10,
            right: 50,
            bottom: 10
        },

        width: -1,
        height: -1
    }

    axios.get(xyString).then((response) => {

        var tNode = {
            name: "",
            nodeNum: -1,
            type: "",
            coords: []
        }

        var tLink = {
            name: "",
            linkNum: -1,
            linkFrom: -1,
            linkTo: -1,
            type: "river",
            nodes: [],
            reverse: false
        }

        var types = ["reservoir", "nonStorage", "demand", "sink"];

        var specialCases = ["J_LBowDiv_J_HW8", "J_WCDiv_J_HW7"]

        var alpha = 200;

        var line = "";

        for (const c of response.data) {
            if (!["\r", "\n"].includes(c)) {
                line = line.concat(c);
            } else {
                if (line !== "") {
                    switch (stateObj.currentState) {

                        case states.INITIAL:
                            {
                                if (line === "node") {
                                    stateObj.changeState(states.READING_NODE);
                                    break;
                                } else if (line === "link") {
                                    stateObj.changeState(states.READING_LINK);
                                    break;
                                }

                                break;
                            }

                        case states.READING_NODE:
                            {
                                let words = line.split(" ");

                                switch (words[0]) {
                                    case "name":
                                        {
                                            tNode.name = words[1].toLowerCase();
                                            break;
                                        }
                                    case "num":
                                        {
                                            tNode.nodeNum = Number(words[1]);
                                            break;
                                        }
                                    case "ntype":
                                        {
                                            let typeStr = types[Number(words[1]) - 1];

                                            switch (typeStr) {

                                                case "reservoir":
                                                case "sink":
                                                    tNode.type = typeStr;
                                                    break;

                                                case "nonStorage":
                                                    {
                                                        if (tNode.name.indexOf('artificial') >= 0) {
                                                            resetNode(tNode);
                                                            stateObj.changeState(states.INITIAL);
                                                        } else if (tNode.name[0] == 'i') {
                                                            tNode.type = 'inflow'
                                                        } else {
                                                            tNode.type = 'junction'
                                                        }
                                                        break;
                                                    }

                                                case "demand":
                                                    {
                                                        if (tNode.name.indexOf('ft_') >= 0) {
                                                            resetNode(tNode);
                                                            stateObj.changeState(states.INITIAL);
                                                        } else if (tNode.name[0] == 'i') {
                                                            tNode.type = 'agri'
                                                        } else {
                                                            tNode.type = 'demand'
                                                        }
                                                        break;
                                                    }
                                            }
                                            break;
                                        }
                                    case "pos":
                                        {
                                            stateObj.changeState(states.READING_NODE_POS);
                                            break;
                                        }
                                }
                                break;
                            }

                        case states.READING_NODE_POS:
                            {
                                let words = line.split(" ");

                                switch (words[0]) {

                                    case "0":
                                        {
                                            tNode.coords.push(Number(words[1]));

                                            if (tNode.coords[0] < dim.minx) {
                                                dim.minx = tNode.coords[0];
                                            }

                                            if (tNode.coords[0] > dim.maxx) {
                                                dim.maxx = tNode.coords[0];
                                            }

                                            break;
                                        }
                                    case "1":
                                        {
                                            tNode.coords.push(Number(words[1]));

                                            if (tNode.coords[1] < dim.miny) {
                                                dim.miny = tNode.coords[1];
                                            }

                                            if (tNode.coords[1] > dim.maxy) {
                                                dim.maxy = tNode.coords[1];
                                            }

                                            if ((tNode.type === "reservoir") || (tNode.type === "sink")) {
                                                tNode.size = 1;
                                                nodeDir[tNode.nodeNum] = Object.assign({}, tNode);
                                                schematicData.artifacts.push(nodeDir[tNode.nodeNum]);
                                                resetNode(tNode);
                                                stateObj.changeState(states.INITIAL);
                                            } else {
                                                nodeDir[tNode.nodeNum] = Object.assign({}, tNode);
                                                schematicData.markers.push(nodeDir[tNode.nodeNum]);
                                                resetNode(tNode);
                                                stateObj.changeState(states.INITIAL);
                                            }

                                            break;
                                        }
                                }
                                break;
                            }

                        case states.READING_LINK:
                            {
                                let words = line.split(" ");

                                switch (words[0]) {
                                    case "lname":
                                        {
                                            tLink.name = words[1].toLowerCase();
                                            break;
                                        }
                                    case "lnum":
                                        {
                                            tLink.linkNum = Number(words[1]);
                                            break;
                                        }
                                    case "fromnum":
                                        {
                                            tLink.linkFrom = Number(words[1]);
                                            break;
                                        }
                                    case "tonum":
                                        {
                                            tLink.linkTo = Number(words[1]);

                                            if (nodeDir[tLink.linkFrom] && nodeDir[tLink.linkTo]) {
                                                tLink.nodes.push({ coords: nodeDir[tLink.linkFrom].coords });
                                                tLink.nodes.push({ coords: nodeDir[tLink.linkTo].coords });

                                                if (specialCases.includes(tLink.linkName)) {
                                                    tLink.type = 'diversion';
                                                } else if (nodeDir[tLink.linkTo].type === 'demand' || nodeDir[tLink.linkTo].type === 'agri') {
                                                    tLink.type = nodeDir[tLink.linkTo].type;
                                                } else if (nodeDir[tLink.linkFrom].type === 'inflow') {
                                                    tLink.type = nodeDir[tLink.linkFrom].type;
                                                }

                                                schematicData.lines.push(Object.assign({}, tLink));
                                            }

                                            resetLink(tLink);
                                            stateObj.changeState(states.INITIAL);
                                            break;
                                        }
                                }
                                break;
                            }
                    }

                    line = "";
                }
            }
        }

        dim.width = (dim.maxx - dim.minx) + (dim.margin.left + dim.margin.right);
        dim.height = (dim.maxy - dim.miny) + (dim.margin.top + dim.margin.bottom);

        for (const key of Object.keys(nodeDir)) {
            nodeDir[key].coords[0] = (((nodeDir[key].coords[0] - dim.minx) + dim.margin.left) / dim.width) * alpha;
            nodeDir[key].coords[1] = (((nodeDir[key].coords[1] - dim.miny) + dim.margin.top) / dim.height) * (alpha / 2);
        }

        console.log(dim);

        console.log(schematicData);

    });
}

function resetNode(node) {
    node.name = "";
    node.nodeNum = -1;
    node.type = "";
    node.coords = [];

    if (node.size !== undefined) {
        delete node.size;
    }
}

function resetLink(link) {
    link.name = "";
    link.linkNum = -1
    link.linkTo = -1
    link.linkFrom = -1;
    link.type = "river";
    link.nodes = [];
    link.reverse = false;
}