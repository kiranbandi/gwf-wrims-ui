import React, { Component } from 'react';
import { RiverMap, FilterPanel, FlowPanel, RootSchematic, VerticalSlider } from '../components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setFlowData } from '../redux/actions/actions';
import axios from 'axios';
import toastr from '../utils/toastr';
import Loading from 'react-loading';
import processSchematic from '../utils/processSchematic';
import { getFlowData } from '../utils/requestServer';
import _ from 'lodash';
import LegendPanel from '../components/MapLegend/LegendPanel';


class DashboardRoot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSchematicLoading: false,
            selectedPlace: '',
            SchematicData: { lines: [], artifacts: [], labels: [], markers: [], selectedRegion: null }
        };
        this.onRegionSelect = this.onRegionSelect.bind(this);
        this.onPlaceSelect = this.onPlaceSelect.bind(this);
    }

    onRegionSelect(event) {
        const selectedRegion = event.target.id || 'highwood';
        this.setState({ 'isSchematicLoading': true });
        axios.get("/assets/files/schematics/" + selectedRegion + ".json")
            .then((response) => {
                let processedData = processSchematic(response.data);
                this.setState({ 'SchematicData': { ...processedData, selectedRegion, selectedPlace: '' } });
            })
            .catch(() => { toastr["error"]("Failed to load schematic", "ERROR") })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });
    }

    onPlaceSelect(event) {
        /* id is model#type#name#number */
        const selectorList = event.target.id.split("#");

        let selectedRegion = selectorList[0],
            processedData, flowParams, name;

        this.setState({ 'isSchematicLoading': true });
        axios.get("/assets/files/schematics/" + selectorList[0] + ".json")
            .then((response) => {
                processedData = processSchematic(response.data);
                flowParams = {
                    modelID: selectorList[0],
                    threshold: 'base',
                    number: selectorList[3],
                    type: selectorList[1]
                };
                name = selectorList[2];
                return getFlowData(flowParams);
            })
            .then((records) => {
                let dataList = _.map(records, (d) => (
                    {
                        'flow': (Math.round(Number(d.flow) * 1000) / 1000),
                        'timestamp': d.timestamp
                    }));
                this.setState({ 'SchematicData': { ...processedData, selectedRegion }, selectedPlace: selectorList.join('#') }, () => {
                    this.props.actions.setFlowData({ dataList, name, flowParams, isLoading: false });
                });

            })
            .catch(() => {
                toastr["error"]("Failed to load schematic", "ERROR")
            })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });


    }


    render() {
        const { isSchematicLoading, selectedPlace,
            SchematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.state;

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            mapWidth = widthOfDashboard * 0.65,
            widthOfSlider = 100;

        // reduce the width of the slider from the map
        mapWidth = mapWidth - widthOfSlider;


        return (
            <div className='dashboard-page-root' >

                <RootSchematic
                    width={widthOfDashboard}
                    selectedPlace={selectedPlace}
                    onPlaceSelect={this.onPlaceSelect}
                    onRegionSelect={this.onRegionSelect} />

                {isSchematicLoading ?
                    <Loading className='loader' type='spin' height='100px' width='100px' color='#d6e5ff' delay={-1} /> :
                    <div className='dashboard-inner-root'>
                        {SchematicData.lines.length > 0 && <div>
                            <FilterPanel schematicData={SchematicData} />
                            <RiverMap
                                schematicData={SchematicData}
                                width={mapWidth}
                                height={mapWidth / 1.75}
                                isMock={false} />
                            <VerticalSlider
                                width={widthOfSlider}
                                height={mapWidth / 1.75} />
                            <FlowPanel
                                width={widthOfDashboard * 0.35}
                                height={mapWidth / 1.75} />
                            <LegendPanel width={widthOfDashboard} />
                        </div>}
                    </div>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(DashboardRoot);
