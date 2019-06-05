import React, { Component } from 'react'
import * as d3 from 'd3';
import _ from 'lodash';
import { line, scaleLinear } from 'd3';


export default class LegendPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div id='map-legend' className='legend-root-container '>
                <svg width="200" height="25">
                    <text fontSize="20px" x='65' y='25' className="legend-label">LEGEND</text>

                </svg>
                <div>
                    <div className='filter-div'>
                        <svg width="200" height="200">
                            <g key={'marker-gray'} className='river-marker'
                                transform={"translate(5, 5) scale(0.08)"}>
                                <circle
                                    cx='150' cy='150' r='200'
                                    className={'type-inflow'}>
                                </circle>
                            </g>
                            <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 5)"}>
                                - Inflow Marker</text>
                            <g key={'marker-blue'} className='river-marker'
                                transform={"translate(5, 45) scale(0.08)"}>
                                <circle
                                    cx='150' cy='150' r='200'
                                    className={'type-demand'}>
                                </circle>
                            </g>
                            <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 45)"}>
                                - Demand Marker</text>
                            <g key={'marker-green'} className='river-marker'
                                transform={"translate(5, 85) scale(0.08)"}>
                                <circle
                                    cx='150' cy='150' r='200'
                                    className={'type-agri'}>
                                </circle>
                            </g>
                            <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 85)"}>
                                - Agri Marker</text>
                            <g key={'reservoir-cyan'} className='river-marker'
                                transform={"translate(8, 125) scale(0.11)"}>
                                <circle cx='150' cy='150' r='200'
                                    className={'type-reservoir'}
                                />
                            </g>
                            <text x="65" y="20" fontSize="10px" className="legend-label" transform={"translate(5, 125)"}>
                                - Reservoir Marker</text>
                        </svg>
                    </div>

                    <div className='filter-div'>
                        <svg className='flow-data-chart'>
                            <g className='lines-container'>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 5)"}
                                    key={'river-line-gray'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#5c6b84'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 5)"}>
                                    - Inflow Flow</text>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 45)"}
                                    key={'river-line-blue'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#428dff'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 45)"}>
                                    - Demand Flow</text>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 85)"}
                                    key={'river-line-green'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#51a83a'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 85)"}>
                                    - Agri Flow</text>
                                <path className='flow-spark-line'
                                    transform={"translate(5, 125)"}
                                    key={'river-line-orange'}
                                    d=" M 5 10 L 60 10"
                                    stroke={'#f7a02e'}
                                    strokeWidth={'2.25'}
                                    className={'river forward-flow'}
                                />
                                <text x="65" y="13" fontSize="10px" className="legend-label" transform={"translate(5, 125)"}>
                                    - River Flow</text>
                            </g>

                        </svg>
                    </div>
                </div>
            </div>
        );
    }
}
