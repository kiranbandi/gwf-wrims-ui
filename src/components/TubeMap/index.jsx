import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import attachZoom from '../../utils/attachZoom';
import _ from 'lodash';
import RiverLines from './RiverLines';
import Artifacts from './Artifacts';
import RiverLabels from './RiverLabels';
import Markers from './Markers';

class TubeMap extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        attachZoom('tube-map');
    }

    render() {

        var margin = { top: 80, right: 80, bottom: 20, left: 80 };
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        var lineWidth;
        var lineWidthMultiplier = 0.8;
        var lineWidthTickRatio = 3 / 2;


        const { tubeData = { lines: [], artifacts: [], labels: [], markers: [] },
            width, height, fileCatalogInfo, filterMesh } = this.props;

        const { areDemandsVisible, visibleDemands } = filterMesh;

        // find the max and min from all the nodes within the lines
        const minX = d3.min(tubeData.lines, (line) => d3.min(line.nodes, (node) => node.coords[0])),
            maxX = d3.max(tubeData.lines, (line) => d3.max(line.nodes, (node) => node.coords[0])),
            minY = d3.min(tubeData.lines, (line) => d3.min(line.nodes, (node) => node.coords[1])),
            maxY = d3.max(tubeData.lines, (line) => d3.max(line.nodes, (node) => node.coords[1]));


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

        xScale.domain([minX, maxX]).range([margin.left, margin.left + maxXRange]);
        yScale.domain([maxY, minY]).range([margin.top + maxYRange, margin.top]);
        lineWidth = lineWidthMultiplier * (xScale(1) - xScale(0));


        let filteredLineData, filteredMarkers;

        if (!areDemandsVisible) {
            filteredLineData = _.filter(tubeData.lines, (d) => { return (d.type != 'regular-demand' && d.type != 'irrigation-demand') });
            filteredMarkers = _.filter(tubeData.markers, (d) => { return (d.type != 'demand' && d.type != 'agri') });
        }
        else if (visibleDemands.length > 0) {


            filteredLineData = _.filter(tubeData.lines, (d) => {
                if (d.type == 'regular-demand' || d.type == 'irrigation-demand') {
                    return visibleDemands.indexOf(d.name) > -1;
                }
                return true;
            });

            filteredMarkers = _.filter(tubeData.markers, (d) => {
                if (d.type == 'demand' || d.type == 'agri') {
                    return visibleDemands.indexOf(d.name) > -1;
                }
                return true;
            });

        }
        else {
            filteredLineData = _.clone(tubeData.lines);
            filteredMarkers = _.clone(tubeData.markers);
        }





        return (
            <div id='tube-map' style={{ 'width': width, 'height': height }}>
                <svg style={{ 'width': '100%', 'height': '100%' }}>
                    <g className='zoomable'>

                        <RiverLines
                            lines={filteredLineData}
                            xScale={xScale}
                            yScale={yScale}
                            lineWidth={lineWidth}
                            lineWidthTickRatio={lineWidthTickRatio} />

                        <Artifacts
                            xScale={xScale}
                            yScale={yScale}
                            artifacts={tubeData.artifacts} />

                        <RiverLabels
                            xScale={xScale}
                            yScale={yScale}
                            labels={tubeData.labels} />

                        <Markers
                            fileCatalogInfo={fileCatalogInfo}
                            xScale={xScale}
                            yScale={yScale}
                            markers={filteredMarkers} />

                    </g>
                </svg>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh,
    };
}

export default connect(mapStateToProps, null)(TubeMap);