import _ from 'lodash';


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
            nodeNum: -1,
            name: "",
            type: "",
            shiftCoords: [0, 0],
            nodes: [{coords: []}],
        },

        // function to reset the temporary node
        resetNode = () => {
            tNode.nodeNum = -1;
            tNode.name = "";
            tNode.type = "";
            tNode.shiftCoords = [0, 0];
            tNode.nodes = [{coords: []}];
        },

        // temprorary link that gets modified every time a link is read
        tLink = {
            linkName: "",
            linkNumber: -1,
            linkTo: -1,
            linkFrom: -1,
            shiftCoords: [0, 0],
            reverse: false,
            nodes: [],
        },

        // function to reset the temporary node
        resetLink = () => {
            tLink.linkName = "";
            tLink.linkNumber = -1
            tLink.linkTo = -1
            tLink.linkFrom = -1;
            tLink.shiftCoords = [0, 0];
            tLink.reverse = false;
            tLink.nodes = [];
        },

        // an associated array to make the process of finding the
        // corresponding nodes for the links an O(1) process
        nodeDir = {},

        // object to store all the schematic data
        schematicTitleProperty = { label: "", coords: [0, 0] },
        schematicLabelsProperty = [{ name: "", coords: [0, 0] }],
        schematicData = {
            title: schematicTitleProperty,
            labels: schematicLabelsProperty,
            demands: [],
            nonStorage: [],
            sinks: [],
            reservoirs: [],
            links: [],
        },

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
        };


    var types = ["reservoir", "nonStorage", "demand", "sink"];

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
                                    tNode.type = typeStr.charAt(0).toUpperCase() + typeStr.slice(1);
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
                                    tNode.nodes[0].coords.push(Number(words[1]));

                                    if (tNode.nodes[0].coords[0] < dim.minX) {
                                        dim.minX = tNode.nodes[0].coords[0];
                                    }

                                    if (tNode.nodes[0].coords[0] > dim.maxX) {
                                        dim.maxX = tNode.nodes[0].coords[0];
                                    }

                                    break;
                                }
                            case "1":
                                {
                                    tNode.nodes[0].coords.push(Number(words[1]));

                                    if (tNode.nodes[0].coords[1] < dim.minY) {
                                        dim.minY = tNode.nodes[0].coords[1];
                                    }

                                    if (tNode.nodes[0].coords[1] > dim.maxY) {
                                        dim.maxY = tNode.nodes[0].coords[1];
                                    }
                                    
                                    nodeDir[tNode.nodeNum] = _.cloneDeep(tNode);
                                    let targetNode = tNode.type.charAt(0).toLowerCase() + tNode.type.slice(1);
                                    targetNode = (targetNode ==="nonStorage")? targetNode : (targetNode + "s"); 
                                    schematicData[targetNode].push(nodeDir[tNode.nodeNum]);

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
                                    tLink.linkName = words[1];
                                    break;
                                }
                            case "lnum":
                                {
                                    tLink.linkNumber = Number(words[1]);
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
                                        tLink.nodes.push(nodeDir[tLink.linkFrom].nodes[0]);
                                        tLink.nodes.push(nodeDir[tLink.linkTo].nodes[0]);

                                        schematicData.links.push(_.clone(tLink));
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
        nodeDir[key].nodes[0].coords[0] = (((nodeDir[key].nodes[0].coords[0] - dim.minX) + dim.margin.left) / dim.width);
        nodeDir[key].nodes[0].coords[1] = (((nodeDir[key].nodes[0].coords[1] - dim.minY) + dim.margin.top) / dim.height);
    });

    return schematicData;

}