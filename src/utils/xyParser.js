import axios from 'axios';


export default function(xyString) {

    var states = {
        INITIAL:"INITIAL", 
        READING_NODE:"READING_NODE", 
        READING_NODE_POS:"READING_NODE_POS", 
        READING_LINK:"READING_LINK", 
    }

    var stateObj = {
        currentState: states.INITIAL,
        changeState: function(state) { this.currentState = state; }
    };

    


    var schematicData = { lines: [], artifacts: [], labels: [], markers: [], title: {} }

    axios.get(xyString).then((response) => {

        var word = "";

        let nodeObj = {
            name:"J_39_J_19",
          color:"#5c6b84",
          type:"river",
          reverse:false,
          shiftCoords:[  
             0,
             0
          ],
          nodes:[  
             {  
                coords:[  
                   0.558155,
                   0.06506
                ]
             },
             {  
                coords:[  
                   0.477273,
                   0.063855
                ]
             }
          ]
        }
        
        let linkObj = {

        }

        for (const c of response.data) {
            if (!["\r", "\n"].includes(c)) {
                word = word.concat(c);
            } else {
                if (word !== "") 
                {
                    switch(stateObj.currentState) {
                        
                        case states.INITIAL: {
                            if (word === "node") {
                                stateObj.changeState(states.READING_NODE);
                                break;
                            }
                            if (word === "link") {
                                stateObj.changeState(states.READING_LINK);
                                break;
                            }
                            break;
                        }

                        case states.READING_NODE: {
                            
                            let splitWord = word.split(" ");
                            
                            switch(splitWord[0]) {

                                case "name": {

                                }
                                case "num": {
                                    
                                }
                                case "ntype": {
                                    
                                }
                                case "pos": {
                                    
                                }
                            }
                        }

                        case states.READING_NODE_POS: {
                            
                            let splitWord = word.split(" ");
                            
                            switch(splitWord[0]) {

                                case "0": {

                                }
                                case "1": {
                                    
                                }
                            }
                        }

                        case states.READING_LINK: {
                            
                            let splitWord = word.split(" ");
                            
                            switch(splitWord[0]) {

                                case "lname": {

                                }
                                case "lnum": {
                                    
                                }
                                case "fromnum": {
                                    
                                }
                                case "tonum": {
                                    
                                }
                            }
                        }
                      }

                      word = "";
                }
            }
        }

    });

}