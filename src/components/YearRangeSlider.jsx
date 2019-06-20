/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import { getFlowData } from '../utils/requestServer';
import { setFlowData } from '../redux/actions/actions';
import toastr from '../utils/toastr';

var markRange={};

const Range = Slider.Range;

class YearRangeSlider extends Component {

    constructor(props) {
        super(props);
        this.onSliderChange = this.onSliderChange.bind(this);

        for(var i = 1920; i <= 2020; i= i+10){
            markRange[i]=i;
        }

        this.state = {
            lowerBound: 1990,
            upperBound: 2015,
            value: [1990, 2015],
          };

        }

    
        onLowerBoundChange = (e) => {
            // console.log("future: " + e.target.value)
            // console.log("current: " + this.state.lowerBound)
            // console.log("mark range: " + markRange[2020])
            if (!(e.target.value > markRange[ 2020 ]) && !(e.target.value < markRange[ 1920 ]) && (e.target.value < this.state.upperBound)){
                this.setState({ lowerBound: e.target.value>this.state.lowerBound ? +e.target.value+4 : +e.target.value-4  });
            }
        }
        onUpperBoundChange = (e) => {
          if (!(e.target.value > markRange[ 2020 ]) && !(e.target.value < markRange[ 1920 ]) && (e.target.value > this.state.lowerBound)){
            this.setState({ upperBound: e.target.value>this.state.upperBound ? +e.target.value+4 : +e.target.value-4  });
        }
        }
        onSliderChange = (value) => {
          this.setState({
            value,
            lowerBound: value[0],
            upperBound: value[1]
          });
        // console.log(value);

        }
        handleApply = () => {
          const { lowerBound, upperBound } = this.state;
          this.setState({ value: [lowerBound, upperBound] });
        }

    render() {
        let { width, height, flowData = {} } = this.props;

        return (
            <div className='horizontal-slider-container' style={{ 'width': width, 'height': height }}>
                <div className='inner-slider' style={{ 'width': width, 'height': height * 0.80, 'marginBottom': height * 0.1, 'padding': '0 5%' }} >
                    {/* <p className='slider-title'>Decrease Supply</p> */}
                  
                    <Range min={1920} max={2020} step={5} marks={markRange} allowCross={true} value={this.state.value} onChange={this.onSliderChange} />
                    <br />
                    <label>LowerBound: </label>&nbsp;
                    <input type="number" style={{'color':'hsl(0,0%,50%)'}} value={this.state.lowerBound} onChange={this.onLowerBoundChange} />&nbsp;&nbsp;&nbsp;&nbsp;
                    <label>UpperBound: </label>&nbsp;
                    <input type="number" style={{'color':'hsl(0,0%,50%)'}} value={this.state.upperBound} onChange={this.onUpperBoundChange} />&nbsp;&nbsp;&nbsp;
                    <button className="btn" style={{'color': 'white', 'backgroundColor': '#1ca8dd'}} onClick={this.handleApply}>Apply</button>
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
