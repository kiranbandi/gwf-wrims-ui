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
        let svgWidth = 600, // Change this if svg width is changed

            // ICON VARIABLES
            numberOfIcons = 5, // When adding a new icon, increment numberOfIcons and make sure the increments_Icons is multiplied by the array index
            increments_Icons = svgWidth / numberOfIcons, startingPoint_Icons = increments_Icons / 2,

            // PATH VARIABLES
            numberOfPaths = 4, // When adding a new path, increment numberOfPaths and make sure the increments_Paths is multiplied by the array index
            increments_Paths = svgWidth / numberOfPaths, startingPoint_Paths = (increments_Paths / 2) - 30
            ;

        return (

            <div id='map-legend' className='legend-root-container '>

                <div>
                    <div className='filter-div'>
                        <svg width={svgWidth} height="60">
                            <LegendIcon
                                title={"IRRIGATION"}
                                textX={(startingPoint_Icons + (increments_Icons * 0) - 20)}
                                circleTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 0)) + ", 5) scale(0.08)"}
                                imageTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 0)) + ", 7) scale(0.048)"}
                                type={"agri"}
                            />

                            <LegendIcon
                                title={"NON-IRRIGATION"}
                                textX={(startingPoint_Icons + (increments_Icons * 1) - 35)}
                                circleTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 1)) + ", 5) scale(0.08)"}
                                imageTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 1)) + ", 5) scale(0.055)"}
                                type={"demand"}
                            />

                            <LegendIcon
                                title={"INFLOW"}
                                textX={(startingPoint_Icons + (increments_Icons * 2) - 12)}
                                circleTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 2)) + ", 5) scale(0.08)"}
                                imageTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 2)) + ", 5) scale(0.08)"}
                                type={"inflow"}
                            />

                            <LegendIcon
                                title={"RESERVOIR"}
                                textX={(startingPoint_Icons + (increments_Icons * 3) - 20)}
                                circleTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 3)) + ", 5) scale(0.08)"}
                                imageTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 3) + 4) + ", 5) scale(0.05)"}
                                type={"reservoir"}
                            />

                            <LegendIcon
                                title={"SINK"}
                                textX={(startingPoint_Icons + (increments_Icons * 4) - 4)}
                                circleTransform={"translate(" + (startingPoint_Icons + (increments_Icons * 4)) + ", 5) scale(0.08)"}
                                type={"sink"}
                            />

                        </svg>
                    </div>

                    <div className='filter-div'>
                        <svg className='flow-data-chart' width={svgWidth} height="60">
                            <g className='lines-container'>
                                <path className='flow-spark-line'
                                    transform={"translate(" + (startingPoint_Paths + (increments_Paths * 0)) + ", 5)"}
                                    key={'river-line-green'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#51a83a'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x={(startingPoint_Paths + (increments_Paths * 0))} y="52.5" className="legend-label">IRRIGATION</text>

                                <path className='flow-spark-line'
                                    transform={"translate(" + (startingPoint_Paths + (increments_Paths * 1)) + ", 5)"}
                                    key={'river-line-blue'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#428dff'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x={(startingPoint_Paths + (increments_Paths * 1) - 15)} y="52.5" className="legend-label">NON-IRRIGATION</text>

                                <path className='flow-spark-line'
                                    transform={"translate(" + (startingPoint_Paths + (increments_Paths * 2)) + ", 5)"}
                                    key={'river-line-gray'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#92cce3'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x={(startingPoint_Paths + (increments_Paths * 2) + 9)} y="52.5" className="legend-label">INFLOW</text>

                                <path className='flow-spark-line'
                                    transform={"translate(" + (startingPoint_Paths + (increments_Paths * 3)) + ", 5)"}
                                    key={'river-line-orange'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#f7a02e'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x={(startingPoint_Paths + (increments_Paths * 3) + 2)} y="52.5" className="legend-label">DIVERSION</text>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        );
    }
}
