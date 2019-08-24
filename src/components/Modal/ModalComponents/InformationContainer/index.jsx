import React, { Component } from 'react'

class InformationContainer extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            currentTab: undefined
        }
    }

    componentDidMount() {

        const { args } = this.props;

        if (args.length !== 0) {
            this.setSelected(args[0]);
        };
    }
    
    
    setSelected = (tabNum) => { this.setState({currentTab: tabNum}); };

    render() {

        let widthOfPage = document.body.getBoundingClientRect().width,
            onMobile = false, 
            height = (.50 * widthOfPage), 
            top = "5%";

        if (widthOfPage <= 1450) {
            top = "2%";
        }


        if (widthOfPage > 1170) {
            widthOfPage = 1250;
            height = (.60 * widthOfPage);
        }
        else if (widthOfPage < 700) {
            onMobile = true;
            widthOfPage = 0.90 * widthOfPage;
            top = "2%";
        }

        const { args } = this.props;
        
        let { currentTab } = this.state;

        currentTab = ((args.length === 0) && (currentTab === undefined)) ? 0 : 
                     ((args.length !== 0) && (currentTab === undefined)) ? args[0] : currentTab;   
         

        return (
            <div className="information-container-root" style={{width: widthOfPage * .98, height, top}}>
                <div className="ic-title">Help Center</div>
                <div className="ic-tab-container">
                    <div 
                     className={"ic-tab" + ((currentTab === 0) ? " selected" : "")}
                     onClick={() => { this.setSelected(0);}}>
                     Vertical Slider
                    </div>
                    <div 
                     className={"ic-tab" + ((currentTab === 1) ? " selected" : "")}
                     onClick={() => { this.setSelected(1);}}>
                     River Map
                    </div>
                    <div 
                     className={"ic-tab" + ((currentTab === 2) ? " selected" : "")}
                     onClick={() => { this.setSelected(2);}}>
                     Flow Graph
                    </div>
                    <div 
                     className={"ic-tab" + ((currentTab === 3) ? " selected" : "")}
                     onClick={() => { this.setSelected(3);}}>
                     Metrics
                    </div>
                    <div 
                     className={"ic-tab" + ((currentTab === 4) ? " selected" : "")}
                     onClick={() => { this.setSelected(4);}}>
                     Filter Panel
                    </div>
                </div>
                <div className="ic-content-container"></div>
                
            </div>
        )
    }
}

export default InformationContainer;
