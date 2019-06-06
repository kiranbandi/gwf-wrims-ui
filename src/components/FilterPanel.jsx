/*global $*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DemandFilter from './FilterComponents/DemandFilter.jsx'
import LabelFilter from './FilterComponents/LabelFilter.jsx'
import InflowFilter from './FilterComponents/InflowFilter.jsx';

class FilterPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { filterMesh, schematicData = { lines: [], artifacts: [], labels: [], markers: [] } } = this.props;

        return (
            <div className='filter-root-container text-center'>
                <DemandFilter schematicData={schematicData} />
                <LabelFilter />
                <InflowFilter schematicData={schematicData} />
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
