import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setMode } from '../../../../redux/actions/actions';
import ModeCard from './ModeCard'

class UserSelection extends Component {



    render() {
        let widthOfPage = document.body.getBoundingClientRect().width,
            onMobile = false;

        if (widthOfPage > 1170) {
            widthOfPage = 1000
        }
        else if (widthOfPage < 700) {
            onMobile = true;
            widthOfPage = 0.90 * widthOfPage;
        }

        const { actions } = this.props;
        const { setMode } = actions;

        return (
            <div className="us-root" style={{width: widthOfPage, height: .60 * widthOfPage}}>
                <div className="us-text">
                    {"What would you like to do today?"}
                </div>
                <div className="us-users-root">
                    
                    <ModeCard
                        title={`Explore water management scenarios for the basin`}
                        text={`In this mode, users will be able to access models built to explore user questions for particular locations or policy issues.`}
                        innerElements={[
                            <div className="one-examples-title">{`Some Examples: `}</div>,
                            <ul className="one-examples-content">
                                <li>{`Water management futures for the Saskatchewan River Basin`}</li>
                                <li>{`Reservoir management scenarios for hydro-power generation in the Upper Nelson basin`}</li>
                                <li>{`Farmers and water use behavior in the Bow River Basin`}</li>
                                <li>{`Wetland drainage in the prairie region`}</li>
                            </ul>
                        ]}
                        onClick={() => setMode(0)}/>
                    <ModeCard
                        title={`Dive deeper into the model`}
                        text={`In this mode, users can see more mechanics of how the model calculates water information and browse through more details about the water users in the basin. `}
                        onClick={() => setMode(1)}/>
                        
                    <ModeCard
                        title={`Learn more about the basin and the tool`}
                        text={`In this mode, users can learn more about the decision support tool and what it can do, and learn more about the Nelson drainage system and water management concepts.`}
                        onClick={() => setMode(2)}/>
                    </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        mode: state.delta.mode
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setMode }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSelection);