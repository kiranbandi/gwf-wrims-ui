/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const marks = {
    0: <strong>Base</strong>,
    50: <strong>5%</strong>,
    100: <strong>10%</strong>
};

function log(value) {
    console.log(value); //eslint-disable-line
}

class VerticalSlider extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { width, height } = this.props;
        return (
            <div className='vertical-slider-container' style={{ 'width': width, 'height': height }}>
                <div className='inner-slider' style={{ 'width': width, 'height': height * 0.80, 'marginBottom': height * 0.1 }}>
                    <p className='slider-title'>Decrease Supply</p>
                    <Slider vertical min={0} marks={marks} step={null} onChange={log} defaultValue={0} />
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VerticalSlider);
