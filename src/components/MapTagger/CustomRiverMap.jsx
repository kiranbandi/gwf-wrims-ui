import React, { Component } from 'react';
import * as d3 from 'd3';
import attachZoom from '../../utils/attachZoom';
import _ from 'lodash';
import RiverLines from '../RiverMap/RiverLines';
import Artifacts from '../RiverMap/Artifacts';
import RiverLabels from '../RiverMap/RiverLabels';
import Markers from '../RiverMap/Markers';

export default class CustomRiverMap extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { width, fromDashboard = true } = this.props;
        // magic numbers for our chart so it looks good
        let initialZoomScale = (fromDashboard) ? { x: width * 0.50, y: width * 0.25, scale: 1.10 } : { x: width * 0.045, y: width * 0.055, scale: 1.10 };
        attachZoom('river-map', initialZoomScale);
    }

    render() {

        var margin = { top: 80, right: 80, bottom: 20, left: 80 };
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        var lineWidth;
        var lineWidthMultiplier = 0.8;

        const { schematicData = { lines: [], artifacts: [], labels: [], markers: [], title: {} },
            width, height, markerLink } = this.props;

        let name = markerLink.length > 0 ? markerLink.split('#')[2] : '';

        // find the max and min from all the nodes within the lines
        const minX = d3.min(schematicData.lines, (line) => d3.min(line.nodes, (node) => node.coords[0])),
            maxX = d3.max(schematicData.lines, (line) => d3.max(line.nodes, (node) => node.coords[0])),
            minY = d3.min(schematicData.lines, (line) => d3.min(line.nodes, (node) => node.coords[1])),
            maxY = d3.max(schematicData.lines, (line) => d3.max(line.nodes, (node) => node.coords[1]));

        // find the aspect ration based on margin and width
        const desiredAspectRatio = (maxX - minX) / (maxY - minY),
            actualAspectRatio =
                (width - margin.left - margin.right) /
                (height - margin.top - margin.bottom);

        const ratioRatio = actualAspectRatio / desiredAspectRatio;

        let maxXRange, maxYRange;

        // Note that we flip the sense of the y-axis here
        if (desiredAspectRatio > actualAspectRatio) {
            maxXRange = width - margin.left - margin.right;
            maxYRange = (height - margin.top - margin.bottom) * ratioRatio;
        } else {
            maxXRange = (width - margin.left - margin.right) / ratioRatio;
            maxYRange = height - margin.top - margin.bottom;
        }

        // use D3 Scales for given range
        xScale.domain([minX, maxX]).range([margin.left, margin.left + maxXRange]);
        yScale.domain([maxY, minY]).range([margin.top + maxYRange, margin.top]);
        lineWidth = lineWidthMultiplier * (xScale(1) - xScale(0));

        // Clone over data instead of applying a filter mesh 
        let filteredData = _.clone(schematicData);

        const { title = { coords: [], label: '' } } = schematicData;

        return (
            <div id='river-map' style={{ 'width': width, 'height': height }}>
                <svg style={{ 'width': '100%', 'height': '100%' }}>
                    <g className='zoomable'>

                        <RiverLines
                            lines={filteredData.lines}
                            xScale={xScale}
                            yScale={yScale}
                            highlightName={name}
                            onItemClick={this.props.onItemClick}
                            lineWidth={lineWidth} />

                        <Artifacts
                            xScale={xScale}
                            yScale={yScale}
                            highlightName={name}
                            onItemClick={this.props.onItemClick}
                            artifacts={filteredData.artifacts} />

                        <RiverLabels
                            xScale={xScale}
                            yScale={yScale}
                            labels={filteredData.labels}
                            areLabelsVisible={true} />

                        <Markers
                            xScale={xScale}
                            yScale={yScale}
                            highlightName={name}
                            onItemClick={this.props.onItemClick}
                            markers={filteredData.markers}
                            isMock={this.props.isMock} />

                    </g>
                    {/* Display the title from the schema */}
                    <text
                        className='river-model-title'
                        fontSize={(width / 45) + 'px'}
                        x={xScale(title.coords[0])}
                        y={yScale(title.coords[1])}>
                        {title.label}
                    </text>
                </svg>
            </div >
        );
    }
}
