import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RiverMap, FilterPanel, FlowPanel } from '../components';
import axios from 'axios';
import toastr from '../utils/toastr';
import { getFileCatalog, getPathData } from '../utils/requestServer';
import { setFlowData } from '../redux/actions/actions';
import Loading from 'react-loading';
import processFlowData from '../utils/processFlowData';
import _ from 'lodash';

class DashboardRoot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSchematicLoading: false,
            SchematicData: { lines: [], artifacts: [], labels: [], markers: [] },
            fileCatalogInfo: []
        };
    }


    componentDidMount() {

        var SchematicData = {}, fileCatalogInfo = [];

        this.setState({ 'isSchematicLoading': true });


        axios.get("/assets/files/schematic.json")
            .then((response) => {
                SchematicData = _.clone(response.data);
                return getFileCatalog();
            })
            .then((response) => {
                // The server response is in a weird format 
                //  so quick fix for now ignore lines that dont have pipe "|" symbol in them
                const filteredResponse = _.filter(response.split("\n"), (d) => (d.indexOf('|') > -1));
                fileCatalogInfo = _.map(filteredResponse, (row) => {
                    const values = row.split("|");
                    return { "a": values[1], "b": values[2], "c": values[3], "time": values[4] };
                });
                // fetch flow data for first value in the catalog
                return getPathData(fileCatalogInfo[0])
            })
            .then((data) => {
                this.props.actions.setFlowData(
                    {
                        dataList: processFlowData(data),
                        path: fileCatalogInfo[0],
                        isLoading: false
                    });
                this.setState({ SchematicData, fileCatalogInfo });
            })
            .catch(() => {
                toastr["error"]("Failed to load schematic", "ERROR");
            })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });
    }


    render() {
        const { isSchematicLoading, SchematicData, fileCatalogInfo } = this.state;

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            mapWidth = widthOfDashboard * 0.65;

        return (
            <div className='dashboard-page-root' >
                {isSchematicLoading ?
                    <Loading className='loader' type='spin' height='100px' width='100px' color='#d6e5ff' delay={-1} /> :
                    <div className='dashboard-inner-root'>
                        <FilterPanel schematicData={SchematicData} />
                        <RiverMap
                            schematicData={SchematicData}
                            fileCatalogInfo={fileCatalogInfo}
                            width={mapWidth}
                            height={mapWidth / 1.75} />
                        <FlowPanel
                            width={widthOfDashboard * 0.35}
                            height={mapWidth / 1.75} />
                    </div>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({setFlowData}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(DashboardRoot);

