import React, { Component } from 'react'
import * as d3 from 'd3';
import _ from 'lodash';
import { line, scaleLinear } from 'd3';
import LegendIcon from './LegendIcon'


export default class LegendPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div id='map-legend' className='legend-root-container '>

                <div>
                    <div className='filter-div'>
                        <svg width="600" height="60">
                            <LegendIcon
                                title={"IRRIGATION"}
                                textX={"40"}
                                circleTransform={"translate(60, 5) scale(0.08)"}
                                imageTransform={"translate(60, 7) scale(0.048)"}
                                type={"agri"}
                            />

                            <LegendIcon
                                title={"NON-IRRIGATION"}
                                textX={"145"}
                                circleTransform={"translate(180, 5) scale(0.08)"}
                                imageTransform={"translate(180, 5) scale(0.055)"}
                                type={"demand"}
                            />

                            <LegendIcon
                                title={"INFLOW"}
                                textX={"288"}
                                circleTransform={"translate(300, 5) scale(0.08)"}
                                imageTransform={"translate(300, 5) scale(0.08)"}
                                type={"inflow"}
                            />

                            <LegendIcon
                                title={"RESERVOIR"}
                                textX={"400"}
                                circleTransform={"translate(420, 5) scale(0.08)"}
                                imageTransform={"translate(424, 5) scale(0.05)"}
                                type={"reservoir"}
                            />

                            <LegendIcon
                                title={"SINK"}
                                textX={"536"}
                                circleTransform={"translate(540, 5) scale(0.08)"}
                                imageTransform={"translate(424, 5) scale(0.05)"}
                                type={"sink"}
                            />

                           
                            {/* <g className='river-marker'
                                transform="translate(540, 5) scale(0.08)">
                                <circle
                                    cx='150' cy='150' r='200'
                                    className={'type-sink'}>
                                </circle>
                                <text x="65" y="250" fontSize="250px" className="sink-text" >S</text>
                            </g>
                            <text x="536" y="52.5" className="legend-label">SINK</text> */}

                        </svg>
                    </div>

                    <div className='filter-div'>
                        <svg className='flow-data-chart' width="600" height="60">
                            <g className='lines-container'>
                                <path className='flow-spark-line'
                                    transform={"translate(45, 5)"}
                                    key={'river-line-green'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#51a83a'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="45" y="52.5" className="legend-label">IRRIGATION</text>

                                <path className='flow-spark-line'
                                    transform={"translate(195, 5)"}
                                    key={'river-line-blue'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#428dff'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="180" y="52.5" className="legend-label">NON-IRRIGATION</text>

                                <path className='flow-spark-line'
                                    transform={"translate(345, 5)"}
                                    key={'river-line-gray'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#92cce3'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="354" y="52.5" className="legend-label">INFLOW</text>

                                <path className='flow-spark-line'
                                    transform={"translate(490, 5)"}
                                    key={'river-line-orange'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#f7a02e'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="492" y="52.5" className="legend-label">DIVERSION</text>
                            </g>

                        </svg>
                    </div>
                </div>
            </div>
        );
    }
}
