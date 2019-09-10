import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setInfoModalState } from '../../../../redux/actions/actions';

class InformationContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabs: { 
                0: { 
                    tabName: "Basin Schematic", 
                    cur: 0, 
                    thumbs: []
                },
                1: { 
                    tabName: "Scenario Editor",
                    cur: 0, 
                    thumbs: [] 
                }, 
                // 2: { 
                //     tabName: "Flow Graph", 
                //     cur: 0, 
                //     thumbs: [] 
                // }, 
                // 3: { 
                //     tabName: "Metrics", 
                //     cur: 0, 
                //     thumbs: [] 
                // }, 
                // 4: { 
                //     tabName: "Filter Panel", 
                //     cur: 0, 
                //     thumbs: [] 
                // }
            }
        }
    }

    _onNavButtonClick = (action) => {
        const { infoModalState } = this.props;
        let { tabs } = this.state;
        
        let newTab = tabs[infoModalState[1]].cur + action;
        
        let imgCount = tabs[infoModalState[1]].thumbs.length - 1;

        if (newTab < 0) { 
            newTab = imgCount; 
        }; 
        
        if (newTab > imgCount) {
            newTab = 0;
        }; 

        tabs[infoModalState[1]] = {...tabs[infoModalState[1]], cur: newTab }

        this.setState({tabs: tabs});
    }

    render() {

        let widthOfPage = document.body.getBoundingClientRect().width,
            onMobile = false, 
            height = (.50 * widthOfPage), 
            top = "3%";

        if (widthOfPage <= 1450) {
            top = "-2%";
        }


        if (widthOfPage > 1170) {
            widthOfPage = 1250;
            height = (.60 * widthOfPage);
        }
        else if (widthOfPage < 700) {
            onMobile = true;
            widthOfPage = 0.90 * widthOfPage;
            top = "-2%";
        }

        const { infoModalState, actions } = this.props;

        const { tabs } = this.state;

        let imageMarginVertical = ((height * .86) - ((height * .86) * .955)) / 2;
        let translateAmount = (((widthOfPage * .98) * .99) * .88);
        let navButtonStyle = { visibility: (tabs[infoModalState[1]].thumbs.length > 1)? `visible` : `hidden`}; 
        
        return (
            <div className="information-container-root" style={{width: widthOfPage * .98, height, top}}>
                <div className="ic-title">Help Center</div>
                <div className="ic-tab-container">
                    {
                        Object.keys(tabs).map((idx) => {
                            return (<div 
                                    className={"ic-tab" + ((infoModalState[1] == idx) ? " selected" : "")}
                                    onClick={() => { actions.setInfoModalState([true, idx]);}}
                                    key={idx}>{tabs[idx].tabName}</div>);

                        }) 
                    }
                </div>
                <div className="ic-content-container">
                    <div className="nav-button" style={navButtonStyle} onClick={() => { this._onNavButtonClick(-1); }}>
                        <span className="icon icon-chevron-thin-left"></span>
                    </div>
                    {
                        tabs[infoModalState[1]].thumbs.map((path, idx) => {
                            let backgroundImgStyle= { background: `url(${path})`, backgroundSize: '100%', margin:`${imageMarginVertical}px ${0}px` };    
                            return (<div 
                                     style={backgroundImgStyle} 
                                     className={"image-container" + ((tabs[infoModalState[1]].cur === idx) ? " active" : "")}>
                                    </div>);
                        })
                    }
                    <div className="nav-button" style={{...navButtonStyle, transform: `translateX(${translateAmount}px)`}} onClick={() => { this._onNavButtonClick(1); }}>
                        <span style={navButtonStyle} className="icon icon-chevron-thin-right"></span>
                    </div>
                </div>
                
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        infoModalState: state.delta.infoModalState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setInfoModalState }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InformationContainer);
