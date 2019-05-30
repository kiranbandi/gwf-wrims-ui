/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { line, scaleLinear } from 'd3';
import Loading from 'react-loading';

class FlowPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const { flowData = {}, width, height } = this.props,
            { dataList = [], path = {}, isLoading = false } = flowData,
            margin = 20,
            innerWidth = width - 40,
            innerHeight = height - 100;

        const xScale = scaleLinear()
            .domain([0, dataList.length - 1])
            .range([margin, innerWidth - margin]);

        const yScale = scaleLinear()
            .domain([_.max(dataList), _.min(dataList)])
            .range([margin, innerHeight - margin])

        const lineData = _.map(dataList, (d, i) => ({ x: xScale(i), y: yScale(d) }));

        const d3Line = line().x((d) => d.x).y((d) => d.y);


        return (
            <div className='flow-panel-root-container' style={{ width, height }}>
                <h4 className='title-bar text-center m-a'>FLOW DATA</h4>
                {isLoading ?
                    <Loading className='loader' type='spin' height='75px' width='75px' color='#d6e5ff' delay={-1} /> :
                    <div className='flow-inner-container'>
                        <svg height={innerHeight + 10} width={innerWidth} className='flow-data-chart'>
                            <path className='flow-spark-line' d={d3Line(lineData)}></path>
                            <text className='flow-text' x={(width / 2) - 150} y={innerHeight + 10}>
                                {dataList.length > 0 ? 'Time Period - ' + path.time.split("-").join(" - ") : 'No Data Available'}
                            </text>
                        </svg>
                    </div>
                }
            </div>);
    }
}

function mapStateToProps(state) {
    return {
        flowData: state.delta.flowData
    };
}

export default connect(mapStateToProps)(FlowPanel);
