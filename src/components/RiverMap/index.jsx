import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as d3 from 'd3';
import attachZoom from '../../utils/attachZoom';
import applyFilterMesh from '../../utils/applyFilterMesh';
import { getFlowData } from '../../utils/requestServer';
import { setFlowData, setUserData } from '../../redux/actions/actions';

import _ from 'lodash';
import RiverLines from './RiverLines';
import Artifacts from './Artifacts';
import RiverLabels from './RiverLabels';
import Markers from './Markers';

class RiverMap extends Component {
    constructor(props) {
        super(props);
        this.onItemClick = this.onItemClick.bind(this);
    }

    componentDidMount() {
        const { width, fromDashboard = true, scaleFix } = this.props;

        // magic numbers for our chart so it looks good
        let initialZoomScale = (fromDashboard) ? { x: width * 0.50, y: width * 0.25, scale: 1.10 } : { x: width * 0.045, y: width * 0.055, scale: 1.10 };
        
        // for when the user is in stakeholder mode
        initialZoomScale = (scaleFix) ? { x: width * 0.045, y: width * 0.015, scale: 1.10 } : initialZoomScale;
        attachZoom('river-map', initialZoomScale);
    }

    onItemClick(itemType, params) {

        let { schematicData, actions, flowData = {}, fromDashboard = true } = this.props,
            { flowParams = { threshold: 'base-base' }, isLoading = false } = flowData;

        if (!fromDashboard) { return; }

        // if there is a call in progress ignore the click
        if (!isLoading) {

            let modelID = schematicData.selectedRegion,
                threshold = flowParams.threshold, number, type, name = params.name;

            // ignore clicks on junctions for now
            if (itemType == 'marker' && params.type == 'junction') {
                return;
            }
            else if (itemType == 'marker' && (params.type == 'agri' || params.type == 'demand')) {
                number = params.nodeNum;
                type = 'demand';
            }
            else if (itemType == 'marker' && params.type == 'inflow') {
                number = params.nodeNum;
                type = 'inflow';
            }
            else if (itemType == 'artifact' && params.type == 'reservoir') {
                number = params.nodeNum;
                type = 'reservoir';
            }
            else if (itemType == 'link') {
                number = params.linkNum;
                type = 'link';
            }

            flowParams = { modelID, threshold, number, type };
            this.props.actions.setUserData(`${modelID}#${type}#${name}#${number}`);

            actions.setFlowData({ dataList: [], name, flowParams, isLoading: true });
            getFlowData(flowParams)
                .then((records) => {
                    let dataList = _.map(records, (d) => (
                            d.power?
                            {
                                'flow': (Math.round(Number(d.flow) * 1000) / 1000),
                                'timestamp': d.timestamp,
                                'power': d.power

                            }
                            :
                            {
                                'flow': (Math.round(Number(d.flow) * 1000) / 1000),
                                'timestamp': d.timestamp
                            }
                    ));

                    actions.setFlowData({ dataList, name, flowParams, isLoading: false });
                })
                .catch((error) => {
                    console.log('error fetching and parsing flow data');
                    actions.setFlowData({ dataList: [], name, flowParams, isLoading: false });
                })
        }

    }

    render() {

        var margin = { top: 80, right: 80, bottom: 20, left: 80 };
        var xScale = d3.scaleLinear();
        var yScale = d3.scaleLinear();
        var lineWidth;
        var lineWidthMultiplier = 0.8;

        const { schematicData = { lines: [], artifacts: [], labels: [], markers: [], title: {} },
            width, height, filterMesh, flowData = {}, trackedNode } = this.props,
            { name = '' } = flowData;



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
                            onItemClick={this.onItemClick}
                            lineWidth={lineWidth}
                            trackedLink={trackedNode}/>

                        <Artifacts
                            xScale={xScale}
                            yScale={yScale}
                            highlightName={name}
                            onItemClick={this.onItemClick}
                            artifacts={filteredData.artifacts} 
                            trackedNode={trackedNode}/>

                        <RiverLabels
                            xScale={xScale}
                            yScale={yScale}
                            labels={filteredData.labels}
                            areLabelsVisible={filterMesh.areLabelsVisible} />

                        <Markers
                            xScale={xScale}
                            yScale={yScale}
                            highlightName={name}
                            onItemClick={this.onItemClick}
                            markers={filteredData.markers}
                            isMock={this.props.isMock} 
                            trackedNode={trackedNode}/>

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


function mapStateToProps(state) {
    return {
        flowData: state.delta.flowData,
        filterMesh: state.delta.filterMesh,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setFlowData, setUserData }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RiverMap);