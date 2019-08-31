/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import _ from 'lodash';
import { getFlowData } from '../../utils/requestServer';
import { setFlowData } from '../../redux/actions/actions';
import Switch from "react-switch";

const UPPERBOUND = 1990, LOWERBOUND = 2015;
var markRange = {};

const Range = Slider.Range;

class YearRangeSlider extends Component {

    constructor(props) {
        super(props);
        this.onSliderChangeMulti = this.onSliderChangeMulti.bind(this);
        this.onSliderChangeSingle = this.onSliderChangeSingle.bind(this);
        this.handleChange = this.handleChange.bind(this);

        for (var i = 1920; i <= 2020; i = i + 10) {
            markRange[i] = i;
        }

        this.state = {
            lowerBound: LOWERBOUND,
            upperBound: UPPERBOUND,
            value: [1990, 2015],
            checked: true
        };
    }

    /**
     * Sets the upperbound to the lowerbound value
     */
    handleChange(checked) {
        this.setState({ checked, upperBound: this.state.lowerBound });
    }

    /**
     * Changes the lower bound value
     */
    onLowerBoundChange = (e) => {
        if (!(e.target.value > markRange[2020]) && !(e.target.value < markRange[1920]) && (e.target.value < this.state.upperBound)) {
            this.setState({ lowerBound: e.target.value > this.state.lowerBound ? +e.target.value + 4 : +e.target.value - 4 });
        }
    }

    /**
     * Changes the upper bound value
     */
    onUpperBoundChange = (e) => {
        if (!(e.target.value > markRange[2020]) && !(e.target.value < markRange[1920]) && (e.target.value > this.state.lowerBound)) {
            this.setState({ upperBound: e.target.value > this.state.upperBound ? +e.target.value + 4 : +e.target.value - 4 });
        }
    }

    /**
     * Called when the slider changes as a multi slider
     */
    onSliderChangeMulti = (value) => {
        this.setState({
            value,
            lowerBound: value[0],
            upperBound: value[1]
        });
    }

    /**
     * Called when the slider changes as a single slider
     */
    onSliderChangeSingle = (value) => {
        this.setState({
            lowerBound: value,
            value: [this.state.lowerBound, this.state.lowerBound],
        })
    }

    /**
     * Applies the year range and processes the data
     */
    handleApply = () => {
        const { lowerBound, upperBound } = this.state;
        this.setState({ value: [lowerBound, upperBound] });
    }

    /** 
     * Clears the data
     */
    handleClear = () => {
        console.log("Clear doughnut chart")
    }

    render() {
        let { width, height, flowData = {} } = this.props;

        return (
            <div className='horizontal-slider-container'>
                <div className='inner-slider' >

                    <div className="yearRangeSlider">
                        {this.state.checked
                            ? <Slider min={1920} max={2020} step={5} marks={markRange}
                                included={false} value={this.state.value[0]} onChange={this.onSliderChangeSingle} />
                            : <Range min={1920} max={2020} step={5} marks={markRange} allowCross={true}
                                value={this.state.value} onChange={this.onSliderChangeMulti} />
                        }

                    </div>

                    <div className="yearRangeLabel">
                        <label>Single: </label>
                        <Switch
                            onChange={this.handleChange}
                            checked={this.state.checked}
                            className="react-switch"
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}
                            className="react-switch"
                            id="material-switch"
                        />

                        {/* <label>LowerBound: </label>&nbsp; */}
                        <input className="inputBox inputLowerBound" type="number"
                            value={this.state.lowerBound} onChange={this.onLowerBoundChange} />
                        {/* <label>UpperBound: </label>&nbsp; */}

                        <div className='year-container'>
                            {this.state.checked
                                ? <span />
                                : <span>
                                    <label> - </label>
                                    <input className="inputBox inputUpperBound" type="number"
                                        value={this.state.upperBound} onChange={this.onUpperBoundChange} />
                                </span>
                            }
                        </div>

                        <button className="btn" onClick={this.handleApply}>APPLY</button>
                        <button className="btn" onClick={this.handleClear}>CLEAR</button>
                    </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(YearRangeSlider);
