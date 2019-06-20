/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { getFlowData } from '../utils/requestServer';
import { setFlowData } from '../redux/actions/actions';
import toastr from '../utils/toastr';

const marks = {
    0: <strong>Base</strong>,
    50: <strong>5%</strong>,
    100: <strong>10%</strong>
};

class VerticalSlider extends Component {

    constructor(props) {
        super(props);
        this.onSliderChange = this.onSliderChange.bind(this);
    }

    onSliderChange(value) {
        let { actions, flowData = {} } = this.props, { flowParams = null, name, isLoading = false } = flowData;

        if (!isLoading) {
            if (!!flowParams) {
                flowParams.threshold = value == 100 ? 'ten' : value == 50 ? 'five' : 'base';
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

        let sliderValue = threshold == 'ten' ? 100 : threshold == 'five' ? 50 : 0;


        return (
            <div className='vertical-slider-container' style={{ 'width': width, 'height': height }}>
                <div className='inner-slider' style={{ 'width': width, 'height': height * 0.80, 'marginBottom': height * 0.1 }}>
                    <p className='slider-title'>Decrease Supply</p>
                    <Slider vertical value={sliderValue} min={0} marks={marks} step={null} onChange={this.onSliderChange} defaultValue={0} />
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
