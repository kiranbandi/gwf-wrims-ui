/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DemandFilter from './FilterComponents/DemandFilter.jsx'
import LabelFilter from './FilterComponents/LabelFilter.jsx'
import InflowFilter from './FilterComponents/InflowFilter.jsx';
import AmenitiesFilter from './FilterComponents/AmenitiesFilter.jsx';
import GaugeFilter from './FilterComponents/GaugeFilter.jsx';


class FilterPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props;

        return (
            <div className='filter-root-container '>

                {/* <div className="vr" /> */}
                <div className='filter-div'>
                    <DemandFilter schematicData={schematicData} />
                </div>
                {/* <div className="vr" /> */}
                <div className='filter-div'>
                    <InflowFilter schematicData={schematicData} />
                </div>
                <div className='filter-div'>
                    <AmenitiesFilter schematicData={schematicData} />
                </div>
                <div className='filter-div'>
                    <GaugeFilter schematicData={schematicData} />
                </div>
                <div className='filter-div filter-general'>
                    <LabelFilter />
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        filterMesh: state.delta.filterMesh
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterPanel);
