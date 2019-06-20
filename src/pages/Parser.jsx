import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RiverMap, FilterPanel, FlowPanel, RootSchematic } from '../components';
import axios from 'axios';
import toastr from '../utils/toastr';
import { setFlowData } from '../redux/actions/actions';
import Loading from 'react-loading';
import processSchematic from '../utils/processSchematic';
import xyParser from '../utils/xyParser';
import _ from 'lodash';
import LegendPanel from '../components/MapLegend/LegendPanel';


class Parser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSchematicLoading: false,
            SchematicData: { lines: [], artifacts: [], labels: [], markers: [], selectedRegion: null }
        };
    }

    componentDidMount()
    {
        xyParser("assets/files/xy/southSask.xy");
    }

    render() {
        const { isSchematicLoading, SchematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.state;

        //125px to offset the 30px margin on both sides and vertical scroll bar width
        let widthOfDashboard = document.body.getBoundingClientRect().width - 100,
            mapWidth = widthOfDashboard * 0.65;

        return (
            <div className='dashboard-page-root' >

            
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ setFlowData }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Parser);

