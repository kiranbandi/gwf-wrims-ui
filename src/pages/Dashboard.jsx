import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TubeMap } from '../components';
import axios from 'axios';
import toastr from '../utils/toastr';
import { getFileCatalog } from '../utils/requestServer';
import Loading from 'react-loading';
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
                this.setState({ SchematicData, fileCatalogInfo });
            })
            .catch(() => {
                toastr["error"]("Failed to load schematic", "ERROR");
            })
            // turn off file processing loader
            .finally(() => { this.setState({ 'isSchematicLoading': false }) });
    }


    render() {
        const { isSchematicLoading, SchematicData } = this.state;

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            tubeWidth = widthOfDashboard / 2;

        return (
            <div className='dashboard-page-root' >
                {isSchematicLoading ?
                    <Loading className='loader' type='spin' height='100px' width='100px' color='#d6e5ff' delay={-1} /> :
                    <div className='dashboard-inner-root'>
                        <TubeMap tubeData={SchematicData} width={tubeWidth} height={tubeWidth / 1.75} />
                    </div>

                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(DashboardRoot);

