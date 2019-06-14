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

        var minx, miny, maxx, maxy;
        minx = miny = Number.POSITIVE_INFINITY;
        maxx = maxy = Number.NEGATIVE_INFINITY;

        var types = ["reservoir", "nonStorage", "demand", "sink"];

        var specialCases = ["J_LBowDiv_J_HW8", "J_WCDiv_J_HW7"]

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
                                }
                                else if (line === "link") {
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
                                            
                                            if (tNode.coords[0] < minx) {
                                                minx = tNode.coords[0];
                                            }

                                            if (tNode.coords[0] > maxx) {
                                                maxx = tNode.coords[0];
                                            }

                                            break;
                                        }
                                    case "1":
                                        {
                                            tNode.coords.push(Number(words[1]));

                                            if (tNode.coords[1] < miny) {
                                                miny = tNode.coords[1];
                                            }

                                            if (tNode.coords[1] > maxy) {
                                                maxy = tNode.coords[1];
                                            }

                                            if ((tNode.type === "reservoir") || (tNode.type === "sink")) {
                                                tNode.size = 1;
                                                nodeDir[tNode.nodeNum] = {coords: tNode.coords, type: tNode.type}; 
                                                schematicData.artifacts.push(Object.assign({}, tNode));
                                                resetNode(tNode);
                                                stateObj.changeState(states.INITIAL);
                                            } else {
                                                nodeDir[tNode.nodeNum] = {coords: tNode.coords, type: tNode.type}; 
                                                schematicData.markers.push(Object.assign({}, tNode));
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
                                                
                                                tLink.nodes.push({coords: nodeDir[tLink.linkFrom].coords});
                                                tLink.nodes.push({coords: nodeDir[tLink.linkTo].coords});

                                                if (specialCases.includes(tLink.linkName)) {
                                                    tLink.type = 'diversion';
                                                } else if (nodeDir[tLink.linkTo].type === 'demand' || nodeDir[tLink.linkTo].type === 'agri') {
                                                    tLink.type = nodeDir[tLink.linkTo].type;
                                                } else if (nodeDir[tLink.linkFrom].type === 'inflow') {
                                                    tLink.type = nodeDir[tLink.linkFrom].type;
                                                }

                                                schematicData.lines.push(Object.assign({}, tLink));
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
        console.log(schematicData.artifacts);
        console.log(schematicData.markers);


        console.log("\n\n" + `(${minx}, ${miny})    (${maxx}, ${maxy})`);
        

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
        link.name= "";
        link.linkNum= -1
        link.linkTo= -1
        link.linkFrom = -1;
        link.type = "river";
        link.nodes = [];
        link.reverse = false;
}