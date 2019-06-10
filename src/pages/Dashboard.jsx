import React, { Component } from 'react';
import { RiverMap, FilterPanel, FlowPanel, RootSchematic, VerticalSlider } from '../components';
import axios from 'axios';
import toastr from '../utils/toastr';
import Loading from 'react-loading';
import processSchematic from '../utils/processSchematic';
import _ from 'lodash';
import LegendPanel from '../components/MapLegend/LegendPanel';


export default class DashboardRoot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSchematicLoading: false,
            SchematicData: { lines: [], artifacts: [], labels: [], markers: [], selectedRegion: null }
        };
        this.onRegionSelect = this.onRegionSelect.bind(this);
    }

    onRegionSelect(event) {

        const selectedRegion = event.target.id || 'highwood';

        this.setState({ 'isSchematicLoading': true });
        axios.get("/assets/files/schematics/" + selectedRegion + ".json")
            .then((response) => {
                let processedData = processSchematic(response.data);
                this.setState({ 'SchematicData': { ...processedData, selectedRegion } });
            })
            .catch(() => { toastr["error"]("Failed to load schematic", "ERROR") })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });

    }


    render() {
        const { isSchematicLoading, SchematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.state;

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            mapWidth = widthOfDashboard * 0.65,
            widthOfSlider = 100;

        // reduce the width of the slider from the map
        mapWidth = mapWidth - widthOfSlider;


        return (
            <div className='dashboard-page-root' >

                <RootSchematic width={widthOfDashboard} onRegionSelect={this.onRegionSelect} />

                {isSchematicLoading ?
                    <Loading className='loader' type='spin' height='100px' width='100px' color='#d6e5ff' delay={-1} /> :
                    <div className='dashboard-inner-root'>
                        {SchematicData.lines.length > 0 && <div>
                            <FilterPanel schematicData={SchematicData} />
                            <RiverMap
                                schematicData={SchematicData}
                                width={mapWidth}
                                height={mapWidth / 1.75} />
                            <VerticalSlider
                                width={widthOfSlider}
                                height={mapWidth / 1.75} />
                            <FlowPanel
                                width={widthOfDashboard * 0.35}
                                height={mapWidth / 1.75} />
                            <LegendPanel />
                        </div>}
                    </div>
                }
            </div>
        );
    }
}

