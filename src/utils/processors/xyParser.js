import axios from 'axios';


export default function(xyFileData) {

    /* state system to make parsing easy */

    // possible states for the parser
    var states = {
            INITIAL: "INITIAL",
            READING_NODE: "READING_NODE",
            READING_NODE_POS: "READING_NODE_POS",
            READING_LINK: "READING_LINK",
        },

        // constructor function change states and keep track 
        stateManager = function() {
            let currentState = states.INITIAL;
            this.getCurrentState = () => { return currentState; };
            this.changeState = (state) => { currentState = state; };
        },

        // instance of the constructor function
        stateObj = new stateManager(),

        // temprorary node that gets modified every time a node is read
        tNode = {
            name: "",
            nodeNum: -1,
            type: "",
            coords: []
        },

        // function to reset the temporary node
        resetNode = () => {
            tNode.name = "";
            tNode.nodeNum = -1;
            tNode.type = "";
            tNode.coords = [];

            if (tNode.size !== undefined) {
                delete tNode.size;
            }
        },

        // temprorary link that gets modified every time a link is read
        tLink = {
            name: "",
            linkNum: -1,
            linkFrom: -1,
            linkTo: -1,
            type: "river",
            nodes: [],
            reverse: false
        },

        // function to reset the temporary node
        resetLink = () => {
            tLink.name = "";
            tLink.linkNum = -1
            tLink.linkTo = -1
            tLink.linkFrom = -1;
            tLink.type = "river";
            tLink.nodes = [];
            tLink.reverse = false;
        },

        // an associated array to make the process of finding the
        // corresponding nodes for the links an O(1) process
        nodeDir = {},

        // object to store all the schematic data
        schematicData = { lines: [], artifacts: [], markers: [] },

        // object to store the dimension info of the relative view 
        dim = {
            minX: Number.POSITIVE_INFINITY,
            minY: Number.POSITIVE_INFINITY,
            maxX: Number.NEGATIVE_INFINITY,
            maxY: Number.NEGATIVE_INFINITY,

            margin: {
                left: 50,
                top: 40,
                right: 50,
                bottom: 40
            },

            width: -1,
            height: -1
        },

        // constant for the computations of node coordinates
        alpha = 200;

    // axios.get(xyFilePath).then((response) => {

    var types = ["reservoir", "nonStorage", "demand", "sink"];

    var specialCases = ["J_LBowDiv_J_HW8", "J_WCDiv_J_HW7"];

    var line = "";

    for (const c of xyFileData) {
        if (!["\r", "\n"].includes(c)) {
            line = line.concat(c);
        } else if (line !== "") {
            switch (stateObj.getCurrentState()) {

                case states.INITIAL:
                    {
                        if (line === "node") {
                            stateObj.changeState(states.READING_NODE);
                        } else if (line === "link") {
                            stateObj.changeState(states.READING_LINK);
                        }
                        break;
                    }

                case states.READING_NODE:
                    {
                        let words = line.split(" ");

                        switch (words[0]) {
                            case "name":
                                {
                                    tNode.name = words[1];
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
                                                if (tNode.name.toLowerCase().indexOf('artificial') >= 0) {
                                                    resetNode();
                                                    stateObj.changeState(states.INITIAL);
                                                } else if (tNode.name.toLowerCase()[0] == 'i') {
                                                    tNode.type = 'inflow'
                                                } else {
                                                    tNode.type = 'junction'
                                                }
                                                break;
                                            }

                                        case "demand":
                                            {
                                                if (tNode.name.toLowerCase().indexOf('ft_') >= 0) {
                                                    resetNode();
                                                    stateObj.changeState(states.INITIAL);
                                                } else if (tNode.name.toLowerCase()[0] == 'i') {
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

                                    if (tNode.coords[0] < dim.minX) {
                                        dim.minX = tNode.coords[0];
                                    }

                                    if (tNode.coords[0] > dim.maxX) {
                                        dim.maxX = tNode.coords[0];
                                    }

                                    break;
                                }
                            case "1":
                                {
                                    tNode.coords.push(Number(words[1]));

                                    if (tNode.coords[1] < dim.minY) {
                                        dim.minY = tNode.coords[1];
                                    }

                                    if (tNode.coords[1] > dim.maxY) {
                                        dim.maxY = tNode.coords[1];
                                    }

                                    if ((tNode.type === "reservoir") || (tNode.type === "sink")) {
                                        tNode.size = 1;
                                        nodeDir[tNode.nodeNum] = Object.assign({}, tNode);
                                        schematicData.artifacts.push(nodeDir[tNode.nodeNum]);
                                    } else {
                                        nodeDir[tNode.nodeNum] = Object.assign({}, tNode);
                                        schematicData.markers.push(nodeDir[tNode.nodeNum]);
                                    }

                                    resetNode();
                                    stateObj.changeState(states.INITIAL);

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
                                    tLink.name = words[1];
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

                                    resetLink();
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

    dim.width = (dim.maxX - dim.minX) + (dim.margin.left + dim.margin.right);
    dim.height = (dim.maxY - dim.minY) + (dim.margin.top + dim.margin.bottom);

    Object.keys(nodeDir).forEach((key) => {
        nodeDir[key].coords[0] = (((nodeDir[key].coords[0] - dim.minX) + dim.margin.left) / dim.width) * alpha;
        nodeDir[key].coords[1] = (((nodeDir[key].coords[1] - dim.minY) + dim.margin.top) / dim.height) * (alpha / 2);
    });

    return schematicData;

}