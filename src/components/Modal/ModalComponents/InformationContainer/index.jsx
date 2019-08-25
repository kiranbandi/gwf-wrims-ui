import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setInfoModalState } from '../../../../redux/actions/actions';

class InformationContainer extends Component {

    constructor(props) {
        super(props)
    }

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

        const { infoModalState, actions } = this.props;

        const tabs = ["River Map", "Flow Graph", "Vertical Slider", "Metrics", "Filter Panel"];
        
        return (
            <div className="information-container-root" style={{width: widthOfPage * .98, height, top}}>
                <div className="ic-title">Help Center</div>
                <div className="ic-tab-container">
                    {
                        tabs.map((tabName, idx) => {

                            return (<div 
                                    className={"ic-tab" + ((infoModalState[1] === idx) ? " selected" : "")}
                                    onClick={() => { actions.setInfoModalState([true, idx]);}}
                                    key={idx}>{tabName}</div>);

                        })
                    }
                </div>
                <div className="ic-content-container"></div>
                
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
