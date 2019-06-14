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


    var schematicData = { lines: [], artifacts: [], labels: [], markers: [], title: {} }

    axios.get(xyString).then((response) => {

        

        var newNode = {
            name: "",
            nodeNum: -1,
            type: "",
            coords: []
        }

        var linkNode = {
            name: "",
            linkNum: -1,
            linkTo: -1,
            linkFrom: -1,
            type: "river",
            nodes: [],
            reverse: false
        }

        var types = ["reservoir", "nonStorage", "demand", "sink"];

        var specialCases = ["J_LBowDiv_J_HW8", "J_WCDiv_J_HW7"]

        var word = "";

        for (const c of response.data) {
            if (!["\r", "\n"].includes(c)) {
                word = word.concat(c);
            } else {
                if (word !== "") {
                    console.log(word);
                    switch (stateObj.currentState) {

                        case states.INITIAL:
                            {
                                if (word === "node") {
                                    stateObj.changeState(states.READING_NODE);
                                    break;
                                }
                                else if (word === "link") {
                                    stateObj.changeState(states.READING_LINK);
                                    break;
                                }

                                break;
                            }

                        case states.READING_NODE:
                            {
                                let splitWord = word.split(" ");

                                switch (splitWord[0]) {
                                    case "name":
                                        {
                                            newNode.name = splitWord[1].toLowerCase();
                                            break;
                                        }
                                    case "num":
                                        {
                                            newNode.num = Number(splitWord[1]);
                                            break;
                                        }
                                    case "ntype":
                                        {
                                            let typeStr = types[Number(splitWord[1])];

                                            switch (typeStr) {

                                                case "reservoir":
                                                case "sink":
                                                    newNode.type = typeStr;
                                                    break;

                                                case "nonStorage":
                                                    {
                                                        if (newNode.name.indexOf('artificial') >= 0) {
                                                            resetNode(newNode);
                                                            stateObj.changeState(states.INITIAL);
                                                        } else if (newNode.name[0] == 'i') {
                                                            newNode.type = 'inflow'
                                                        } else {
                                                            newNode.type = 'junction'
                                                        }
                                                        break;
                                                    }

                                                case "demand":
                                                    {
                                                        if (newNode.name.indexOf('ft_') >= 0) {
                                                            resetNode(newNode);
                                                            stateObj.changeState(states.INITIAL);
                                                        } else if (newNode.name[0] == 'i') {
                                                            newNode.type = 'agri'
                                                        } else {
                                                            newNode.type = 'demand'
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
                                let splitWord = word.split(" ");

                                switch (splitWord[0]) {

                                    case "0":
                                        {
                                            newNode.coords.push(Number(splitWord[1]));
                                            break;
                                        }
                                    case "1":
                                        {
                                            newNode.coords.push(Number(splitWord[1]));

                                            if ((newNode.type === "reservoir") || (newNode.type === "sink")) {

                                                newNode.size = 1;
                                                schematicData.artifacts.push(Object.assign({}, newNode));
                                                resetNode(newNode);
                                                stateObj.changeState(states.INITIAL);
                                            } else {
                                                schematicData.markers.push(Object.assign({}, newNode));
                                                resetNode(newNode);
                                                stateObj.changeState(states.INITIAL);
                                            }
                                            break;
                                        }
                                }
                                break;
                            }

                            // case states.READING_LINK:
                            //     {

                            //         let splitWord = word.split(" ");

                            //         switch (splitWord[0]) {

                            //             case "lname":
                            //                 {

                            //                 }
                            //             case "lnum":
                            //                 {

                            //                 }
                            //             case "fromnum":
                            //                 {

                            //                 }
                            //             case "tonum":
                            //                 {

                            //                 }
                            //         }
                            //     }
                    }

                    word = "";
                }
            }
        }

        console.log(schematicData.artifacts);
        console.log(schematicData.markers);
        

    });

}

function resetNode(node) {
    node = {
        name: "",
        nodeNum: -1,
        type: "",
        coords: []
    }
}

function resetLink() {
    linkNode = {
        name: "",
        linkNum: -1,
        linkTo: -1,
        linkFrom: -1,
        type: "river",
        nodes: [],
        reverse: false
    }
}