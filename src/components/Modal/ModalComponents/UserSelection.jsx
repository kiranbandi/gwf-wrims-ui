import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setUserState } from '../../../redux/actions/actions';

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

        return (
            <div className="us-root" style={{width: widthOfPage, height: .40 * widthOfPage}}>
                <div className="us-text">
                    {"Who's using this tool today?"}
                </div>
                <div className="us-users-root">
                    <div className="us-user" onClick={() => { this.props.actions.setUserState("WATER_SCIENTIST"); }}>
                        <div className="us-user-type"><b>{"Water-Scientist"}</b></div>
                        <div className="us-user-type-description">{"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius deserunt eveniet incidunt explicabo nisi eaque nihil alias, voluptate aperiam assumenda sit debitis laudantium dolore doloribus sunt ea ullam unde quasi!"}</div>
                    </div>
                    <div className="us-user" onClick={() => { this.props.actions.setUserState("STAKEHOLDER"); }}>
                        <div className="us-user-type"><b>{"Stakeholder"}</b></div>
                        <div className="us-user-type-description">{"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius deserunt eveniet incidunt explicabo nisi eaque nihil alias, voluptate aperiam assumenda sit debitis laudantium dolore doloribus sunt ea ullam unde quasi!"}</div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        userState: state.delta.userState
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setUserState }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSelection);