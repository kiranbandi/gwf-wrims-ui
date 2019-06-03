import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import attachZoom from '../../utils/attachZoom';
import applyFilterMesh from '../../utils/applyFilterMesh';
import _ from 'lodash';
import RiverLines from './RiverLines';
import Artifacts from './Artifacts';
import RiverLabels from './RiverLabels';
import Markers from './Markers';
import { filter } from 'minimatch';

class RiverMap extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { width } = this.props;
        // magic numbers for our chart so it looks good
        const initialZoomScale = { x: width * 0.50, y: width * 0.30, scale: 1.10 };
        attachZoom('river-map', initialZoomScale);
    }

    render() {

        var margin = { top: 80, right: 80, bottom: 20, left: 80 };
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        var lineWidth;
        var lineWidthMultiplier = 0.8;
        var lineWidthTickRatio = 3 / 2;

        const { schematicData = { lines: [], artifacts: [], labels: [], markers: [], schemaTitle: {} },
            width, height, fileCatalogInfo, filterMesh } = this.props;


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

        // Apply mesh filter on the schematic Data 
        let filteredData = applyFilterMesh(filterMesh, schematicData);

        const { schemaTitle = { coords: [], label: '' } } = schematicData;

        return (
            <div id='river-map' style={{ 'width': width, 'height': height }}>
                <svg style={{ 'width': '100%', 'height': '100%' }}>
                    <g className='zoomable'>

                        <RiverLines
                            lines={filteredData.lines}
                            xScale={xScale}
                            yScale={yScale}
                            lineWidth={lineWidth}
                            lineWidthTickRatio={lineWidthTickRatio} />

                        <Artifacts
                            xScale={xScale}
                            yScale={yScale}
                            artifacts={filteredData.artifacts} />

                        <RiverLabels
                            xScale={xScale}
                            yScale={yScale}
                            labels={filteredData.labels}
                            areLabelsVisible={filterMesh.areLabelsVisible} />

                        <Markers
                            fileCatalogInfo={fileCatalogInfo}
                            xScale={xScale}
                            yScale={yScale}
                            markers={filteredData.markers} />

                    </g>
                    {/* Display the title from the schema */}
                    <text
                        className='river-model-title'
                        fontSize={(width / 45) + 'px'}
                        x={xScale(schemaTitle.coords[0])}
                        y={yScale(schemaTitle.coords[1])}>
                        {schemaTitle.label}
                    </text>
                </svg>
            </div >
        );
    }
}


function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh,
    };
}

export default connect(mapStateToProps, null)(RiverMap);