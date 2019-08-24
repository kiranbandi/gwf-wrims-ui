/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import Switch from "react-switch";

import { getFlowData } from '../../utils/requestServer';
import { setFlowData } from '../../redux/actions/actions';
import toastr from '../../utils/toastr';

import Modal from '../Modal' 

const decreaseSupplyMarks = {
    0: <strong>-10%</strong>,
    50: <strong>-5%</strong>,
    100: <strong>Base</strong>
};

const increaseDemandMarks = {
    0: <strong>Base</strong>,
    50: <strong>+5%</strong>,
    100: <strong>+10%</strong>
};


class VerticalSlider extends Component {

    constructor(props) {
        super(props);
        this.onSliderChange = this.onSliderChange.bind(this);
        this.state = {
            currentMode: 0,
            sliderValue: 100,
            showModal: false
        }
    }

    learnMore = () => {
        this.setState({showModal: true});
        window.scrollTo(0, 0); 

    }

    hideModal = () => {
        // this.setState({showModal: false});
    }

    onSwitchChange = () => {
        let newMode = Math.abs(this.state.currentMode - 1);
        let newSliderVal = newMode === 0? 100 : 0; 
        this.setState({ currentMode: newMode, sliderValue: newSliderVal });
    }

    onSliderChange(value) {
        this.setState({ sliderValue: value });
        let { actions, flowData = {} } = this.props, { flowParams = null, name, isLoading = false } = flowData;

        if (!isLoading) {
            if (!!flowParams) {
                flowParams.threshold = value == 0 ? 'ten' : value == 50 ? 'five' : 'base';
                actions.setFlowData({ dataList: [], name, flowParams, isLoading: true });
                getFlowData(flowParams)
                    .then((records) => {
                        let dataList = _.map(records, (d) => (
                            {
                                'flow': (Math.round(Number(d.flow) * 1000) / 1000),
                                'timestamp': d.timestamp
                            }));
                        actions.setFlowData({ dataList, name, flowParams, isLoading: false });
                    })
                    .catch((error) => {
                        console.log('error fetching and parsing flow data');
                        actions.setFlowData({ dataList: [], name, flowParams, isLoading: false });
                    })
            }
            else {
                toastr["warning"]("Please select a node first on the schematic", "Error");
            }
        }
    }



    render() {

        let { width, height, flowData = {} } = this.props,
            { flowParams = { threshold: 'base' } } = flowData, { threshold = 'base' } = flowParams;
        
        var { currentMode, sliderValue, showModal } = this.state

        let checked, currentFactor, factorMarks, initialValue;        
        if (currentMode === 0) {
            checked = false;
            currentFactor = "Decrease Supply";
            factorMarks = decreaseSupplyMarks;
            initialValue = 100;
        }
        else if (currentMode === 1) {
            checked = true;
            currentFactor = "Increase Demand";
            factorMarks = increaseDemandMarks;
            initialValue = 0;
        }
        
        var sliderHeight = ((height - 90)  * .875);
        sliderHeight = sliderHeight < 320? ((sliderHeight)  * .95) : sliderHeight;

        var marginBottom = sliderHeight < 320? (sliderHeight * 0.065) : (sliderHeight * 0.045);



        return (
            <div className='vertical-slider-container' style={{ 'width': width, 'height': height }}>
                <Modal show={showModal} componentID={`infoContainer`} args={[3]} onClick={this.hideModal}/>
                <p className='slider-title'>{currentFactor}</p>
                <div className='switch-container'>
                    <label htmlFor="vertical-slider-switch">
                        <Switch
                            checked={checked}
                            onChange={this.onSwitchChange}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={25}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.27"
                            height={15}
                            width={48}
                            className="react-switch"
                            id="vertical-slider-switch"
                        />
                    </label>
                </div>
                <div className='inner-slider' style={{ 'width': width, 'height': sliderHeight, marginBottom}}>
                    <Slider vertical value={sliderValue} min={0} marks={factorMarks} step={null} included={false} onChange={this.onSliderChange} defaultValue={initialValue}/>
                </div>
                <div className="info-icon" title="Learn More" onClick={this.learnMore}>
                    <span className="icon icon-info-with-circle sample-icon"></span>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        flowData: state.delta.flowData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setFlowData }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VerticalSlider);
