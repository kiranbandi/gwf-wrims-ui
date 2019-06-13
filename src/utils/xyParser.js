import axios from 'axios';


export default function(xyString) {

    var stateObj = {
        states: ["INITIAL_STATE", "READING_NODE"],
        currentState: "INITIAL_STATE",
        changeState: function(newState) { this.currentState = newState; }
    };


    var schematicData = { lines: [], artifacts: [], labels: [], markers: [], title: {} }

    axios.get(xyString).then((response) => {

        var word = "";

        for (const c of response.data) {
            if (!["\r", "\n"].includes(c)) {
                word = word.concat(c);
            } 
            else {
                if (word !== "")
                {
                    console.log(word);
                    word = "";
                }
            }
        }

    });

}